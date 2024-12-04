import { ThumbsUp, Reply } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CommentForm } from "./comments/CommentForm";
import type { Comment } from "./comments/types";

interface CommentItemProps {
  comment: Comment;
  isReply?: boolean;
  onReply: (parentId: string | null) => void;
  onLike: (commentId: string, isLike: boolean) => void;
  replyTo: string | null;
  onSubmitReply: (content: string) => void;
}

export const CommentItem = ({
  comment,
  isReply = false,
  onReply,
  onLike,
  replyTo,
  onSubmitReply,
}: CommentItemProps) => {
  return (
    <div key={comment.id} className={`${isReply ? "ml-12" : "border-t border-[#3a3a3a]"} py-4`}>
      <div className="flex gap-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src={comment.user?.avatar_url || ""} />
          <AvatarFallback>
            {comment.user?.first_name?.[0]}
            {comment.user?.last_name?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-white">
              {comment.user?.first_name} {comment.user?.last_name}
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
                  comment.user_like ? "text-green-500" : "text-gray-400"
                }`}
              />
              <span className="text-sm text-gray-400">{comment.likes_count}</span>
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
              <CommentForm
                onSubmit={onSubmitReply}
                placeholder="Escreva sua resposta..."
                submitLabel="Responder"
                onCancel={() => onReply(null)}
              />
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
          onSubmitReply={onSubmitReply}
        />
      ))}
    </div>
  );
};