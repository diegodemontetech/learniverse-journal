import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import QuizProgress from "./QuizProgress";
import QuizQuestion from "./QuizQuestion";
import QuizResult from "./QuizResult";

interface QuizProps {
  quizId: string;
  courseId: string;
  onComplete: () => void;
}

const Quiz = ({ quizId, courseId, onComplete }: QuizProps) => {
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const { data: quiz, isLoading: isLoadingQuiz } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quizzes")
        .select(`
          *,
          quiz_questions(*)
        `)
        .eq("id", quizId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const questions = (quiz?.quiz_questions || []) as any[];
  const currentQuestion = questions[currentQuestionIndex];

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correct_answer) {
        correctAnswers++;
      }
    });
    
    // Each question has equal weight, total score is 100
    return (correctAnswers / questions.length) * 100;
  };

  const handleSubmit = async () => {
    if (Object.keys(selectedAnswers).length < questions.length) {
      toast({
        title: "Erro",
        description: "Por favor, responda todas as questões antes de enviar.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const score = calculateScore();

    try {
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

      setQuizScore(score);
      setShowResult(true);
      onComplete();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao enviar o quiz. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResult(false);
    setQuizScore(0);
  };

  if (isLoadingQuiz) {
    return <div>Carregando quiz...</div>;
  }

  if (!currentQuestion) {
    return <div>Nenhuma questão encontrada.</div>;
  }

  if (showResult) {
    return (
      <QuizResult
        score={quizScore}
        passingScore={quiz?.passing_score || 50}
        onRetry={handleRetry}
      />
    );
  }

  return (
    <div className="space-y-6">
      <QuizProgress
        currentQuestion={currentQuestionIndex}
        totalQuestions={questions.length}
      />

      <QuizQuestion
        question={currentQuestion.question}
        options={currentQuestion.options}
        selectedAnswer={selectedAnswers[currentQuestion.id] || ""}
        onAnswerSelect={(answer) => {
          setSelectedAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: answer,
          }));
        }}
      />

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="bg-black text-white hover:bg-black/90"
        >
          Anterior
        </Button>
        {currentQuestionIndex === questions.length - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-i2know-accent hover:bg-i2know-accent/90"
          >
            Finalizar Quiz
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={!selectedAnswers[currentQuestion.id]}
          >
            Próxima
          </Button>
        )}
      </div>
    </div>
  );
};

export default Quiz;