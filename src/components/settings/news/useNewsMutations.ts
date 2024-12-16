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
  preview_content?: string;
}

export const useNewsMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const verifyAdminAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuário não autenticado");

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError) throw profileError;
    if (profile.role !== "admin") throw new Error("Permissão negada");

    return user.id;
  };

  const createNewsMutation = useMutation({
    mutationFn: async (data: Omit<NewsFormData, 'author_id'>) => {
      const userId = await verifyAdminAccess();
      
      const { error } = await supabase
        .from("news")
        .insert([{ ...data, author_id: userId }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      toast({ 
        title: "Sucesso",
        description: "Notícia criada com sucesso!" 
      });
    },
    onError: (error: any) => {
      console.error("Error creating news:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar notícia. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const updateNewsMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Omit<NewsFormData, 'author_id'> }) => {
      await verifyAdminAccess();
      
      const { error } = await supabase
        .from("news")
        .update(data)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      toast({ 
        title: "Sucesso",
        description: "Notícia atualizada com sucesso!" 
      });
    },
    onError: (error: any) => {
      console.error("Error updating news:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar notícia. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const deleteNewsMutation = useMutation({
    mutationFn: async (id: string) => {
      await verifyAdminAccess();
      
      const { error } = await supabase
        .from("news")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      toast({ 
        title: "Sucesso",
        description: "Notícia excluída com sucesso!" 
      });
    },
    onError: (error: any) => {
      console.error("Error deleting news:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir notícia. Tente novamente.",
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