import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import FileUploadField from "./form/FileUploadField";
import FormFields from "./form/FormFields";

interface EbookFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const EbookForm = ({ initialData, onSubmit, onCancel }: EbookFormProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState(
    initialData || {
      title: "",
      author: "",
      description: "",
      category_id: "",
      total_pages: 0,
      thumbnail_url: "",
      pdf_url: "",
    }
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fileType: 'pdf' | 'thumbnail') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (fileType === 'pdf' && !file.type.includes('pdf')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo PDF válido.",
        variant: "destructive",
      });
      return;
    }

    if (fileType === 'thumbnail' && !file.type.includes('image')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma imagem válida.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const bucket = fileType === 'pdf' ? 'ebooks' : 'ebook_thumbnails';
    const fileName = `${crypto.randomUUID()}-${file.name}`;

    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      setFormData(prev => ({
        ...prev,
        [fileType === 'pdf' ? 'pdf_url' : 'thumbnail_url']: urlData.publicUrl
      }));

      toast({
        title: "Sucesso",
        description: "Arquivo enviado com sucesso!",
      });
    } catch (error: any) {
      toast({
        title: "Erro no upload",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormFields formData={formData} setFormData={setFormData} />
        
        <FileUploadField
          id="thumbnail-upload"
          label="Thumbnail"
          accept="image/*"
          previewUrl={formData.thumbnail_url}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          onFileSelect={(e) => handleFileUpload(e, 'thumbnail')}
        />
        
        <FileUploadField
          id="pdf-upload"
          label="PDF"
          accept=".pdf"
          previewUrl={formData.pdf_url}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          onFileSelect={(e) => handleFileUpload(e, 'pdf')}
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {initialData ? "Atualizar" : "Criar"}
        </Button>
      </div>
    </form>
  );
};

export default EbookForm;