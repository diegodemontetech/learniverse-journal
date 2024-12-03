import { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CommentItem } from "./CommentItem";

interface Comment {
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

interface LessonCommentsProps {
  lessonId: string;
}

export const LessonComments = ({ lessonId }: LessonCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [totalComments, setTotalComments] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (showComments) {
      loadComments();
    }
  }, [showComments, lessonId]);

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

          // Changed this part to handle no likes found
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

  const handleComment = async () => {
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
          content: newComment,
        });

      if (error) throw error;

      setNewComment("");
      loadComments();
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

  const handleReply = async (parentId: string) => {
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
          content: replyContent,
          parent_id: parentId,
        });

      if (error) throw error;

      setReplyTo(null);
      setReplyContent("");
      loadComments();
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
        // Remove like if clicking the same button
        const { error } = await supabase
          .from('comment_likes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Add or update like
        const { error } = await supabase
          .from('comment_likes')
          .upsert({
            comment_id: commentId,
            user_id: user.id,
            is_like: isLike,
          });

        if (error) throw error;
      }

      loadComments();
    } catch (error) {
      console.error('Error updating like:', error);
      toast({
        title: "Erro",
        description: "Não foi possível registrar sua avaliação",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <button
        onClick={() => setShowComments(!showComments)}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <MessageSquare className="w-5 h-5" />
        {totalComments} {totalComments === 1 ? "comentário" : "comentários"}
      </button>

      {showComments && (
        <div className="mt-4">
          <div className="mb-4">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escreva um comentário..."
              className="mb-2 bg-[#272727] border-[#3a3a3a] text-white"
            />
            <div className="flex justify-end">
              <Button
                onClick={handleComment}
                disabled={!newComment.trim()}
              >
                Comentar
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onReply={setReplyTo}
                onLike={handleLike}
                replyTo={replyTo}
                replyContent={replyContent}
                setReplyContent={setReplyContent}
                handleReply={handleReply}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};