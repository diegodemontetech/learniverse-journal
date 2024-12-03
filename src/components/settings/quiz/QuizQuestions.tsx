import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import QuestionList from "./QuestionList";
import QuestionFormDialog from "./components/QuestionFormDialog";
import QuestionsHeader from "./components/QuestionsHeader";

interface QuizQuestionsProps {
  quizId: string;
}

const QuizQuestions = ({ quizId }: QuizQuestionsProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);

  const { data: questions, refetch: refetchQuestions } = useQuery({
    queryKey: ["quiz-questions", quizId],
    queryFn: async () => {
      if (!quizId) return [];
      
      const { data, error } = await supabase
        .from("quiz_questions")
        .select("*")
        .eq("quiz_id", quizId)
        .order("order_number");

      if (error) throw error;
      return data;
    },
    enabled: !!quizId,
  });

  const handleSubmit = async (values: any) => {
    try {
      const options = values.options
        .split(",")
        .map((option: string) => option.trim())
        .filter((option: string) => option !== "");

      if (options.length < 2) {
        toast({
          title: "Erro",
          description: "Adicione pelo menos 2 opções, separadas por vírgula",
          variant: "destructive",
        });
        return;
      }

      if (!options.includes(values.correctAnswer)) {
        toast({
          title: "Erro",
          description: "A resposta correta deve estar entre as opções",
          variant: "destructive",
        });
        return;
      }

      if (selectedQuestion) {
        const { error } = await supabase
          .from("quiz_questions")
          .update({
            question: values.question,
            correct_answer: values.correctAnswer,
            options: options,
            order_number: values.orderNumber,
            points: values.points,
          })
          .eq("id", selectedQuestion.id);

        if (error) throw error;

        toast({
          title: "Questão atualizada",
          description: "A questão foi atualizada com sucesso!",
        });
      } else {
        const { error } = await supabase.from("quiz_questions").insert({
          quiz_id: quizId,
          question: values.question,
          correct_answer: values.correctAnswer,
          options: options,
          order_number: values.orderNumber,
          points: values.points,
        });

        if (error) throw error;

        toast({
          title: "Questão criada",
          description: "A questão foi criada com sucesso!",
        });
      }

      setSelectedQuestion(null);
      setIsDialogOpen(false);
      refetchQuestions();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a questão. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (question: any) => {
    setSelectedQuestion(question);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("quiz_questions").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Questão excluída",
        description: "A questão foi excluída com sucesso!",
      });

      refetchQuestions();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir a questão. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <QuestionsHeader
        quizId={quizId}
        onNewQuestion={() => {
          setSelectedQuestion(null);
          setIsDialogOpen(true);
        }}
      />

      <QuestionList
        questions={questions}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <QuestionFormDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedQuestion={selectedQuestion}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default QuizQuestions;