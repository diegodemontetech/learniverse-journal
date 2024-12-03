import React from "react";
import { Button } from "@/components/ui/button";

interface VideoPlayerProps {
  lesson: {
    id: string;
    title: string;
    description: string;
    youtube_url: string;
  };
  onComplete: (lessonId: string) => void;
}

const VideoPlayer = ({ lesson, onComplete }: VideoPlayerProps) => {
  // Function to get proper YouTube embed URL
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    
    // Handle different YouTube URL formats
    let videoId = '';
    
    // Handle youtube.com/watch?v= format
    const watchUrlMatch = url.match(/(?:youtube\.com\/watch\?v=)([^&]+)/);
    if (watchUrlMatch) {
      videoId = watchUrlMatch[1];
    }
    
    // Handle youtu.be/ format
    const shortUrlMatch = url.match(/(?:youtu\.be\/)([^?]+)/);
    if (shortUrlMatch) {
      videoId = shortUrlMatch[1];
    }
    
    // If we found a video ID, return the embed URL
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // If the URL is already an embed URL, return it as is
    if (url.includes('youtube.com/embed/')) {
      return url;
    }
    
    return '';
  };

  return (
    <div className="bg-[#161616] rounded-lg overflow-hidden">
      <div className="aspect-video bg-black relative">
        {lesson?.youtube_url ? (
          <iframe
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
        <h2 className="text-xl font-bold text-white mb-3">
          {lesson.title}
        </h2>
        <p className="text-[#aaaaaa] mb-4">
          {lesson.description}
        </p>
        <Button
          onClick={() => onComplete(lesson.id)}
          className="bg-[#1a1717] hover:bg-[#2a2727] text-white"
        >
          Mark as Complete
        </Button>
      </div>
    </div>
  );
};

export default VideoPlayer;