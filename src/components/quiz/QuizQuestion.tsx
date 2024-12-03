import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface QuizQuestionProps {
  question: string;
  options: string[];
  selectedAnswer: string;
  onAnswerSelect: (answer: string) => void;
}

const QuizQuestion = ({
  question,
  options,
  selectedAnswer,
  onAnswerSelect,
}: QuizQuestionProps) => {
  return (
    <Card className="bg-[#1a1717] border-none">
      <CardContent className="pt-6 space-y-6">
        <div className="text-lg text-white">{question}</div>
        <RadioGroup
          value={selectedAnswer}
          onValueChange={onAnswerSelect}
          className="space-y-3"
        >
          {options.map((option, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 bg-[#2a2727] rounded-lg p-4 hover:bg-[#3a3737] transition-colors"
            >
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label
                htmlFor={`option-${index}`}
                className="text-white flex-1 cursor-pointer"
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default QuizQuestion;