import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";

// Add type declaration for YouTube IFrame API
declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: {
      Player: new (
        iframe: HTMLIFrameElement | string,
        options: {
          videoId?: string;
          events: {
            onStateChange: (event: { data: number }) => void;
          };
        }
      ) => void;
      PlayerState: {
        PLAYING: number;
      };
    };
  }
}

interface VideoPlayerProps {
  lesson: {
    id: string;
    youtube_url: string | null;
    title: string;
  };
  onComplete: (lessonId: string) => void;
  onProgressChange: (progress: number) => void;
}

const VideoPlayer = ({ lesson, onComplete, onProgressChange }: VideoPlayerProps) => {
  const playerContainerId = 'youtube-player-container';
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const progressInterval = useRef<number>();

  useEffect(() => {
    let player: any;

    const loadVideo = async () => {
      if (!lesson.youtube_url) return;

      // Get video ID from URL
      const videoId = new URL(lesson.youtube_url).searchParams.get("v");
      if (!videoId) return;

      // Load YouTube API script
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      // Try to get existing progress
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user?.id) return;

        const { data: progressData, error } = await supabase
          .from("user_progress")
          .select("*")
          .eq("lesson_id", lesson.id)
          .eq("user_id", user.id)
          .maybeSingle();

        if (!error && progressData) {
          setProgress(progressData.progress_percentage || 0);
        }
      } catch (error) {
        console.error("Error fetching progress:", error);
      }

      window.onYouTubeIframeAPIReady = () => {
        player = new window.YT.Player(playerContainerId, {
          videoId,
          events: {
            onStateChange: (event) => {
              setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
            }
          }
        });
      };
    };

    loadVideo();

    return () => {
      if (player) {
        player.destroy();
      }
      if (progressInterval.current) {
        window.clearInterval(progressInterval.current);
      }
    };
  }, [lesson]);

  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = window.setInterval(async () => {
        const newProgress = Math.min(progress + 1, 100);
        setProgress(newProgress);
        onProgressChange(newProgress);

        if (newProgress >= 80) {
          onComplete(lesson.id);
          if (progressInterval.current) {
            window.clearInterval(progressInterval.current);
          }
        }

        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user?.id) return;

          const { error } = await supabase
            .from("user_progress")
            .upsert({
              user_id: user.id,
              lesson_id: lesson.id,
              progress_percentage: newProgress,
              completed_at: newProgress >= 100 ? new Date().toISOString() : null
            });

          if (error) throw error;
        } catch (error) {
          console.error("Error updating progress:", error);
        }
      }, 1000);
    } else if (progressInterval.current) {
      window.clearInterval(progressInterval.current);
    }

    return () => {
      if (progressInterval.current) {
        window.clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying, progress, lesson.id, onComplete, onProgressChange]);

  if (!lesson.youtube_url) {
    return (
      <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
        <p className="text-white">No video available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        <div id={playerContainerId} className="w-full h-full" />
      </div>
      <div className="flex items-center gap-4">
        <Progress value={progress} className="flex-1" />
        <Button
          variant="outline"
          size="sm"
          onClick={() => onComplete(lesson.id)}
          disabled={progress < 80}
        >
          Mark as Complete
        </Button>
      </div>
    </div>
  );
};

export default VideoPlayer;