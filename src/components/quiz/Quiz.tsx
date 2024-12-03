import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface QuizProps {
  quizId: string;
  onComplete: () => void;
}

const Quiz = ({ quizId, onComplete }: QuizProps) => {
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const questions = quiz?.quiz_questions || [];
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
    let score = 0;
    questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correct_answer) {
        score += question.points || 0;
      }
    });
    return score;
  };

  const handleSubmit = async () => {
    if (Object.keys(selectedAnswers).length < questions.length) {
      toast({
        title: "Error",
        description: "Please answer all questions before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const score = calculateScore();
    const maxScore = questions.reduce((acc, q) => acc + (q.points || 0), 0);
    const percentageScore = (score / maxScore) * 100;

    try {
      const { error } = await supabase
        .from("quiz_attempts")
        .insert({
          quiz_id: quizId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          score: percentageScore,
          points_earned: score,
        });

      if (error) throw error;

      toast({
        title: "Quiz Completed!",
        description: `You scored ${percentageScore.toFixed(1)}% and earned ${score} points!`,
      });

      onComplete();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingQuiz) {
    return <div>Loading quiz...</div>;
  }

  if (!currentQuestion) {
    return <div>No questions found.</div>;
  }

  return (
    <Card className="bg-[#1a1717] border-none">
      <CardHeader>
        <CardTitle className="text-white">
          Question {currentQuestionIndex + 1} of {questions.length}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-lg text-white">{currentQuestion.question}</div>
        <RadioGroup
          value={selectedAnswers[currentQuestion.id]}
          onValueChange={(value) => {
            setSelectedAnswers(prev => ({
              ...prev,
              [currentQuestion.id]: value,
            }));
          }}
        >
          {currentQuestion.options.map((option: string, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`} className="text-white">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          {currentQuestionIndex === questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-i2know-accent hover:bg-i2know-accent/90"
            >
              Submit Quiz
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!selectedAnswers[currentQuestion.id]}
            >
              Next
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Quiz;