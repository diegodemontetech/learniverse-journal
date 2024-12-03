import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Video } from "lucide-react";

interface VideoUploadSectionProps {
  lessonId: string;
  onUploadComplete: (filePath: string) => void;
}

const VideoUploadSection = ({ lessonId, onUploadComplete }: VideoUploadSectionProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo de vídeo válido.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    const fileName = `${lessonId}/${crypto.randomUUID()}`;
    
    try {
      const { data, error } = await supabase.storage
        .from('lesson_videos')
        .upload(fileName, file);

      if (error) throw error;

      if (data) {
        const { data: { publicUrl } } = supabase.storage
          .from('lesson_videos')
          .getPublicUrl(data.path);

        await supabase
          .from('lessons')
          .update({
            video_file_path: data.path,
            video_file_type: file.type,
            video_file_size: file.size,
          })
          .eq('id', lessonId);

        onUploadComplete(publicUrl);
        
        toast({
          title: "Sucesso",
          description: "Vídeo enviado com sucesso!",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao enviar o vídeo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4 bg-[#1f1f1f] p-4 rounded-lg">
      <Label htmlFor="video" className="flex items-center gap-2">
        <Video className="w-4 h-4" />
        Vídeo da Aula
      </Label>
      <div className="flex items-center gap-4">
        <input
          type="file"
          id="video"
          accept="video/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="outline"
          disabled={isUploading}
          onClick={() => document.getElementById('video')?.click()}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? "Enviando..." : "Upload de Vídeo"}
        </Button>
      </div>
    </div>
  );
};

export default VideoUploadSection;