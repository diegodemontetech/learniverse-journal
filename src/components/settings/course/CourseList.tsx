import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
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

  const handleDelete = async (courseId: string) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        // First delete related records
        const deleteRelatedRecords = async () => {
          // Delete user progress
          await supabase
            .from("user_progress")
            .delete()
            .eq("course_id", courseId);

          // Delete certificates
          await supabase
            .from("certificates")
            .delete()
            .eq("course_id", courseId);

          // Delete quizzes and related records
          const { data: quizzes } = await supabase
            .from("quizzes")
            .select("id")
            .eq("course_id", courseId);

          if (quizzes) {
            for (const quiz of quizzes) {
              // Delete quiz attempts
              await supabase
                .from("quiz_attempts")
                .delete()
                .eq("quiz_id", quiz.id);

              // Delete quiz questions
              await supabase
                .from("quiz_questions")
                .delete()
                .eq("quiz_id", quiz.id);
            }

            // Delete quizzes
            await supabase
              .from("quizzes")
              .delete()
              .eq("course_id", courseId);
          }

          // Delete position courses
          await supabase
            .from("position_courses")
            .delete()
            .eq("course_id", courseId);

          // Delete lessons and related records
          const { data: lessons } = await supabase
            .from("lessons")
            .select("id")
            .eq("course_id", courseId);

          if (lessons) {
            for (const lesson of lessons) {
              // Delete lesson comments
              await supabase
                .from("lesson_comments")
                .delete()
                .eq("lesson_id", lesson.id);

              // Delete lesson likes
              await supabase
                .from("lesson_likes")
                .delete()
                .eq("lesson_id", lesson.id);

              // Delete lesson ratings
              await supabase
                .from("lesson_ratings")
                .delete()
                .eq("lesson_id", lesson.id);

              // Delete support materials
              await supabase
                .from("support_materials")
                .delete()
                .eq("lesson_id", lesson.id);
            }

            // Delete lessons
            await supabase
              .from("lessons")
              .delete()
              .eq("course_id", courseId);
          }
        };

        // Delete related records first
        await deleteRelatedRecords();

        // Finally delete the course
        const { error } = await supabase
          .from("courses")
          .delete()
          .eq("id", courseId);

        if (error) throw error;

        await queryClient.invalidateQueries({ queryKey: ["courses"] });
        
        toast({
          title: "Success",
          description: "Course deleted successfully",
        });
      } catch (error: any) {
        console.error("Error deleting course:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to delete course",
          variant: "destructive",
        });
      }
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
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(course)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(course.id)}
              >
                <Trash2 className="h-4 w-4" />
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