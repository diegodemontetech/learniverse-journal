import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import VideoUploadSection from "./VideoUploadSection";
import SupportMaterialSection from "./SupportMaterialSection";
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
      <div className="space-y-4 bg-[#1f1f1f] p-4 rounded-lg">
        <div>
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="bg-[#272727] border-[#3a3a3a] text-white"
          />
        </div>

        <div>
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="bg-[#272727] border-[#3a3a3a] text-white min-h-[100px]"
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
            className="bg-[#272727] border-[#3a3a3a] text-white"
          />
        </div>

        <div>
          <Label htmlFor="youtube_url">URL do YouTube (opcional)</Label>
          <Input
            id="youtube_url"
            name="youtube_url"
            value={formData.youtube_url}
            onChange={handleInputChange}
            className="bg-[#272727] border-[#3a3a3a] text-white"
          />
        </div>
      </div>

      {selectedLesson?.id && (
        <>
          <VideoUploadSection
            lessonId={selectedLesson.id}
            onUploadComplete={handleVideoUpload}
          />
          
          <SupportMaterialSection
            lessonId={selectedLesson.id}
            onUploadComplete={() => {}}
          />

          <SupportMaterialList lessonId={selectedLesson.id} />
        </>
      )}

      <div className="flex justify-end gap-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="bg-[#272727] border-[#3a3a3a] text-white hover:bg-[#3a3a3a]"
        >
          Cancelar
        </Button>
        <Button 
          type="submit"
          className="bg-[#ea384c] hover:bg-[#ea384c]/90 text-white"
        >
          {selectedLesson ? "Atualizar" : "Criar"} Aula
        </Button>
      </div>
    </form>
  );
};

export default LessonFormSection;