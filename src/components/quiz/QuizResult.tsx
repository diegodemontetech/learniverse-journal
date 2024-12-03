import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface QuizResultProps {
  score: number;
  passingScore: number;
  onRetry: () => void;
}

const QuizResult = ({ score, passingScore, onRetry }: QuizResultProps) => {
  const navigate = useNavigate();
  const passed = score >= passingScore;

  return (
    <AlertDialog defaultOpen>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {passed ? "Parabéns!" : "Não foi dessa vez..."}
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Você atingiu {score.toFixed(1)}% dos pontos.
              {!passed && ` A nota mínima necessária é ${passingScore}%.`}
            </p>
            {!passed && (
              <p>Você gostaria de tentar novamente?</p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={() => navigate("/")}
          >
            Voltar para Home
          </Button>
          {!passed && (
            <Button onClick={onRetry}>
              Tentar Novamente
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default QuizResult;