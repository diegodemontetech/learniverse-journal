import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FileUp } from "lucide-react";

interface SupportMaterialUploadProps {
  lessonId: string;
  onUploadComplete: (material: any) => void;
}

const SupportMaterialUpload = ({ lessonId, onUploadComplete }: SupportMaterialUploadProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const fileName = `${lessonId}/${crypto.randomUUID()}-${file.name}`;
    
    try {
      const { data, error } = await supabase.storage
        .from('support_materials')
        .upload(fileName, file);

      if (error) throw error;

      if (data) {
        const { data: { publicUrl } } = supabase.storage
          .from('support_materials')
          .getPublicUrl(data.path);

        const { data: material, error: dbError } = await supabase
          .from('support_materials')
          .insert({
            lesson_id: lessonId,
            title: file.name,
            file_path: publicUrl,
            file_type: file.type,
            file_size: file.size,
          })
          .select()
          .single();

        if (dbError) throw dbError;

        onUploadComplete(material);
        
        toast({
          title: "Sucesso",
          description: "Material de apoio enviado com sucesso!",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao enviar o material. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="material">Material de Apoio</Label>
      <div className="flex items-center gap-4">
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
        >
          <FileUp className="w-4 h-4 mr-2" />
          {isUploading ? "Enviando..." : "Upload de Material"}
        </Button>
      </div>
    </div>
  );
};

export default SupportMaterialUpload;