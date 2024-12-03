import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface VideoControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  progress: number;
  onPlayToggle: () => void;
  onMuteToggle: () => void;
}

const VideoControls = ({
  isPlaying,
  isMuted,
  progress,
  onPlayToggle,
  onMuteToggle,
}: VideoControlsProps) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onPlayToggle}
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
          onClick={onMuteToggle}
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
  );
};

export default VideoControls;