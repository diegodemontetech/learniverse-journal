import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import NewsForm from "./news/NewsForm";
import NewsTable from "./news/NewsTable";
import { useNewsMutations } from "./news/useNewsMutations";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface News {
  id: string;
  title: string;
  content: string;
  preview_content: string;
  thumbnail_url: string | null;
  main_image_url: string | null;
  video_url: string | null;
  is_featured: boolean;
  layout_position: string;
  created_at: string;
}

const NewsTab = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { createNewsMutation, updateNewsMutation, deleteNewsMutation } = useNewsMutations();

  // Check authentication and admin status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Acesso negado",
          description: "Você precisa estar logado para acessar esta página.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (profile?.role !== 'admin') {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para acessar esta página.",
          variant: "destructive",
        });
        navigate("/");
      }
    };

    checkAuth();
  }, [navigate, toast]);

  // Set up subscription to auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!session) {
        navigate("/");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const { data: news, isLoading } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Não autorizado");

      const { data, error } = await supabase
        .from("news")
        .select(`
          *,
          author:profiles(first_name, last_name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as News[];
    },
  });

  const handleSubmit = async (formData: any) => {
    try {
      if (editingNews) {
        await updateNewsMutation.mutateAsync({ id: editingNews.id, data: formData });
      } else {
        await createNewsMutation.mutateAsync(formData);
      }
      setIsOpen(false);
      setEditingNews(null);
    } catch (error) {
      console.error("Error submitting news:", error);
      toast({
        title: "Erro",
        description: "Erro ao salvar a notícia. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (news: News) => {
    setEditingNews(news);
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta notícia?")) {
      deleteNewsMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gerenciar Notícias</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingNews(null);
                setIsOpen(true);
              }}
            >
              Nova Notícia
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingNews ? "Editar Notícia" : "Nova Notícia"}
              </DialogTitle>
            </DialogHeader>
            <NewsForm
              initialData={editingNews || undefined}
              onSubmit={handleSubmit}
              isEditing={!!editingNews}
            />
          </DialogContent>
        </Dialog>
      </div>

      <NewsTable
        news={news || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default NewsTab;