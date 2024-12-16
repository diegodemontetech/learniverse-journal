import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from "@supabase/auth-helpers-react";

export const useCourseData = (courseId: string | undefined) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session, isLoading: isSessionLoading } = useSessionContext();

  return useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      if (!courseId) throw new Error("Course ID is required");
      if (!session) throw new Error("No active session");
      
      // Get course data with lessons
      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select(`
          *,
          lessons(*)
        `)
        .eq("id", courseId)
        .single();

      if (courseError) {
        console.error("Error fetching course:", courseError);
        throw courseError;
      }
      
      if (!courseData) {
        throw new Error("Course not found");
      }

      // Get user progress for all lessons in this course
      const { data: userProgress, error: progressError } = await supabase
        .from("user_progress")
        .select("*")
        .eq("course_id", courseId);

      if (progressError) {
        console.error("Error fetching user progress:", progressError);
        throw progressError;
      }

      // Attach progress data to each lesson
      const lessonsWithProgress = courseData.lessons?.map(lesson => ({
        ...lesson,
        user_progress: userProgress.filter(progress => progress.lesson_id === lesson.id) || []
      }));

      return {
        ...courseData,
        lessons: lessonsWithProgress
      };
    },
    enabled: !!courseId && !!session && !isSessionLoading,
    meta: {
      onError: (error: Error) => {
        console.error("Error in course query:", error);
        if (error.message === "No active session") {
          toast({
            title: "Sessão expirada",
            description: "Sua sessão expirou. Por favor, faça login novamente.",
            variant: "destructive",
          });
          navigate("/auth");
        } else {
          toast({
            title: "Erro",
            description: "Não foi possível carregar o curso. Por favor, tente novamente.",
            variant: "destructive",
          });
          navigate("/courses");
        }
      }
    }
  });
};