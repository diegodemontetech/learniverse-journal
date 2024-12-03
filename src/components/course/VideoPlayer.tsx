import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface VideoPlayerProps {
  lesson: {
    id: string;
    video_file_path: string | null;
    youtube_url: string | null;
    title: string;
  };
  onComplete: (lessonId: string) => void;
  onProgressChange: (progress: number) => void;
}

const VideoPlayer = ({ lesson, onComplete, onProgressChange }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const progressInterval = useRef<number>();

  useEffect(() => {
    const loadVideo = async () => {
      if (!lesson.video_file_path) return;

      try {
        // Create signed URL directly from the video_file_path
        const { data: { signedUrl }, error } = await supabase.storage
          .from('lesson_videos')
          .createSignedUrl(lesson.video_file_path, 3600);

        if (error) {
          console.error("Error creating signed URL:", error);
          throw error;
        }

        setVideoUrl(signedUrl);

        // Try to get existing progress
        const { data: { user } } = await supabase.auth.getUser();
        if (!user?.id) return;

        const { data: progressData, error: progressError } = await supabase
          .from("user_progress")
          .select("*")
          .eq("lesson_id", lesson.id)
          .eq("user_id", user.id)
          .maybeSingle();

        if (!progressError && progressData) {
          setProgress(progressData.progress_percentage || 0);
        }
      } catch (error) {
        console.error("Error loading video:", error);
      }
    };

    loadVideo();

    return () => {
      if (progressInterval.current) {
        window.clearInterval(progressInterval.current);
      }
    };
  }, [lesson]);

  const handleTimeUpdate = async () => {
    if (!videoRef.current) return;

    const duration = videoRef.current.duration;
    const currentTime = videoRef.current.currentTime;
    const newProgress = Math.round((currentTime / duration) * 100);
    
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
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  if (!videoUrl) {
    return (
      <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
        <p className="text-white">No video available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full"
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlay}
              className="text-white hover:bg-white/20"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="text-white hover:bg-white/20"
            >
              {isMuted ? (
                <VolumeX className="w-6 h-6" />
              ) : (
                <Volume2 className="w-6 h-6" />
              )}
            </Button>
            <Progress value={progress} className="flex-1" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onComplete(lesson.id)}
          disabled={progress < 80}
        >
          Marcar como Concluído
        </Button>
      </div>
    </div>
  );
};

export default VideoPlayer;