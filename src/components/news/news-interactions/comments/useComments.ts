import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useCommentsSubscription } from "./useCommentsSubscription";
import type { Comment } from "./types";

export const useComments = (newsId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [totalComments, setTotalComments] = useState(0);
  const { toast } = useToast();

  // Subscribe to realtime changes
  useCommentsSubscription(newsId, () => {
    loadComments();
  });

  const loadComments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: commentsData, error } = await supabase
        .from('news_comments')
        .select(`
          *,
          user:profiles(first_name, last_name, avatar_url)
        `)
        .eq('news_id', newsId)
        .is('parent_id', null)
        .order('likes_count', { ascending: false });

      if (error) throw error;

      const commentsWithReplies = await Promise.all(
        commentsData.map(async (comment) => {
          const { data: replies } = await supabase
            .from('news_comments')
            .select(`
              *,
              user:profiles(first_name, last_name, avatar_url)
            `)
            .eq('parent_id', comment.id)
            .order('created_at', { ascending: true });

          const { data: userLikes } = await supabase
            .from('news_comment_likes')
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
      if (!user?.id) throw new Error("User not authenticated");

      const { error } = await supabase.from("news_comments").insert({
        news_id: newsId,
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

  const addReply = async (parentId: string, content: string) => {
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

      const { error } = await supabase.from("news_comments").insert({
        news_id: newsId,
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
        .from("news_comment_likes")
        .select("*")
        .eq("comment_id", commentId)
        .eq("user_id", user.id)
        .single();

      if (existingLike) {
        // If same action, remove like/dislike
        if (existingLike.is_like === isLike) {
          const { error } = await supabase
            .from("news_comment_likes")
            .delete()
            .eq("id", existingLike.id);

          if (error) throw error;
        } else {
          // If different action, update
          const { error } = await supabase
            .from("news_comment_likes")
            .update({ is_like: isLike })
            .eq("id", existingLike.id);

          if (error) throw error;
        }
      } else {
        // Create new like/dislike
        const { error } = await supabase.from("news_comment_likes").insert({
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
    comments,
    totalComments,
    addComment,
    addReply,
    handleLike,
  };
};