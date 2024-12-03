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
  return (
    <div>
      <div className="aspect-video bg-black rounded-lg relative">
        {lesson?.youtube_url ? (
          <iframe
            src={lesson.youtube_url}
            className="w-full h-full rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-white">No video available</p>
          </div>
        )}
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-bold text-white mb-2">
          {lesson.title}
        </h2>
        <p className="text-i2know-text-secondary">
          {lesson.description}
        </p>
        <Button
          className="mt-4"
          onClick={() => onComplete(lesson.id)}
        >
          Mark as Complete
        </Button>
      </div>
    </div>
  );
};

export default VideoPlayer;