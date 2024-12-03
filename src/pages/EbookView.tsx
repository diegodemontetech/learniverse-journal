import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Ebook } from "@/types/course";
import { useToast } from "@/hooks/use-toast";
import EbookViewer from "@/components/settings/ebook/EbookViewer";

const EbookView = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);

  const { data: ebook, isLoading } = useQuery({
    queryKey: ["ebook", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ebooks")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Ebook;
    },
  });

  const handlePageChange = async (newPage: number) => {
    if (!ebook) return;
    
    setCurrentPage(newPage);
    
    const { error } = await supabase.from("user_ebook_progress").upsert({
      user_id: (await supabase.auth.getUser()).data.user?.id,
      ebook_id: ebook.id,
      current_page: newPage,
      completed_at: newPage === ebook.total_pages ? new Date().toISOString() : null,
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

  if (!ebook) {
    return <div>E-book não encontrado</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-i2know-body">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">{ebook.title}</h1>
        <p className="text-i2know-text-secondary">{ebook.author}</p>
      </div>

      <div className="bg-i2know-card rounded-lg p-6">
        <EbookViewer
          ebook={ebook}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default EbookView;