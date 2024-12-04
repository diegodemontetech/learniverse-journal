import { supabase } from "@/integrations/supabase/client";
import { ToastProps } from "@/components/ui/toast";

export const useCommentsActions = (lessonId: string, toast: { (props: ToastProps): void }) => {
  const addComment = async (content: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para comentar",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('lesson_comments')
        .insert({
          lesson_id: lessonId,
          user_id: user.id,
          content,
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Comentário adicionado com sucesso",
      });
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar seu comentário",
        variant: "destructive",
      });
    }
  };

  const addReply = async (parentId: string, content: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para responder",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('lesson_comments')
        .insert({
          lesson_id: lessonId,
          user_id: user.id,
          content,
          parent_id: parentId,
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Resposta adicionada com sucesso",
      });
    } catch (error) {
      console.error('Error posting reply:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar sua resposta",
        variant: "destructive",
      });
    }
  };

  const handleLike = async (commentId: string, isLike: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para avaliar",
          variant: "destructive",
        });
        return;
      }

      const { data: existingLike } = await supabase
        .from('comment_likes')
        .select('*')
        .eq('comment_id', commentId)
        .eq('user_id', user.id)
        .single();

      if (existingLike?.is_like === isLike) {
        const { error } = await supabase
          .from('comment_likes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('comment_likes')
          .upsert({
            comment_id: commentId,
            user_id: user.id,
            is_like: isLike,
          });

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error updating like:', error);
      toast({
        title: "Erro",
        description: "Não foi possível registrar sua avaliação",
        variant: "destructive",
      });
    }
  };

  return {
    addComment,
    addReply,
    handleLike,
  };
};
