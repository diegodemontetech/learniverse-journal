import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import EbookForm from "./ebook/EbookForm";
import EbookList from "./ebook/EbookList";
import EbookViewer from "./ebook/EbookViewer";

interface Ebook {
  id: string;
  title: string;
  author: string;
  description: string;
  thumbnail_url: string;
  pdf_url: string;
  total_pages: number;
  category_id: string;
  category?: {
    name: string;
  };
}

const EbooksTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedEbook, setSelectedEbook] = useState<Ebook | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: ebooks, isLoading } = useQuery({
    queryKey: ["ebooks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ebooks")
        .select(`*, category:categories(name)`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Ebook[];
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  const createEbookMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase.from("ebooks").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ebooks"] });
      toast({ title: "E-book criado com sucesso!" });
      setIsOpen(false);
    },
    onError: () => {
      toast({
        title: "Erro ao criar e-book",
        variant: "destructive",
      });
    },
  });

  const updateEbookMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { error } = await supabase
        .from("ebooks")
        .update(data)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ebooks"] });
      toast({ title: "E-book atualizado com sucesso!" });
      setIsOpen(false);
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar e-book",
        variant: "destructive",
      });
    },
  });

  const deleteEbookMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("ebooks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ebooks"] });
      toast({ title: "E-book excluído com sucesso!" });
    },
    onError: () => {
      toast({
        title: "Erro ao excluir e-book",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (formData: any) => {
    if (selectedEbook) {
      updateEbookMutation.mutate({
        id: selectedEbook.id,
        data: formData,
      });
    } else {
      createEbookMutation.mutate(formData);
    }
  };

  const handlePageChange = async (newPage: number) => {
    if (!selectedEbook) return;
    
    setCurrentPage(newPage);
    
    const { error } = await supabase.from("user_ebook_progress").upsert({
      user_id: (await supabase.auth.getUser()).data.user?.id,
      ebook_id: selectedEbook.id,
      current_page: newPage,
      completed_at: newPage === selectedEbook.total_pages ? new Date().toISOString() : null,
    });

    if (error) {
      toast({
        title: "Erro ao atualizar progresso",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">E-books</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setSelectedEbook(null);
                setIsOpen(true);
              }}
            >
              Novo E-book
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedEbook ? "Editar E-book" : "Novo E-book"}
              </DialogTitle>
            </DialogHeader>
            <EbookForm
              initialData={selectedEbook}
              onSubmit={handleSubmit}
              onCancel={() => setIsOpen(false)}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
          <DialogContent className="max-w-[95vw] h-[90vh]">
            <DialogHeader>
              <DialogTitle>{selectedEbook?.title}</DialogTitle>
            </DialogHeader>
            <EbookViewer
              ebook={selectedEbook}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-6">
          <EbookList
            ebooks={ebooks || []}
            onEdit={(ebook) => {
              setSelectedEbook(ebook);
              setIsOpen(true);
            }}
            onDelete={(id) => {
              if (window.confirm("Tem certeza que deseja excluir este e-book?")) {
                deleteEbookMutation.mutate(id);
              }
            }}
            onView={(ebook) => {
              setSelectedEbook(ebook);
              setCurrentPage(1);
              setViewerOpen(true);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EbooksTab;