import { useState } from "react";
import { ThumbsUp, ThumbsDown, Reply } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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

interface CommentItemProps {
  comment: Comment;
  isReply?: boolean;
  onReply: (parentId: string) => void;
  onLike: (commentId: string, isLike: boolean) => void;
  replyTo: string | null;
  replyContent: string;
  setReplyContent: (content: string) => void;
  handleReply: (parentId: string) => void;
}

export const CommentItem = ({
  comment,
  isReply = false,
  onReply,
  onLike,
  replyTo,
  replyContent,
  setReplyContent,
  handleReply,
}: CommentItemProps) => {
  return (
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
              onClick={() => onLike(comment.id, true)}
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
              onClick={() => onLike(comment.id, false)}
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
                onClick={() => onReply(comment.id)}
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
                  onClick={() => onReply(null)}
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
      {comment.replies?.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          isReply={true}
          onReply={onReply}
          onLike={onLike}
          replyTo={replyTo}
          replyContent={replyContent}
          setReplyContent={setReplyContent}
          handleReply={handleReply}
        />
      ))}
    </div>
  );
};