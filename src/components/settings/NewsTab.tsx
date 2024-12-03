import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import NewsForm from "./news/NewsForm";
import NewsTable from "./news/NewsTable";
import { useNewsMutations } from "./news/useNewsMutations";

interface News {
  id: string;
  title: string;
  content: string;
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
  
  const { createNewsMutation, updateNewsMutation, deleteNewsMutation } = useNewsMutations();

  const { data: news, isLoading } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as News[];
    },
  });

  const handleSubmit = (formData: any) => {
    if (editingNews) {
      updateNewsMutation.mutate({ id: editingNews.id, data: formData });
    } else {
      createNewsMutation.mutate(formData);
    }
    setIsOpen(false);
    setEditingNews(null);
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