import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface NewsFormData {
  title: string;
  content: string;
  thumbnail_url: string;
  main_image_url: string;
  video_url: string;
  is_featured: boolean;
  layout_position: string;
  author_id: string;
}

export const useNewsMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createNewsMutation = useMutation({
    mutationFn: async (data: NewsFormData) => {
      const { error } = await supabase.from("news").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      toast({ title: "Notícia criada com sucesso!" });
    },
    onError: (error: any) => {
      console.error("Error creating news:", error);
      toast({
        title: "Erro ao criar notícia",
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive",
      });
    },
  });

  const updateNewsMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: NewsFormData }) => {
      const { error } = await supabase
        .from("news")
        .update(data)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      toast({ title: "Notícia atualizada com sucesso!" });
    },
    onError: (error: any) => {
      console.error("Error updating news:", error);
      toast({
        title: "Erro ao atualizar notícia",
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive",
      });
    },
  });

  const deleteNewsMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("news").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      toast({ title: "Notícia excluída com sucesso!" });
    },
    onError: (error: any) => {
      console.error("Error deleting news:", error);
      toast({
        title: "Erro ao excluir notícia",
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive",
      });
    },
  });

  return {
    createNewsMutation,
    updateNewsMutation,
    deleteNewsMutation,
  };
};