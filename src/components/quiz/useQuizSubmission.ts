import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useQuizSubmission = (quizId: string, courseId: string, onComplete: () => void) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateScore = (answers: Record<string, string>, questions: any[]) => {
    let correctAnswers = 0;
    questions.forEach(question => {
      if (answers[question.id] === question.correct_answer) {
        correctAnswers++;
      }
    });
    return (correctAnswers / questions.length) * 100;
  };

  const handleSubmit = async (
    selectedAnswers: Record<string, string>,
    questions: any[],
    passingScore: number
  ) => {
    if (Object.keys(selectedAnswers).length < questions.length) {
      toast({
        title: "Erro",
        description: "Por favor, responda todas as questões antes de enviar.",
        variant: "destructive",
      });
      return null;
    }

    setIsSubmitting(true);
    const score = calculateScore(selectedAnswers, questions);

    try {
      if (score >= (passingScore || 50)) {
        const { error } = await supabase
          .from("quiz_attempts")
          .insert({
            quiz_id: quizId,
            user_id: (await supabase.auth.getUser()).data.user?.id,
            score: score,
          })
          .select()
          .single();

        if (error) throw error;

        // Atualizar o status do curso como concluído apenas se passou
        await supabase
          .from("user_progress")
          .insert({
            user_id: (await supabase.auth.getUser()).data.user?.id,
            course_id: courseId,
            lesson_id: null,
            progress_percentage: 100,
            completed_at: new Date().toISOString(),
          });

        onComplete();
      }

      return score;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao enviar o quiz. Tente novamente.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting,
  };
};