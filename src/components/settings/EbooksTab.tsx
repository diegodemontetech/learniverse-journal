import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import EbookList from "./ebook/EbookList";
import EbookDialog from "./ebook/EbookDialog";
import EbookViewerDialog from "./ebook/EbookViewerDialog";
import { useEbookMutations } from "./ebook/useEbookMutations";
import { Ebook } from "@/types/course";
import { useToast } from "@/hooks/use-toast";

const EbooksTab = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedEbook, setSelectedEbook] = useState<Ebook | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: ebooks, isLoading } = useQuery({
    queryKey: ["ebooks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ebooks")
        .select("*, category_id, categories(id, name)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Ebook[];
    },
  });

  const { createEbookMutation, updateEbookMutation, deleteEbookMutation } = useEbookMutations();

  const handleSubmit = (formData: Partial<Ebook>) => {
    if (selectedEbook) {
      updateEbookMutation.mutate({
        id: selectedEbook.id,
        data: formData,
      });
    } else {
      createEbookMutation.mutate(formData as any);
    }
    setIsOpen(false);
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
        <Button
          onClick={() => {
            setSelectedEbook(null);
            setIsOpen(true);
          }}
        >
          Novo E-book
        </Button>
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

      <EbookDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        selectedEbook={selectedEbook}
        onSubmit={handleSubmit}
      />

      <EbookViewerDialog
        isOpen={viewerOpen}
        onOpenChange={setViewerOpen}
        selectedEbook={selectedEbook}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default EbooksTab;