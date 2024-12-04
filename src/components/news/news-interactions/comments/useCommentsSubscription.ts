import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useCommentsSubscription = (newsId: string, onUpdate: () => void) => {
  useEffect(() => {
    const channel = supabase
      .channel('news_comments')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'news_comments',
          filter: `news_id=eq.${newsId}`
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
          table: 'news_comment_likes',
        },
        () => {
          onUpdate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [newsId, onUpdate]);
};