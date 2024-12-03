import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Video } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface VideoUploadSectionProps {
  lessonId: string;
  onUploadComplete: (filePath: string) => void;
}

const VideoUploadSection = ({ lessonId, onUploadComplete }: VideoUploadSectionProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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
    setUploadProgress(0);
    const fileName = `${lessonId}/${crypto.randomUUID()}`;
    
    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      // Upload the file with progress tracking
      const { data, error } = await supabase.storage
        .from('lesson_videos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            const percent = (progress.loaded / progress.total) * 100;
            setUploadProgress(Math.round(percent));
          }
        });

      if (error) throw error;

      if (data) {
        // Update lesson with video information
        const { error: updateError } = await supabase
          .from('lessons')
          .update({
            video_file_path: data.path,
            video_file_type: file.type,
            video_file_size: file.size,
          })
          .eq('id', lessonId);

        if (updateError) throw updateError;

        onUploadComplete(data.path);
        
        toast({
          title: "Sucesso",
          description: "Vídeo enviado com sucesso!",
        });
      }
    } catch (error: any) {
      console.error("Erro no upload:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao enviar o vídeo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-4 bg-[#1f1f1f] p-4 rounded-lg">
      <Label htmlFor="video" className="flex items-center gap-2">
        <Video className="w-4 h-4" />
        Vídeo da Aula
      </Label>
      <div className="space-y-4">
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
          className="w-full bg-[#272727] border-[#3a3a3a] text-white hover:bg-[#3a3a3a]"
        >
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? "Enviando..." : "Upload de Vídeo"}
        </Button>
        
        {isUploading && (
          <div className="space-y-2">
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-sm text-gray-400 text-center">{uploadProgress}%</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoUploadSection;