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
          .single();

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

    // Subscribe to realtime changes
    const channel = supabase
      .channel('user_progress_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_progress',
          filter: `lesson_id=eq.${lessonId}`
        },
        (payload) => {
          if (payload.new) {
            setProgress(payload.new.progress_percentage);
            onProgressChange(payload.new.progress_percentage);
          }
        }
      )
      .subscribe();

    loadProgress();

    return () => {
      supabase.removeChannel(channel);
    };
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
        .upsert(
          {
            user_id: user.id,
            lesson_id: lessonId,
            course_id: lessonData.course_id,
            progress_percentage: newProgress,
            completed_at: newProgress >= 100 ? new Date().toISOString() : null
          },
          {
            onConflict: 'user_id,course_id,lesson_id',
            ignoreDuplicates: false
          }
        );

      if (error) {
        console.error("Error updating progress:", error);
        throw error;
      }
    } catch (error) {
      console.error("Error updating progress:", error);
      throw error;
    }
  };

  return { progress, updateProgress };
};