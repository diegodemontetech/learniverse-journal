import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useCommentsSubscription = (lessonId: string, onUpdate: () => void) => {
  useEffect(() => {
    const channel = supabase
      .channel('lesson_comments')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lesson_comments',
          filter: `lesson_id=eq.${lessonId}`
        },
        () => {
          onUpdate();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comment_likes',
        },
        () => {
          onUpdate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [lessonId, onUpdate]);
};