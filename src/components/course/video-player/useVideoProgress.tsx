import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useVideoProgress = (lessonId: string, onProgressChange: (progress: number) => void) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user?.id) return;

        const { data: progressData, error } = await supabase
          .from("user_progress")
          .select("progress_percentage")
          .eq("lesson_id", lessonId)
          .eq("user_id", user.id);

        if (error) {
          console.error("Error loading progress:", error);
          return;
        }

        // Get the highest progress percentage
        if (progressData && progressData.length > 0) {
          const maxProgress = Math.max(...progressData.map(p => p.progress_percentage || 0));
          setProgress(maxProgress);
        }
      } catch (error) {
        console.error("Error loading progress:", error);
      }
    };

    loadProgress();
  }, [lessonId]);

  const updateProgress = async (newProgress: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) return;

      // Always insert a new progress record
      const { error } = await supabase
        .from("user_progress")
        .insert({
          user_id: user.id,
          lesson_id: lessonId,
          progress_percentage: newProgress,
          completed_at: newProgress >= 100 ? new Date().toISOString() : null
        });

      if (error) {
        console.error("Error updating progress:", error);
        return;
      }

      setProgress(newProgress);
      onProgressChange(newProgress);
    } catch (error) {
      console.error("Error updating progress:", error);
      throw error;
    }
  };

  return { progress, updateProgress };
};