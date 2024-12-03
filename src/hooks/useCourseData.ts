import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useCourseData = (courseId: string | undefined) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  return useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      if (!courseId) throw new Error("Course ID is required");
      
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
        user_progress: userProgress.filter(progress => progress.lesson_id === lesson.id)
      }));

      return {
        ...courseData,
        lessons: lessonsWithProgress
      };
    },
    retry: 1,
    meta: {
      onError: (error: Error) => {
        console.error("Error in course query:", error);
        toast({
          title: "Error",
          description: "Could not load the course. Please try again.",
          variant: "destructive",
        });
        navigate("/courses");
      }
    }
  });
};