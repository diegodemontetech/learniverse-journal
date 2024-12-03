import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import VideoUpload from "./VideoUpload";
import SupportMaterialUpload from "./SupportMaterialUpload";
import SupportMaterialList from "./SupportMaterialList";

interface LessonFormSectionProps {
  selectedLesson: any;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

const LessonFormSection = ({ selectedLesson, onSubmit, onCancel }: LessonFormSectionProps) => {
  const [formData, setFormData] = useState({
    title: selectedLesson?.title || "",
    description: selectedLesson?.description || "",
    order_number: selectedLesson?.order_number || "",
    youtube_url: selectedLesson?.youtube_url || "",
    video_file_path: selectedLesson?.video_file_path || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleVideoUpload = (filePath: string) => {
    setFormData((prev) => ({ ...prev, video_file_path: filePath }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="order_number">Ordem</Label>
          <Input
            id="order_number"
            name="order_number"
            type="number"
            value={formData.order_number}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="youtube_url">URL do YouTube (opcional)</Label>
          <Input
            id="youtube_url"
            name="youtube_url"
            value={formData.youtube_url}
            onChange={handleInputChange}
          />
        </div>

        {selectedLesson?.id && (
          <>
            <VideoUpload
              lessonId={selectedLesson.id}
              onUploadComplete={handleVideoUpload}
            />
            
            <SupportMaterialUpload
              lessonId={selectedLesson.id}
              onUploadComplete={() => {}}
            />

            <SupportMaterialList lessonId={selectedLesson.id} />
          </>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {selectedLesson ? "Atualizar" : "Criar"} Aula
        </Button>
      </div>
    </form>
  );
};

export default LessonFormSection;