import React, { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import VideoControls from "./video-player/VideoControls";
import CompletionBadge from "./video-player/CompletionBadge";
import { useVideoProgress } from "./video-player/useVideoProgress";

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const { progress, updateProgress } = useVideoProgress(lesson.id, onProgressChange);
  const [highestProgress, setHighestProgress] = useState(progress);

  useEffect(() => {
    const loadVideo = async () => {
      if (!lesson.video_file_path) return;

      try {
        const { data: { signedUrl }, error } = await supabase.storage
          .from('lesson_videos')
          .createSignedUrl(lesson.video_file_path, 3600);

        if (error) {
          console.error("Erro ao criar URL assinada:", error);
          throw error;
        }

        setVideoUrl(signedUrl);
      } catch (error) {
        console.error("Erro ao carregar vídeo:", error);
      }
    };

    loadVideo();
  }, [lesson]);

  // Update highest progress when progress changes
  useEffect(() => {
    if (progress > highestProgress) {
      setHighestProgress(progress);
    }
  }, [progress]);

  const handleTimeUpdate = async () => {
    if (!videoRef.current) return;

    const duration = videoRef.current.duration;
    const currentTime = videoRef.current.currentTime;
    const newProgress = Math.round((currentTime / duration) * 100);
    
    // Only update if it's higher than previous progress
    if (newProgress > highestProgress) {
      await updateProgress(newProgress);
      setHighestProgress(newProgress);
    }

    if (newProgress >= 100) {
      onComplete(lesson.id);
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

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  if (!videoUrl && !lesson.youtube_url) {
    return (
      <div className="aspect-video bg-black flex items-center justify-center">
        <p className="text-white">Nenhum vídeo disponível</p>
      </div>
    );
  }

  return (
    <div className="relative aspect-video bg-black">
      <CompletionBadge isCompleted={highestProgress >= 100} />
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full"
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onContextMenu={handleContextMenu}
      />
      <VideoControls
        isPlaying={isPlaying}
        isMuted={isMuted}
        progress={progress}
        onPlayToggle={togglePlay}
        onMuteToggle={toggleMute}
      />
    </div>
  );
};

export default VideoPlayer;