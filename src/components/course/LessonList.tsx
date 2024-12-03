import React from "react";
import { CheckCircle, PlayCircle } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  duration: number;
  user_progress: Array<{ completed_at: string }>;
}

interface LessonListProps {
  lessons: Lesson[];
  currentLessonId: string | null;
  onLessonSelect: (lessonId: string) => void;
}

const LessonList = ({ lessons, currentLessonId, onLessonSelect }: LessonListProps) => {
  return (
    <div className="bg-[#161616] rounded-lg p-4">
      <h3 className="text-white font-medium mb-4 px-2">Course Content</h3>
      <div className="space-y-1">
        {lessons?.map((lesson) => {
          const isCompleted = lesson.user_progress?.some(progress => progress.completed_at);
          
          return (
            <button
              key={lesson.id}
              onClick={() => onLessonSelect(lesson.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                currentLessonId === lesson.id
                  ? "bg-[#2a2727]"
                  : "hover:bg-[#1f1f1f]"
              }`}
            >
              {isCompleted ? (
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              ) : (
                <PlayCircle className="w-5 h-5 text-white flex-shrink-0" />
              )}
              <div className="flex-1 text-left">
                <p className="text-sm text-white truncate">{lesson.title}</p>
                <p className="text-xs text-[#aaaaaa]">{lesson.duration} min</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LessonList;