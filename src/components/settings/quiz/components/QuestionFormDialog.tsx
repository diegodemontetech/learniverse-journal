import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import QuestionForm from "../QuestionForm";

interface QuestionFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedQuestion: any;
  onSubmit: (values: any) => Promise<void>;
}

const QuestionFormDialog = ({
  isOpen,
  onOpenChange,
  selectedQuestion,
  onSubmit,
}: QuestionFormDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {selectedQuestion ? "Editar Questão" : "Nova Questão"}
          </DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para {selectedQuestion ? "editar a" : "criar uma nova"} questão.
          </DialogDescription>
        </DialogHeader>
        <QuestionForm
          onSubmit={onSubmit}
          defaultValues={
            selectedQuestion
              ? {
                  question: selectedQuestion.question,
                  correctAnswer: selectedQuestion.correct_answer,
                  options: selectedQuestion.options.join(", "),
                  orderNumber: selectedQuestion.order_number,
                  points: selectedQuestion.points,
                }
              : undefined
          }
          isEdit={!!selectedQuestion}
        />
      </DialogContent>
    </Dialog>
  );
};

export default QuestionFormDialog;