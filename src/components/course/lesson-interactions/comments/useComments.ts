import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  likes_count: number;
  dislikes_count: number;
  user: {
    first_name: string;
    last_name: string;
    avatar_url: string;
  };
  replies?: Comment[];
  user_like?: boolean | null;
}

export const useComments = (lessonId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [totalComments, setTotalComments] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const channel = supabase
      .channel('lesson_comments')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lesson_comments',
          filter: `lesson_id=eq.${lessonId}`
        },
        () => {
          loadComments();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comment_likes',
        },
        () => {
          loadComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [lessonId]);

  const loadComments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: commentsData, error } = await supabase
        .from('lesson_comments')
        .select(`
          *,
          user:profiles(first_name, last_name, avatar_url)
        `)
        .eq('lesson_id', lessonId)
        .is('parent_id', null)
        .order('likes_count', { ascending: false });

      if (error) throw error;

      const commentsWithReplies = await Promise.all(
        commentsData.map(async (comment) => {
          const { data: replies } = await supabase
            .from('lesson_comments')
            .select(`
              *,
              user:profiles(first_name, last_name, avatar_url)
            `)
            .eq('parent_id', comment.id)
            .order('created_at', { ascending: true });

          const { data: userLikes } = await supabase
            .from('comment_likes')
            .select('is_like')
            .eq('comment_id', comment.id)
            .eq('user_id', user.id);

          const userLike = userLikes && userLikes.length > 0 ? userLikes[0].is_like : null;

          return {
            ...comment,
            replies: replies || [],
            user_like: userLike,
          };
        })
      );

      setComments(commentsWithReplies);
      setTotalComments(
        commentsWithReplies.reduce(
          (acc, comment) => acc + 1 + (comment.replies?.length || 0),
          0
        )
      );
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

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
    comments,
    totalComments,
    addComment,
    addReply,
    handleLike,
  };
};