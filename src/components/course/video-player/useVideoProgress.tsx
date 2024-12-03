import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useVideoProgress = (lessonId: string, onProgressChange: (progress: number) => void) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user?.id) return;

        const { data: progressData, error: progressError } = await supabase
          .from("user_progress")
          .select("*")
          .eq("lesson_id", lessonId)
          .eq("user_id", user.id)
          .maybeSingle();

        if (!progressError && progressData) {
          setProgress(progressData.progress_percentage || 0);
        }
      } catch (error) {
        console.error("Erro ao carregar progresso:", error);
      }
    };

    loadProgress();
  }, [lessonId]);

  const updateProgress = async (newProgress: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) return;

      // First check if a progress record already exists
      const { data: existingProgress } = await supabase
        .from("user_progress")
        .select("id")
        .eq("user_id", user.id)
        .eq("lesson_id", lessonId)
        .maybeSingle();

      if (existingProgress) {
        // Update existing record
        const { error } = await supabase
          .from("user_progress")
          .update({
            progress_percentage: newProgress,
            completed_at: newProgress >= 100 ? new Date().toISOString() : null
          })
          .eq("id", existingProgress.id);

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from("user_progress")
          .insert({
            user_id: user.id,
            lesson_id: lessonId,
            progress_percentage: newProgress,
            completed_at: newProgress >= 100 ? new Date().toISOString() : null
          });

        if (error) throw error;
      }

      setProgress(newProgress);
      onProgressChange(newProgress);
    } catch (error) {
      console.error("Erro ao atualizar progresso:", error);
    }
  };

  return { progress, updateProgress };
};