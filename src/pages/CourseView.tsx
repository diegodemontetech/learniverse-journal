import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle } from "lucide-react";
import VideoPlayer from "@/components/course/VideoPlayer";
import LessonList from "@/components/course/LessonList";
import Quiz from "@/components/quiz/Quiz";

const CourseView = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);

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
          ),
          quizzes(*)
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
        progress_percentage: calculateProgress(),
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
      <div className="p-8">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-4 w-96 mb-8" />
        <div className="grid grid-cols-3 gap-8">
          <Skeleton className="h-[400px]" />
          <div className="col-span-1">
            <Skeleton className="h-12 mb-4" />
            <Skeleton className="h-12 mb-4" />
            <Skeleton className="h-12 mb-4" />
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-white mb-4">Course not found</h1>
        <Button onClick={() => navigate("/courses")}>Back to Courses</Button>
      </div>
    );
  }

  const currentLesson = course.lessons?.find(
    (lesson) => lesson.id === currentLessonId
  );

  return (
    <div className="p-8 bg-i2know-body min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">{course.title}</h1>
        <p className="text-i2know-text-secondary mb-8">{course.description}</p>

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2">
            {showQuiz ? (
              <Quiz
                quizId={course.quizzes[0].id}
                onComplete={() => {
                  toast({
                    title: "Congratulations!",
                    description: "You've completed the course!",
                  });
                }}
              />
            ) : (
              currentLesson && (
                <VideoPlayer
                  lesson={currentLesson}
                  onComplete={handleLessonComplete}
                />
              )
            )}
          </div>

          <div className="space-y-4">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Course Progress
              </h3>
              <Progress value={calculateProgress()} className="h-2" />
              <p className="text-sm text-i2know-text-secondary mt-2">
                {calculateProgress()}% Complete
              </p>
            </div>

            <LessonList
              lessons={course.lessons}
              currentLessonId={currentLessonId}
              onLessonSelect={(id) => {
                setCurrentLessonId(id);
                setShowQuiz(false);
              }}
            />

            {course.quizzes?.[0] && (
              <Card
                className={`bg-[#1a1717] border-none cursor-pointer transition-colors ${
                  showQuiz ? "ring-2 ring-i2know-accent" : "hover:bg-[#2a2727]"
                }`}
                onClick={() => {
                  setShowQuiz(true);
                  setCurrentLessonId(null);
                }}
              >
                <CardHeader className="p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-yellow-500" />
                    <div>
                      <CardTitle className="text-sm text-white">
                        Course Quiz
                      </CardTitle>
                      <CardDescription>
                        Test your knowledge
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseView;