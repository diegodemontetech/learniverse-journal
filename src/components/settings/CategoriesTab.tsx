import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Pencil, Trash2 } from "lucide-react";

const CategoriesTab = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { data: categories, refetch: refetchCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const resetForm = () => {
    setName("");
    setDescription("");
    setIsEditing(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const categoryData = {
      name,
      description,
    };

    try {
      if (isEditing) {
        const { error } = await supabase
          .from("categories")
          .update(categoryData)
          .eq("id", editingCategory.id);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Categoria atualizada com sucesso",
        });
      } else {
        const { error } = await supabase
          .from("categories")
          .insert([categoryData]);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Categoria criada com sucesso",
        });
      }

      resetForm();
      refetchCategories();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (category: any) => {
    setIsEditing(true);
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description || "");
  };

  const handleDelete = async (id: string) => {
    try {
      // First check if there are any courses in this category
      const { data: courses, error: coursesError } = await supabase
        .from("courses")
        .select("id")
        .eq("category_id", id);

      if (coursesError) throw coursesError;

      if (courses && courses.length > 0) {
        toast({
          title: "Erro",
          description: "Não é possível excluir esta categoria pois existem cursos associados a ela.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Categoria excluída com sucesso",
      });

      refetchCategories();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 bg-[#1a1717] p-4 rounded-lg">
        <Input
          placeholder="Nome da categoria"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="bg-[#272727] border-[#3a3a3a] text-white"
        />
        <Textarea
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-[#272727] border-[#3a3a3a] text-white min-h-[100px]"
        />
        <div className="flex gap-2">
          <Button type="submit" className="bg-i2know-accent hover:bg-i2know-accent/90">
            {isEditing ? "Atualizar Categoria" : "Criar Categoria"}
          </Button>
          {isEditing && (
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              className="bg-[#272727] border-[#3a3a3a] text-white hover:bg-[#3a3a3a]"
            >
              Cancelar
            </Button>
          )}
        </div>
      </form>

      {categories && categories.length > 0 && (
        <div className="bg-[#1a1717] rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-[#272727]">
                <TableHead className="text-white">Nome</TableHead>
                <TableHead className="text-white">Descrição</TableHead>
                <TableHead className="text-white">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id} className="hover:bg-[#272727]">
                  <TableCell className="text-white">{category.name}</TableCell>
                  <TableCell className="text-white">{category.description}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(category)}
                        className="hover:bg-[#3a3a3a]"
                      >
                        <Pencil className="h-4 w-4 text-white" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(category.id)}
                        className="hover:bg-[#3a3a3a]"
                      >
                        <Trash2 className="h-4 w-4 text-white" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default CategoriesTab;