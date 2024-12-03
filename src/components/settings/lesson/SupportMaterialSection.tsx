import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FileUp, FileText } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface SupportMaterialSectionProps {
  lessonId: string;
  onUploadComplete: () => void;
}

const SupportMaterialSection = ({ lessonId, onUploadComplete }: SupportMaterialSectionProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const sanitizeFileName = (fileName: string) => {
    return fileName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars with underscore
      .replace(/\s+/g, '_'); // Replace spaces with underscore
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    const sanitizedName = sanitizeFileName(file.name);
    const filePath = `${lessonId}/${sanitizedName}`;
    
    try {
      // Get authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      // Create a custom upload handler to track progress
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percent = (event.loaded / event.total) * 100;
          setUploadProgress(Math.round(percent));
        }
      });

      const { data, error } = await supabase.storage
        .from('support_materials')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      if (data) {
        const { error: dbError } = await supabase
          .from('support_materials')
          .insert({
            lesson_id: lessonId,
            title: file.name, // Keep original name for display
            file_path: filePath,
            file_type: file.type,
            file_size: file.size,
          });

        if (dbError) throw dbError;

        onUploadComplete();
        
        toast({
          title: "Sucesso",
          description: "Material de apoio enviado com sucesso!",
        });
      }
    } catch (error: any) {
      console.error("Erro no upload:", error);
      toast({
        title: "Erro",
        description: "Erro ao enviar o material. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-4 bg-[#1f1f1f] p-4 rounded-lg">
      <Label htmlFor="material" className="flex items-center gap-2">
        <FileText className="w-4 h-4" />
        Material de Apoio
      </Label>
      <div className="space-y-4">
        <input
          type="file"
          id="material"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="outline"
          disabled={isUploading}
          onClick={() => document.getElementById('material')?.click()}
          className="w-full bg-[#272727] border-[#3a3a3a] text-white hover:bg-[#3a3a3a]"
        >
          <FileUp className="w-4 h-4 mr-2" />
          {isUploading ? "Enviando..." : "Upload de Material"}
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

export default SupportMaterialSection;