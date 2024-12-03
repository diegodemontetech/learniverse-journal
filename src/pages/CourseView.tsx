import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import CourseHeader from "@/components/course/CourseHeader";
import VideoPlayer from "@/components/course/VideoPlayer";
import LessonList from "@/components/course/LessonList";

const CourseView = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [videoProgress, setVideoProgress] = useState(0);

  const { data: course, isLoading: isLoadingCourse, error } = useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      if (!courseId) throw new Error("Course ID is required");
      
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

      if (error) {
        console.error("Error fetching course:", error);
        throw error;
      }
      
      if (!data) {
        throw new Error("Course not found");
      }
      
      return data;
    },
    retry: 1,
    onError: (error) => {
      console.error("Error in course query:", error);
      toast({
        title: "Error",
        description: "Could not load the course. Please try again.",
        variant: "destructive",
      });
      navigate("/courses");
    }
  });

  useEffect(() => {
    if (course?.lessons?.[0]) {
      setCurrentLessonId(course.lessons[0].id);
    }
  }, [course]);

  const handleLessonComplete = async (lessonId: string) => {
    if (!courseId) return;
    
    if (videoProgress < 80) {
      toast({
        title: "Watch more of the video",
        description: "Please watch at least 80% of the video to mark it as complete.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error: progressError } = await supabase
        .from("user_progress")
        .upsert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          course_id: courseId,
          lesson_id: lessonId,
          completed_at: new Date().toISOString(),
        });

      if (progressError) throw progressError;

      toast({
        title: "Success",
        description: "Lesson completed! +10 points",
      });

      // Move to next lesson if available
      const currentIndex = course?.lessons?.findIndex(lesson => lesson.id === lessonId);
      if (currentIndex !== undefined && currentIndex < (course?.lessons?.length || 0) - 1) {
        setCurrentLessonId(course?.lessons?.[currentIndex + 1].id);
      }
    } catch (error) {
      console.error("Error updating progress:", error);
      toast({
        title: "Error",
        description: "Could not update progress. Please try again.",
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
        <h1 className="text-2xl font-bold text-white mb-4">Course not found</h1>
        <Button onClick={() => navigate("/courses")}>
          Return to Courses
        </Button>
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
        <div className="col-span-2 space-y-6">
          {currentLesson ? (
            <>
              <VideoPlayer
                lesson={currentLesson}
                onComplete={handleLessonComplete}
                onProgressChange={setVideoProgress}
              />
              
              {/* Support Materials Section */}
              <div className="bg-[#161616] rounded-lg p-6">
                <h3 className="text-white font-medium mb-4">Support Materials</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <FileText className="w-4 h-4" />
                    Lesson Notes.pdf
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <FileText className="w-4 h-4" />
                    Exercise Files.zip
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-[#161616] rounded-lg p-6 text-center">
              <p className="text-white">No lesson selected</p>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
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