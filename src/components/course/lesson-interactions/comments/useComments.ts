import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useCommentsSubscription } from "./useCommentsSubscription";
import { useCommentsActions } from "./useCommentsActions";
import type { Comment } from "./types";

export const useComments = (lessonId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [totalComments, setTotalComments] = useState(0);
  const { toast } = useToast();

  // Subscribe to realtime changes
  useCommentsSubscription(lessonId, () => {
    loadComments();
  });

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

  const { addComment, addReply, handleLike } = useCommentsActions(lessonId, toast);

  return {
    comments,
    totalComments,
    addComment,
    addReply,
    handleLike,
  };
};