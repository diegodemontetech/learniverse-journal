import React, { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import VideoControls from "./video-player/VideoControls";
import { useToast } from "@/components/ui/use-toast";

interface VideoPlayerProps {
  lesson: {
    id: string;
    video_file_path: string | null;
    youtube_url: string | null;
    title: string;
  };
}

const VideoPlayer = ({ lesson }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const loadVideo = async () => {
      if (!lesson.video_file_path) return;

      try {
        const { data: { signedUrl }, error } = await supabase.storage
          .from('lesson_videos')
          .createSignedUrl(lesson.video_file_path, 3600);

        if (error) {
          console.error("Error creating signed URL:", error);
          toast({
            title: "Erro",
            description: "Não foi possível carregar o vídeo. Tente novamente.",
            variant: "destructive",
          });
          return;
        }

        setVideoUrl(signedUrl);
      } catch (error) {
        console.error("Error loading video:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar o vídeo. Tente novamente.",
          variant: "destructive",
        });
      }
    };

    loadVideo();
  }, [lesson]);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const duration = videoRef.current.duration;
    const currentTime = videoRef.current.currentTime;
    const newProgress = Math.round((currentTime / duration) * 100);
    setProgress(newProgress);
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