import { Progress } from "@/components/ui/progress";

interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
}

const QuizProgress = ({ currentQuestion, totalQuestions }: QuizProgressProps) => {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-white">
        <span>Questão {currentQuestion + 1} de {totalQuestions}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default QuizProgress;