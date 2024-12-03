import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useVideoProgress = (lessonId: string, onProgressChange: (progress: number) => void) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user?.id) return;

        const { data: progressData } = await supabase
          .from("user_progress")
          .select("*")
          .eq("lesson_id", lessonId)
          .eq("user_id", user.id);

        if (progressData && progressData[0]) {
          setProgress(progressData[0].progress_percentage || 0);
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

      const { data, error } = await supabase
        .from("user_progress")
        .upsert({
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
    }
  };

  return { progress, updateProgress };
};