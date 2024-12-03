import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormFieldsProps {
  formData: any;
  setFormData: (data: any) => void;
}

const FormFields = ({ formData, setFormData }: FormFieldsProps) => {
  return (
    <>
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
      <div className="space-y-2">
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
    </>
  );
};

export default FormFields;