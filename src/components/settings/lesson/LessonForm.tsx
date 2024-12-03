import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import VideoUpload from "./VideoUpload";

interface LessonFormProps {
  isEditing: boolean;
  lessonId: string | null;
  title: string;
  description: string;
  duration: string;
  orderNumber: string;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: string, value: string) => void;
  onCancel?: () => void;
  onUploadComplete: () => void;
}

const LessonForm = ({
  isEditing,
  lessonId,
  title,
  description,
  duration,
  orderNumber,
  onSubmit,
  onChange,
  onCancel,
  onUploadComplete,
}: LessonFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        placeholder="Título da aula"
        value={title}
        onChange={(e) => onChange("title", e.target.value)}
        required
      />
      <Textarea
        placeholder="Descrição"
        value={description}
        onChange={(e) => onChange("description", e.target.value)}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          type="number"
          placeholder="Duração (minutos)"
          value={duration}
          onChange={(e) => onChange("duration", e.target.value)}
          required
        />
        <Input
          type="number"
          placeholder="Ordem"
          value={orderNumber}
          onChange={(e) => onChange("orderNumber", e.target.value)}
          required
        />
      </div>
      
      {isEditing && (
        <VideoUpload 
          lessonId={lessonId} 
          onUploadComplete={onUploadComplete}
        />
      )}

      <div className="flex gap-2">
        <Button type="submit">
          {isEditing ? "Atualizar Aula" : "Criar Aula"}
        </Button>
        {isEditing && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
};

export default LessonForm;