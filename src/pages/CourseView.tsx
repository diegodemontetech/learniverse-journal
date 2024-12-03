import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import CourseHeader from "@/components/course/CourseHeader";
import VideoPlayer from "@/components/course/VideoPlayer";
import LessonList from "@/components/course/LessonList";
import SupportMaterials from "@/components/course/SupportMaterials";
import { useCourseData } from "@/hooks/useCourseData";
import { LessonInteractions } from "@/components/course/lesson-interactions/LessonInteractions";

const CourseView = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [videoProgress, setVideoProgress] = useState(0);

  const { data: course, isLoading: isLoadingCourse, error } = useCourseData(courseId);

  useEffect(() => {
    if (course?.lessons?.[0]) {
      setCurrentLessonId(course.lessons[0].id);
    }
  }, [course]);

  const handleLessonComplete = async (lessonId: string) => {
    if (!courseId) return;
    
    if (videoProgress < 80) {
      toast({
        title: "Assista mais do vídeo",
        description: "Por favor, assista pelo menos 80% do vídeo para marcá-lo como concluído.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) throw new Error("User not authenticated");

      const { error: progressError } = await supabase
        .from("user_progress")
        .upsert({
          user_id: user.id,
          course_id: courseId,
          lesson_id: lessonId,
          completed_at: new Date().toISOString(),
        });

      if (progressError) throw progressError;

      toast({
        title: "Sucesso",
        description: "Aula concluída! +10 pontos",
      });

      // Move to next lesson if available
      const currentIndex = course?.lessons?.findIndex(lesson => lesson.id === lessonId);
      if (currentIndex !== undefined && currentIndex < (course?.lessons?.length || 0) - 1) {
        setCurrentLessonId(course?.lessons?.[currentIndex + 1].id);
      }
    } catch (error) {
      console.error("Error updating progress:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o progresso. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const calculateProgress = () => {
    if (!course?.lessons) return 0;
    const completedLessons = course.lessons.filter(
      (lesson) => lesson.user_progress?.some(progress => progress.completed_at)
    ).length;
    return Math.round((completedLessons / course.lessons.length) * 100);
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
    <div className="p-5 max-w-full mx-auto bg-[#131313]">
      <CourseHeader 
        title={course.title}
        description={course.description || ""}
        progress={calculateProgress()}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="lg:col-span-3 space-y-5">
          {currentLesson ? (
            <>
              <div>
                <VideoPlayer
                  lesson={currentLesson}
                  onComplete={handleLessonComplete}
                  onProgressChange={setVideoProgress}
                />
              </div>
              <div className="bg-[#272727] rounded-lg p-5">
                <h2 className="text-xl font-bold text-white mb-4">{currentLesson.title}</h2>
                <p className="text-white/80">{currentLesson.description}</p>
              </div>
              <LessonInteractions lessonId={currentLesson.id} />
              <div className="bg-[#272727] rounded-lg p-5">
                <SupportMaterials lessonId={currentLesson.id} />
              </div>
            </>
          ) : (
            <div className="bg-[#272727] rounded-lg p-6 text-center">
              <p className="text-white">Nenhuma aula selecionada</p>
            </div>
          )}
        </div>
        
        <div className="bg-[#272727] rounded-lg p-5">
          <LessonList
            lessons={course.lessons || []}
            currentLessonId={currentLessonId}
            onLessonSelect={setCurrentLessonId}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseView;