import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

interface ProgressUpdate {
  progress_percentage: number;
}

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

        if (error) {
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
    const channel = supabase.channel('progress_changes')
      .on(
        'postgres_changes' as const,
        {
          event: '*',
          schema: 'public',
          table: 'user_progress',
          filter: `lesson_id=eq.${lessonId}`
        },
        (payload: RealtimePostgresChangesPayload<ProgressUpdate>) => {
          const newProgress = payload.new as ProgressUpdate;
          if (newProgress && typeof newProgress.progress_percentage === 'number') {
            setProgress(newProgress.progress_percentage);
            onProgressChange(newProgress.progress_percentage);
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