import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import CourseHeader from "@/components/course/CourseHeader";
import VideoPlayer from "@/components/course/VideoPlayer";
import LessonList from "@/components/course/LessonList";
import Quiz from "@/components/quiz/Quiz";
import { useCourseData } from "@/hooks/useCourseData";
import { LessonInteractions } from "@/components/course/lesson-interactions/LessonInteractions";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const CourseView = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [isLessonListVisible, setIsLessonListVisible] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const isMobile = useIsMobile();

  const { data: course, isLoading: isLoadingCourse, error } = useCourseData(courseId);

  const { data: quiz } = useQuery({
    queryKey: ["quiz", courseId],
    queryFn: async () => {
      if (!courseId) return null;
      
      const { data, error } = await supabase
        .from("quizzes")
        .select("*")
        .eq("course_id", courseId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });

  useEffect(() => {
    if (course?.lessons?.[0]) {
      setCurrentLessonId(course.lessons[0].id);
    }
  }, [course]);

  const handleQuizComplete = () => {
    toast({
      title: "Parabéns!",
      description: "Você completou o curso e ganhou pontos!",
    });
    navigate("/journey");
  };

  if (isLoadingCourse) {
    return (
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-4">
            <Skeleton className="aspect-video" />
            <Skeleton className="h-24" />
          </div>
          <Skeleton className="h-[600px]" />
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-white mb-4">Curso não encontrado</h1>
        <Button onClick={() => navigate("/courses")}>
          Voltar para Cursos
        </Button>
      </div>
    );
  }

  const currentLesson = course.lessons?.find(
    (lesson) => lesson.id === currentLessonId
  );

  return (
    <div className="p-4 sm:p-5 max-w-full mx-auto bg-[#131313]">
      <CourseHeader 
        title={course.title}
        description={course.description || ""}
        progress={0}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="lg:col-span-3 space-y-4 sm:space-y-5">
          {!showQuiz ? (
            <>
              {currentLesson && (
                <>
                  <div>
                    <VideoPlayer lesson={currentLesson} />
                  </div>
                  <div className="bg-[#272727] rounded-lg p-4 sm:p-5">
                    <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
                      {currentLesson.title}
                    </h2>
                    <p className="text-sm sm:text-base text-white/80">
                      {currentLesson.description}
                    </p>
                  </div>
                  <LessonInteractions lessonId={currentLesson.id} />
                </>
              )}
              {quiz && (
                <div className="bg-[#272727] rounded-lg p-4 sm:p-5">
                  <h2 className="text-lg sm:text-xl font-bold text-white mb-3">
                    Avaliação do Curso
                  </h2>
                  <p className="text-sm text-white/80 mb-4">
                    Faça a avaliação para concluir o curso e receber seu certificado.
                  </p>
                  <Button 
                    onClick={() => setShowQuiz(true)}
                    className="w-full bg-i2know-accent hover:bg-i2know-accent/90"
                  >
                    Iniciar Avaliação
                  </Button>
                </div>
              )}
            </>
          ) : (
            quiz && (
              <div className="bg-[#272727] rounded-lg p-4 sm:p-5">
                <Quiz
                  quizId={quiz.id}
                  onComplete={handleQuizComplete}
                />
              </div>
            )
          )}
        </div>
        
        <div className="order-first lg:order-last">
          {isMobile && (
            <Button
              variant="ghost"
              className="w-full mb-2 flex items-center justify-between bg-[#272727] text-white hover:bg-[#3a3a3a]"
              onClick={() => setIsLessonListVisible(!isLessonListVisible)}
            >
              <span>Conteúdo do Curso</span>
              {isLessonListVisible ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          )}
          <div className={`${isMobile && !isLessonListVisible ? 'hidden' : 'block'}`}>
            <LessonList
              lessons={course.lessons || []}
              currentLessonId={currentLessonId}
              onLessonSelect={setCurrentLessonId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseView;