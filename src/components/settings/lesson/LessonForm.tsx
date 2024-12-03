import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface LessonFormProps {
  isEditing: boolean;
  title: string;
  description: string;
  youtubeUrl: string;
  duration: string;
  orderNumber: string;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: string, value: string) => void;
  onCancel?: () => void;
}

const LessonForm = ({
  isEditing,
  title,
  description,
  youtubeUrl,
  duration,
  orderNumber,
  onSubmit,
  onChange,
  onCancel,
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
      <Input
        placeholder="URL do YouTube"
        value={youtubeUrl}
        onChange={(e) => onChange("youtubeUrl", e.target.value)}
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