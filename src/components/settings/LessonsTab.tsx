import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Button } from "@/components/ui/button";
import LessonForm from "./lesson/LessonForm";
import SupportMaterialUpload from "./lesson/SupportMaterialUpload";
import SupportMaterialList from "./lesson/SupportMaterialList";

const LessonsTab = () => {
  const { toast } = useToast();
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    youtubeUrl: "",
    duration: "",
    orderNumber: "",
  });

  const { data: courses } = useQuery({
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

  const { data: lessons, refetch: refetchLessons } = useQuery({
    queryKey: ["lessons", selectedCourse],
    queryFn: async () => {
      if (!selectedCourse) return [];
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("course_id", selectedCourse)
        .order("order_number");
      if (error) throw error;
      return data;
    },
    enabled: !!selectedCourse,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      youtubeUrl: "",
      duration: "",
      orderNumber: "",
    });
    setIsEditing(false);
    setEditingLesson(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCourse) {
      toast({
        title: "Erro",
        description: "Selecione um curso primeiro",
        variant: "destructive",
      });
      return;
    }

    const lessonData = {
      course_id: selectedCourse,
      title: formData.title,
      description: formData.description,
      youtube_url: formData.youtubeUrl,
      duration: parseInt(formData.duration),
      order_number: parseInt(formData.orderNumber),
    };

    try {
      if (isEditing) {
        const { error } = await supabase
          .from("lessons")
          .update(lessonData)
          .eq("id", editingLesson.id);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Aula atualizada com sucesso",
        });
      } else {
        const { error } = await supabase
          .from("lessons")
          .insert([lessonData]);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Aula criada com sucesso",
        });
      }

      resetForm();
      refetchLessons();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (lesson: any) => {
    setIsEditing(true);
    setEditingLesson(lesson);
    setFormData({
      title: lesson.title,
      description: lesson.description || "",
      youtubeUrl: lesson.youtube_url || "",
      duration: lesson.duration?.toString() || "",
      orderNumber: lesson.order_number?.toString() || "",
    });
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("lessons")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Aula excluída com sucesso",
      });

      refetchLessons();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Select
          value={selectedCourse || ""}
          onValueChange={(value) => setSelectedCourse(value)}
        >
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Selecione um curso" />
          </SelectTrigger>
          <SelectContent>
            {courses?.map((course) => (
              <SelectItem key={course.id} value={course.id}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedCourse && (
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-6">
            <LessonForm
              isEditing={isEditing}
              {...formData}
              onSubmit={handleSubmit}
              onChange={handleFormChange}
              onCancel={resetForm}
            />

            {editingLesson && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Materiais de Apoio</h3>
                <SupportMaterialUpload
                  lessonId={editingLesson.id}
                  onUploadComplete={refetchLessons}
                />
                <SupportMaterialList lessonId={editingLesson.id} />
              </div>
            )}
          </div>

          <div>
            {lessons && lessons.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ordem</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Duração</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lessons.map((lesson) => (
                    <TableRow key={lesson.id}>
                      <TableCell>{lesson.order_number}</TableCell>
                      <TableCell>{lesson.title}</TableCell>
                      <TableCell>{lesson.duration} minutos</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(lesson)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(lesson.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonsTab;