import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SupportMaterialUploadProps {
  lessonId: string | null;
  onUploadComplete: () => void;
}

const SupportMaterialUpload = ({ lessonId, onUploadComplete }: SupportMaterialUploadProps) => {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
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
        .from("support_materials")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase.from("support_materials").insert({
        lesson_id: lessonId,
        title,
        file_path: filePath,
        file_type: file.type,
        file_size: file.size,
      });

      if (dbError) throw dbError;

      toast({
        title: "Sucesso",
        description: "Material de apoio enviado com sucesso",
      });

      setTitle("");
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
        <Label htmlFor="title">Título do Material</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="file">Arquivo</Label>
        <Input
          id="file"
          type="file"
          onChange={handleFileChange}
          required
        />
      </div>
      <Button type="submit" disabled={isUploading || !lessonId}>
        <Upload className="w-4 h-4 mr-2" />
        {isUploading ? "Enviando..." : "Enviar Material"}
      </Button>
    </form>
  );
};

export default SupportMaterialUpload;