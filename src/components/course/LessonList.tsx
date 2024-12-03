import React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
    <div className="space-y-4">
      {lessons?.map((lesson) => (
        <Card
          key={lesson.id}
          className={`bg-[#1a1717] border-none cursor-pointer transition-colors ${
            currentLessonId === lesson.id
              ? "ring-2 ring-i2know-accent"
              : "hover:bg-[#2a2727]"
          }`}
          onClick={() => onLessonSelect(lesson.id)}
        >
          <CardHeader className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {lesson.user_progress?.[0]?.completed_at ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <PlayCircle className="w-5 h-5 text-i2know-accent" />
                )}
                <div>
                  <CardTitle className="text-sm text-white">
                    {lesson.title}
                  </CardTitle>
                  <CardDescription>
                    {lesson.duration} minutes
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

export default LessonList;