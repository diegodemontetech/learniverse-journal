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
          .eq("user_id", user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error("Error loading progress:", error);
          return;
        }

        if (progressData?.progress_percentage) {
          setProgress(progressData.progress_percentage);
          onProgressChange(progressData.progress_percentage);
        }
      } catch (error) {
        console.error("Error loading progress:", error);
      }
    };

    loadProgress();
  }, [lessonId, onProgressChange]);

  const updateProgress = async (newProgress: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) return;

      const { data: lessonData } = await supabase
        .from("lessons")
        .select("course_id")
        .eq("id", lessonId)
        .single();

      if (!lessonData?.course_id) {
        console.error("Could not find course_id for lesson");
        return;
      }

      const { error } = await supabase
        .from("user_progress")
        .insert({
          user_id: user.id,
          lesson_id: lessonId,
          course_id: lessonData.course_id,
          progress_percentage: newProgress,
          completed_at: newProgress >= 100 ? new Date().toISOString() : null
        })
        .select()
        .single();

      if (error) {
        console.error("Error updating progress:", error);
        throw error;
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