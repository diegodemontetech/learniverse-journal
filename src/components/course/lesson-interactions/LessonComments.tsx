import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { CommentItem } from "./CommentItem";
import { CommentForm } from "./comments/CommentForm";
import { useComments } from "./comments/useComments";

interface LessonCommentsProps {
  lessonId: string;
}

export const LessonComments = ({ lessonId }: LessonCommentsProps) => {
  const [showComments, setShowComments] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  
  const {
    comments,
    totalComments,
    addComment,
    addReply,
    handleLike,
  } = useComments(lessonId);

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
          <CommentForm onSubmit={addComment} />

          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onReply={setReplyTo}
                onLike={handleLike}
                replyTo={replyTo}
                onSubmitReply={(content) => {
                  addReply(comment.id, content);
                  setReplyTo(null);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};