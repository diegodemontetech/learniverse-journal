import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useCommentsActions = (lessonId: string, toast: ReturnType<typeof useToast>["toast"]) => {
  const addComment = async (content: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) throw new Error("User not authenticated");

      const { error } = await supabase.from("lesson_comments").insert({
        lesson_id: lessonId,
        user_id: user.id,
        content,
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o comentário. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const addReply = async (content: string, parentId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para responder.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("lesson_comments").insert({
        lesson_id: lessonId,
        user_id: user.id,
        content,
        parent_id: parentId,
      });

      if (error) {
        toast({
          title: "Erro",
          description: "Não foi possível adicionar a resposta. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding reply:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a resposta. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleLike = async (commentId: string, isLike: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para curtir comentários.",
          variant: "destructive",
        });
        return;
      }

      // Check if user already liked/disliked
      const { data: existingLike } = await supabase
        .from("comment_likes")
        .select("*")
        .eq("comment_id", commentId)
        .eq("user_id", user.id)
        .single();

      if (existingLike) {
        // If same action, remove like/dislike
        if (existingLike.is_like === isLike) {
          const { error } = await supabase
            .from("comment_likes")
            .delete()
            .eq("id", existingLike.id);

          if (error) throw error;
        } else {
          // If different action, update
          const { error } = await supabase
            .from("comment_likes")
            .update({ is_like: isLike })
            .eq("id", existingLike.id);

          if (error) throw error;
        }
      } else {
        // Create new like/dislike
        const { error } = await supabase.from("comment_likes").insert({
          comment_id: commentId,
          user_id: user.id,
          is_like: isLike,
        });

        if (error) throw error;
      }
    } catch (error) {
      console.error("Error handling like:", error);
      toast({
        title: "Erro",
        description: "Não foi possível processar sua ação. Tente novamente.",
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