import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NewsFormData {
  title: string;
  content: string;
  thumbnail_url: string;
  main_image_url: string;
  video_url: string;
  is_featured: boolean;
  layout_position: string;
}

interface NewsFormProps {
  initialData?: NewsFormData;
  onSubmit: (data: NewsFormData) => void;
  isEditing?: boolean;
}

const NewsForm = ({ initialData, onSubmit, isEditing = false }: NewsFormProps) => {
  const [formData, setFormData] = useState<NewsFormData>(
    initialData || {
      title: "",
      content: "",
      thumbnail_url: "",
      main_image_url: "",
      video_url: "",
      is_featured: false,
      layout_position: "regular",
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="text-sm font-medium">
          Título
        </label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      
      <div>
        <label htmlFor="content" className="text-sm font-medium">
          Conteúdo
        </label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          required
        />
      </div>
      
      <div>
        <label htmlFor="thumbnail_url" className="text-sm font-medium">
          URL da Thumbnail
        </label>
        <Input
          id="thumbnail_url"
          value={formData.thumbnail_url}
          onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="main_image_url" className="text-sm font-medium">
          URL da Imagem Principal
        </label>
        <Input
          id="main_image_url"
          value={formData.main_image_url}
          onChange={(e) => setFormData({ ...formData, main_image_url: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="video_url" className="text-sm font-medium">
          URL do Vídeo (YouTube)
        </label>
        <Input
          id="video_url"
          value={formData.video_url}
          onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="layout_position" className="text-sm font-medium">
          Posição no Layout
        </label>
        <Select
          value={formData.layout_position}
          onValueChange={(value) => setFormData({ ...formData, layout_position: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a posição" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Destaque Principal</SelectItem>
            <SelectItem value="most_read">Coluna Mais Lidas</SelectItem>
            <SelectItem value="regular">Regular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_featured"
          checked={formData.is_featured}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, is_featured: checked as boolean })
          }
        />
        <label
          htmlFor="is_featured"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Destaque
        </label>
      </div>

      <Button type="submit">
        {isEditing ? "Atualizar" : "Criar"}
      </Button>
    </form>
  );
};

export default NewsForm;