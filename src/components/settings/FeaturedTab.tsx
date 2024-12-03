import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2 } from "lucide-react";

const FeaturedTab = () => {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>("");

  const { data: courses, refetch: refetchCourses } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("title");
      
      if (error) throw error;
      return data;
    },
  });

  const { data: featuredCourses } = useQuery({
    queryKey: ["featuredCourses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("is_featured", true)
        .order("updated_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const handleAddFeatured = async () => {
    try {
      if (!selectedCourse) {
        toast({
          title: "Erro",
          description: "Por favor, selecione um curso.",
          variant: "destructive",
        });
        return;
      }

      if (featuredCourses && featuredCourses.length >= 5) {
        toast({
          title: "Erro",
          description: "Você já atingiu o limite máximo de 5 cursos em destaque.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("courses")
        .update({ is_featured: true })
        .eq("id", selectedCourse);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Curso adicionado aos destaques.",
      });

      setIsAddDialogOpen(false);
      setSelectedCourse("");
      refetchCourses();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleRemoveFeatured = async (courseId: string) => {
    try {
      const { error } = await supabase
        .from("courses")
        .update({ is_featured: false })
        .eq("id", courseId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Curso removido dos destaques.",
      });

      refetchCourses();
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Cursos em Destaque</h2>
          <p className="text-gray-400 mt-1">
            Selecione até 5 cursos para aparecer no banner principal da página inicial.
            O banner deve ter uma imagem de alta qualidade (1920x1080px) para melhor visualização.
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-i2know-accent hover:bg-i2know-accent/90"
              disabled={featuredCourses && featuredCourses.length >= 5}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Destaque
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1a1717] border-none text-white">
            <DialogHeader>
              <DialogTitle>Adicionar Curso em Destaque</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="course">Curso</Label>
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger className="bg-[#2C2C2C] border-none">
                    <SelectValue placeholder="Selecione um curso" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2C2C2C] border-none">
                    {courses?.filter(course => !course.is_featured).map((course) => (
                      <SelectItem
                        key={course.id}
                        value={course.id}
                        className="text-white"
                      >
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddFeatured} className="w-full">
                Adicionar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {featuredCourses?.map((course) => (
          <Card
            key={course.id}
            className="bg-[#1a1717] border-none text-white"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">
                {course.title}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveFeatured(course.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <p className="text-sm text-gray-400">
                  {course.description || "Sem descrição"}
                </p>
                {course.thumbnail_url && (
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-lg mt-2"
                  />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeaturedTab;