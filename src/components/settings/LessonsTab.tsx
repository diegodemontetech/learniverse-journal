import { useState, useEffect } from "react";
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

  // Store the selected course in localStorage
  useEffect(() => {
    if (selectedCourse) {
      localStorage.setItem('selectedCourse', selectedCourse);
    }
  }, [selectedCourse]);

  // Restore selected course from localStorage
  useEffect(() => {
    const storedCourse = localStorage.getItem('selectedCourse');
    if (storedCourse) {
      setSelectedCourse(storedCourse);
    }
  }, []);

  // Store editing state in localStorage
  useEffect(() => {
    if (isEditing && editingLesson) {
      localStorage.setItem('editingLesson', JSON.stringify(editingLesson));
    } else {
      localStorage.removeItem('editingLesson');
    }
  }, [isEditing, editingLesson]);

  // Restore editing state from localStorage
  useEffect(() => {
    const storedLesson = localStorage.getItem('editingLesson');
    if (storedLesson) {
      const lesson = JSON.parse(storedLesson);
      setIsEditing(true);
      setEditingLesson(lesson);
    }
  }, []);

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

  const handleSubmit = async (formData: any) => {
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
      ...formData
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

      setIsEditing(false);
      setEditingLesson(null);
      localStorage.removeItem('editingLesson');
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Select
          value={selectedCourse || ""}
          onValueChange={(value) => setSelectedCourse(value)}
        >
          <SelectTrigger className="w-[300px] bg-[#272727] border-[#3a3a3a] text-white">
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
            selectedLesson={editingLesson}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsEditing(false);
              setEditingLesson(null);
              localStorage.removeItem('editingLesson');
            }}
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