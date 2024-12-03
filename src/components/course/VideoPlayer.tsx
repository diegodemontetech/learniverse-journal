import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface VideoPlayerProps {
  lesson: {
    id: string;
    title: string;
    description: string;
    youtube_url: string;
  };
  onComplete: (lessonId: string) => void;
  onProgressChange: (progress: number) => void;
}

const VideoPlayer = ({ lesson, onComplete, onProgressChange }: VideoPlayerProps) => {
  const [progress, setProgress] = useState(0);
  const playerRef = useRef<HTMLIFrameElement>(null);

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    
    let videoId = '';
    
    const watchUrlMatch = url.match(/(?:youtube\.com\/watch\?v=)([^&]+)/);
    if (watchUrlMatch) {
      videoId = watchUrlMatch[1];
    }
    
    const shortUrlMatch = url.match(/(?:youtu\.be\/)([^?]+)/);
    if (shortUrlMatch) {
      videoId = shortUrlMatch[1];
    }
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
    }
    
    if (url.includes('youtube.com/embed/')) {
      return url.includes('?') ? `${url}&enablejsapi=1` : `${url}?enablejsapi=1`;
    }
    
    return '';
  };

  useEffect(() => {
    // Reset progress when lesson changes
    setProgress(0);
    onProgressChange(0);
  }, [lesson.id]);

  // Simulated progress update (in a real app, you'd use YouTube API)
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + 1, 100);
        onProgressChange(newProgress);
        return newProgress;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#161616] rounded-lg overflow-hidden">
      <div className="aspect-video bg-black relative">
        {lesson?.youtube_url ? (
          <iframe
            ref={playerRef}
            src={getEmbedUrl(lesson.youtube_url)}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-white">No video available</p>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">
            {lesson.title}
          </h2>
          <div className="flex items-center gap-2">
            <Progress value={progress} className="w-32" />
            <span className="text-sm text-[#aaaaaa]">{progress}%</span>
          </div>
        </div>
        
        <p className="text-[#aaaaaa] mb-4">
          {lesson.description}
        </p>
        
        <Button
          onClick={() => onComplete(lesson.id)}
          className="bg-[#1a1717] hover:bg-[#2a2727] text-white"
          disabled={progress < 80}
        >
          {progress < 80 ? `Watch ${80 - progress}% more to continue` : "Mark as Complete"}
        </Button>
      </div>
    </div>
  );
};

export default VideoPlayer;