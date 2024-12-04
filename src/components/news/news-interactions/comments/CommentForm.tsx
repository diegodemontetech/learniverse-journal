import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CommentFormProps {
  onSubmit: (content: string) => void;
  placeholder?: string;
  submitLabel?: string;
  onCancel?: () => void;
}

export const CommentForm = ({
  onSubmit,
  placeholder = "Escreva um comentário...",
  submitLabel = "Comentar",
  onCancel,
}: CommentFormProps) => {
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    onSubmit(content);
    setContent("");
  };

  return (
    <div className="mb-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        className="mb-2 bg-[#272727] border-[#3a3a3a] text-white"
      />
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button
            variant="outline"
            onClick={onCancel}
          >
            Cancelar
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          disabled={!content.trim()}
        >
          {submitLabel}
        </Button>
      </div>
    </div>
  );
};