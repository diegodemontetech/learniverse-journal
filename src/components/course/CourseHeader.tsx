import { Trophy } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface CourseHeaderProps {
  title: string;
  description: string;
  progress: number;
}

const CourseHeader = ({ title, description, progress }: CourseHeaderProps) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
      <p className="text-[#aaaaaa] mb-4">{description}</p>
      <div className="flex items-center gap-2">
        <Progress value={progress} className="h-1 flex-1" />
        <span className="text-sm text-[#aaaaaa] flex items-center gap-1">
          <Trophy className="w-4 h-4" />
          {progress}% Completo
        </span>
      </div>
    </div>
  );
};

export default CourseHeader;