import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import CourseHeader from "@/components/course/CourseHeader";
import VideoPlayer from "@/components/course/VideoPlayer";
import LessonList from "@/components/course/LessonList";

const CourseView = () => {
  const { courseId } = useParams();
  const { toast } = useToast();
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);

  const { data: course, isLoading: isLoadingCourse } = useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select(`
          *,
          lessons(
            *,
            user_progress(completed_at)
          )
        `)
        .eq("id", courseId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (course?.lessons?.[0]) {
      setCurrentLessonId(course.lessons[0].id);
    }
  }, [course]);

  const handleLessonComplete = async (lessonId: string) => {
    const { error } = await supabase
      .from("user_progress")
      .upsert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        course_id: courseId,
        lesson_id: lessonId,
        completed_at: new Date().toISOString(),
      });

    if (error) {
      toast({
        title: "Error",
        description: "Could not update progress. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Lesson completed! +10 points",
    });
  };

  const calculateProgress = () => {
    if (!course?.lessons) return 0;
    const completedLessons = course.lessons.filter(
      (lesson) => lesson.user_progress?.[0]?.completed_at
    ).length;
    return Math.round((completedLessons / course.lessons.length) * 100);
  };

  if (isLoadingCourse) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-4 w-96 mb-8" />
        <div className="grid grid-cols-3 gap-8">
          <Skeleton className="col-span-2 h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-white mb-4">Course not found</h1>
      </div>
    );
  }

  const currentLesson = course.lessons?.find(
    (lesson) => lesson.id === currentLessonId
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <CourseHeader 
        title={course.title}
        description={course.description || ""}
        progress={calculateProgress()}
      />
      
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          {currentLesson && (
            <VideoPlayer
              lesson={currentLesson}
              onComplete={handleLessonComplete}
            />
          )}
        </div>
        
        <div>
          <LessonList
            lessons={course.lessons}
            currentLessonId={currentLessonId}
            onLessonSelect={setCurrentLessonId}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseView;