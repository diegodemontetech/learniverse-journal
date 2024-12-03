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
      
      const { data, error } = await supabase
        .from("courses")
        .select(`
          *,
          lessons(
            *,
            user_progress(completed_at)
          )
        `)
        .eq("id", courseId)
        .single();

      if (error) {
        console.error("Error fetching course:", error);
        throw error;
      }
      
      if (!data) {
        throw new Error("Course not found");
      }
      
      return data;
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