import { Button } from "@/components/ui/button";

interface QuestionsHeaderProps {
  quizId: string;
  onNewQuestion: () => void;
}

const QuestionsHeader = ({ quizId, onNewQuestion }: QuestionsHeaderProps) => {
  if (!quizId) {
    return (
      <div className="text-center text-muted-foreground">
        Selecione um quiz para gerenciar suas questões
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold">Questões do Quiz</h3>
      <Button onClick={onNewQuestion}>
        Nova Questão
      </Button>
    </div>
  );
};

export default QuestionsHeader;