import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { FileUp } from "lucide-react";

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
        <div className="space-y-2">
          <label className="text-sm font-medium">Título</label>
          <Input
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Autor</label>
          <Input
            value={formData.author}
            onChange={(e) =>
              setFormData({ ...formData, author: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-2 col-span-2">
          <label className="text-sm font-medium">Sinopse</label>
          <Textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Categoria</label>
          <Select
            value={formData.category_id}
            onValueChange={(value) =>
              setFormData({ ...formData, category_id: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {/* Categories will be passed as prop */}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Quantidade de Páginas</label>
          <Input
            type="number"
            value={formData.total_pages}
            onChange={(e) =>
              setFormData({
                ...formData,
                total_pages: parseInt(e.target.value),
              })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Thumbnail</label>
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'thumbnail')}
              className="hidden"
              id="thumbnail-upload"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('thumbnail-upload')?.click()}
              className="w-full"
            >
              <FileUp className="w-4 h-4 mr-2" />
              Upload Thumbnail
            </Button>
          </div>
          {formData.thumbnail_url && (
            <img 
              src={formData.thumbnail_url} 
              alt="Thumbnail preview" 
              className="mt-2 h-20 object-cover rounded"
            />
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">PDF</label>
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileUpload(e, 'pdf')}
              className="hidden"
              id="pdf-upload"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('pdf-upload')?.click()}
              className="w-full"
            >
              <FileUp className="w-4 h-4 mr-2" />
              Upload PDF
            </Button>
          </div>
          {isUploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-sm text-gray-400 text-center">{uploadProgress}%</p>
            </div>
          )}
        </div>
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