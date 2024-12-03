import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import QuizForm from "./quiz/QuizForm";
import QuizList from "./quiz/QuizList";
import QuizQuestions from "./quiz/QuizQuestions";

const QuizzesTab = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);

  const { data: courses } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("title");

      if (error) throw error;
      return data;
    },
  });

  const { data: quizzes, refetch: refetchQuizzes } = useQuery({
    queryKey: ["quizzes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quizzes")
        .select(`
          *,
          courses (
            title
          )
        `)
        .order("created_at");

      if (error) throw error;
      return data;
    },
  });

  const onSubmit = async (values: any) => {
    try {
      if (selectedQuiz) {
        const { error } = await supabase
          .from("quizzes")
          .update({
            course_id: values.courseId,
            title: values.title,
            description: values.description,
            passing_score: values.passingScore,
          })
          .eq("id", selectedQuiz.id);

        if (error) throw error;

        toast({
          title: "Quiz atualizado",
          description: "O quiz foi atualizado com sucesso!",
        });
      } else {
        const { error } = await supabase.from("quizzes").insert({
          course_id: values.courseId,
          title: values.title,
          description: values.description,
          passing_score: values.passingScore,
        });

        if (error) throw error;

        toast({
          title: "Quiz criado",
          description: "O quiz foi criado com sucesso!",
        });
      }

      setSelectedQuiz(null);
      setIsDialogOpen(false);
      refetchQuizzes();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o quiz. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (quiz: any) => {
    setSelectedQuiz(quiz);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("quizzes").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Quiz excluído",
        description: "O quiz foi excluído com sucesso!",
      });

      refetchQuizzes();
      if (activeQuizId === id) {
        setActiveQuizId(null);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o quiz. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Quizzes</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setSelectedQuiz(null);
              }}
            >
              Novo Quiz
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedQuiz ? "Editar Quiz" : "Novo Quiz"}
              </DialogTitle>
            </DialogHeader>
            <QuizForm
              courses={courses}
              selectedQuiz={selectedQuiz}
              onSubmit={onSubmit}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <QuizList
            quizzes={quizzes}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSelectQuiz={(quiz) => setActiveQuizId(quiz.id)}
          />
        </div>
        <div>
          <QuizQuestions quizId={activeQuizId!} />
        </div>
      </div>
    </div>
  );
};

export default QuizzesTab;