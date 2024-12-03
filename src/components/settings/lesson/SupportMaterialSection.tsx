import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FileUp, FileText } from "lucide-react";

interface SupportMaterialSectionProps {
  lessonId: string;
  onUploadComplete: () => void;
}

const SupportMaterialSection = ({ lessonId, onUploadComplete }: SupportMaterialSectionProps) => {
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
        const { error: dbError } = await supabase
          .from('support_materials')
          .insert({
            lesson_id: lessonId,
            title: file.name,
            file_path: data.path,
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
    <div className="space-y-4 bg-[#1f1f1f] p-4 rounded-lg">
      <Label htmlFor="material" className="flex items-center gap-2">
        <FileText className="w-4 h-4" />
        Material de Apoio
      </Label>
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
          className="w-full"
        >
          <FileUp className="w-4 h-4 mr-2" />
          {isUploading ? "Enviando..." : "Upload de Material"}
        </Button>
      </div>
    </div>
  );
};

export default SupportMaterialSection;