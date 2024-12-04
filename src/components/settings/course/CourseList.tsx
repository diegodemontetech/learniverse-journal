import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

interface CourseListProps {
  courses: any[];
  onEdit: (course: any) => void;
}

const CourseList = ({ courses, onEdit }: CourseListProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleToggleActive = async (courseId: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from("courses")
        .update({ is_active: !currentState })
        .eq("id", courseId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["courses"] });
      
      toast({
        title: "Success",
        description: `Course ${!currentState ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error: any) {
      console.error("Error toggling course:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to toggle course status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid gap-4">
      {courses?.map((course) => (
        <Card
          key={course.id}
          className="bg-[#1a1717] border-none text-white"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">
              {course.title}
            </CardTitle>
            <div className="flex gap-2 items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">
                  {course.is_active ? 'Ativo' : 'Inativo'}
                </span>
                <Switch
                  checked={course.is_active}
                  onCheckedChange={() => handleToggleActive(course.id, course.is_active)}
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(course)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <p className="text-sm text-gray-400">
                {course.description || "No description"}
              </p>
              <div className="flex gap-4 text-sm">
                <span>Instructor: {course.instructor}</span>
                <span>Duration: {course.duration} minutes</span>
                <span>Category: {course.categories?.name}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CourseList;