import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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

const LessonsTab = () => {
  const { toast } = useToast();
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [duration, setDuration] = useState("");
  const [orderNumber, setOrderNumber] = useState("");

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
    setTitle("");
    setDescription("");
    setYoutubeUrl("");
    setDuration("");
    setOrderNumber("");
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
      title,
      description,
      youtube_url: youtubeUrl,
      duration: parseInt(duration),
      order_number: parseInt(orderNumber),
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
    setTitle(lesson.title);
    setDescription(lesson.description || "");
    setYoutubeUrl(lesson.youtube_url || "");
    setDuration(lesson.duration?.toString() || "");
    setOrderNumber(lesson.order_number?.toString() || "");
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Título da aula"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Textarea
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            placeholder="URL do YouTube"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              placeholder="Duração (minutos)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
            <Input
              type="number"
              placeholder="Ordem"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              required
            />
          </div>
          <Button type="submit">
            {isEditing ? "Atualizar Aula" : "Criar Aula"}
          </Button>
          {isEditing && (
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              className="ml-2"
            >
              Cancelar
            </Button>
          )}
        </form>
      )}

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
  );
};

export default LessonsTab;