import { useState, useEffect } from "react";
import { MessageSquare, ThumbsUp, ThumbsDown, Reply } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

      // Get comments with user info and likes
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

      // Get replies
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

          // Get user's likes for this comment
          const { data: userLike } = await supabase
            .from('comment_likes')
            .select('is_like')
            .eq('comment_id', comment.id)
            .eq('user_id', user.id)
            .single();

          return {
            ...comment,
            replies: replies || [],
            user_like: userLike?.is_like,
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

      const { error } = await supabase
        .from('comment_likes')
        .upsert({
          comment_id: commentId,
          user_id: user.id,
          is_like: isLike,
        });

      if (error) throw error;

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

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`${isReply ? "ml-12" : "border-t border-[#3a3a3a]"} py-4`}>
      <div className="flex gap-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src={comment.user.avatar_url || ""} />
          <AvatarFallback>
            {comment.user.first_name?.[0]}
            {comment.user.last_name?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-white">
              {comment.user.first_name} {comment.user.last_name}
            </span>
            <span className="text-sm text-gray-400">
              {new Date(comment.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="text-white/80 mb-2">{comment.content}</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleLike(comment.id, true)}
              className="flex items-center gap-1"
            >
              <ThumbsUp
                className={`w-4 h-4 ${
                  comment.user_like === true ? "text-green-500" : "text-gray-400"
                }`}
              />
              <span className="text-sm text-gray-400">{comment.likes_count}</span>
            </button>
            <button
              onClick={() => handleLike(comment.id, false)}
              className="flex items-center gap-1"
            >
              <ThumbsDown
                className={`w-4 h-4 ${
                  comment.user_like === false ? "text-red-500" : "text-gray-400"
                }`}
              />
              <span className="text-sm text-gray-400">{comment.dislikes_count}</span>
            </button>
            {!isReply && (
              <button
                onClick={() => setReplyTo(comment.id)}
                className="flex items-center gap-1 text-sm text-gray-400"
              >
                <Reply className="w-4 h-4" />
                Responder
              </button>
            )}
          </div>
          {replyTo === comment.id && (
            <div className="mt-4">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Escreva sua resposta..."
                className="mb-2 bg-[#272727] border-[#3a3a3a] text-white"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setReplyTo(null)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => handleReply(comment.id)}
                  disabled={!replyContent.trim()}
                >
                  Responder
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {comment.replies?.map((reply) => renderComment(reply, true))}
    </div>
  );

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
            {comments.map((comment) => renderComment(comment))}
          </div>
        </div>
      )}
    </div>
  );
};