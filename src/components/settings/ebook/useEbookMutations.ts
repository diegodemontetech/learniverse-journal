import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreateEbookDTO, UpdateEbookDTO } from "@/types/course";
import { useToast } from "@/hooks/use-toast";

export const useEbookMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createEbookMutation = useMutation({
    mutationFn: async (data: CreateEbookDTO) => {
      const { error } = await supabase.from("ebooks").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ebooks"] });
      toast({ title: "E-book criado com sucesso!" });
    },
    onError: () => {
      toast({
        title: "Erro ao criar e-book",
        variant: "destructive",
      });
    },
  });

  const updateEbookMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateEbookDTO }) => {
      const { error } = await supabase
        .from("ebooks")
        .update(data)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ebooks"] });
      toast({ title: "E-book atualizado com sucesso!" });
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

  return {
    createEbookMutation,
    updateEbookMutation,
    deleteEbookMutation,
  };
};