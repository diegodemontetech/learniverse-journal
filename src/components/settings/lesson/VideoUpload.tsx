import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface VideoUploadProps {
  lessonId: string | null;
  onUploadComplete: () => void;
}

const VideoUpload = ({ lessonId, onUploadComplete }: VideoUploadProps) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !lessonId) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${lessonId}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("lesson_videos")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from("lessons")
        .update({
          video_file_path: filePath,
          video_file_type: file.type,
          video_file_size: file.size,
          youtube_url: null // Clear YouTube URL as we're using uploaded video
        })
        .eq("id", lessonId);

      if (dbError) throw dbError;

      toast({
        title: "Sucesso",
        description: "Vídeo enviado com sucesso",
      });

      setFile(null);
      onUploadComplete();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="video">Vídeo da Aula</Label>
        <Input
          id="video"
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          required
        />
      </div>
      <Button type="submit" disabled={isUploading || !lessonId}>
        <Upload className="w-4 h-4 mr-2" />
        {isUploading ? "Enviando..." : "Enviar Vídeo"}
      </Button>
    </form>
  );
};

export default VideoUpload;