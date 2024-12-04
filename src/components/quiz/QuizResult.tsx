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
import { CheckCircle2, XCircle } from "lucide-react";

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
          <AlertDialogTitle className="flex items-center gap-2">
            {passed ? (
              <>
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                <span>Parabéns!</span>
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6 text-red-500" />
                <span>Não foi dessa vez...</span>
              </>
            )}
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-lg font-semibold">
                Sua nota: {(score / 10).toFixed(1)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Nota mínima necessária: {(passingScore / 10).toFixed(1)}
              </p>
            </div>
            {passed ? (
              <p>
                Você completou o curso com sucesso! Seu certificado foi gerado
                e você ganhou pontos de experiência.
              </p>
            ) : (
              <p>
                Você não atingiu a nota mínima necessária. Revise o conteúdo
                e tente novamente.
              </p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/courses")}
          >
            Voltar para Cursos
          </Button>
          {!passed && (
            <Button 
              onClick={onRetry}
              className="bg-i2know-accent hover:bg-i2know-accent/90"
            >
              Tentar Novamente
            </Button>
          )}
          {passed && (
            <Button 
              onClick={() => navigate("/journey")}
              className="bg-i2know-accent hover:bg-i2know-accent/90"
            >
              Ver Jornada
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default QuizResult;