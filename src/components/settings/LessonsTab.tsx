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
import { useToast } from "@/components/ui/use-toast";
import LessonFormSection from "./lesson/LessonFormSection";
import LessonTable from "./lesson/LessonTable";

const LessonsTab = () => {
  const { toast } = useToast();
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any>(null);

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
          <LessonFormSection
            selectedCourse={selectedCourse}
            isEditing={isEditing}
            editingLesson={editingLesson}
            formData={formData}
            onSubmit={handleSubmit}
            onChange={handleFormChange}
            onCancel={resetForm}
            onUploadComplete={refetchLessons}
          />

          <div>
            <LessonTable
              lessons={lessons || []}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonsTab;