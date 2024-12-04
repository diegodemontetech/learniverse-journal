import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

interface LessonTableProps {
  lessons: any[];
  onEdit: (lesson: any) => void;
}

const LessonTable = ({ lessons, onEdit }: LessonTableProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleToggleActive = async (lessonId: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from("lessons")
        .update({ is_active: !currentState })
        .eq("id", lessonId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["lessons"] });
      
      toast({
        title: "Success",
        description: `Lesson ${!currentState ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error: any) {
      console.error("Error toggling lesson:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to toggle lesson status",
        variant: "destructive",
      });
    }
  };

  if (!lessons || lessons.length === 0) return null;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ordem</TableHead>
          <TableHead>Título</TableHead>
          <TableHead>Duração</TableHead>
          <TableHead>Status</TableHead>
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
                <span className="text-sm text-gray-400">
                  {lesson.is_active ? 'Ativo' : 'Inativo'}
                </span>
                <Switch
                  checked={lesson.is_active}
                  onCheckedChange={() => handleToggleActive(lesson.id, lesson.is_active)}
                />
              </div>
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(lesson)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default LessonTable;