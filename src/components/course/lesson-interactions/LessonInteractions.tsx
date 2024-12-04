import { LessonRating } from "./LessonRating";
import { LessonLikes } from "./LessonLikes";
import { LessonComments } from "./LessonComments";
import { SupportMaterials } from "@/components/course/SupportMaterials";

interface LessonInteractionsProps {
  lessonId: string;
}

export const LessonInteractions = ({ lessonId }: LessonInteractionsProps) => {
  return (
    <div className="space-y-4">
      <SupportMaterials lessonId={lessonId} />
      
      <div className="bg-[#272727] rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between">
          <LessonRating lessonId={lessonId} />
          <LessonLikes lessonId={lessonId} />
        </div>
        <div className="pt-4 border-t border-[#3a3a3a]">
          <LessonComments lessonId={lessonId} />
        </div>
      </div>
    </div>
  );
};