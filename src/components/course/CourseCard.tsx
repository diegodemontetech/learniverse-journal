import { useNavigate } from "react-router-dom";
import { Clock, Tv, Eye, Award } from "lucide-react";
import { Course } from "@/types/course";
import CourseStatusBadge from "./CourseStatusBadge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CourseCardProps {
  course: Course;
  onCourseClick: (courseId: string) => void;
}

const CourseCard = ({ course, onCourseClick }: CourseCardProps) => {
  const { data: quizAttempt } = useQuery({
    queryKey: ["quiz_attempt", course.id],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: quiz } = await supabase
        .from("quizzes")
        .select("id")
        .eq("course_id", course.id)
        .single();

      if (!quiz) return null;

      const { data } = await supabase
        .from("quiz_attempts")
        .select("*")
        .eq("quiz_id", quiz.id)
        .eq("user_id", user.id)
        .maybeSingle();

      return data;
    },
  });

  const { data: certificate } = useQuery({
    queryKey: ["certificate", course.id],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from("certificates")
        .select("*")
        .eq("course_id", course.id)
        .eq("user_id", user.id)
        .maybeSingle();

      return data;
    },
  });

  return (
    <div
      className="group cursor-pointer relative"
      onClick={() => onCourseClick(course.id)}
    >
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-3">
        {course.status && (
          <CourseStatusBadge 
            status={course.status} 
            progress={course.user_progress?.[0]?.progress_percentage || 0}
          />
        )}
        <img
          src={course.thumbnail_url || "/placeholder.svg"}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {certificate ? (
            <div className="flex items-center gap-2 text-white">
              <Award className="w-4 h-4" />
              <span className="text-sm">
                Concluído - Nota: {(quizAttempt?.score / 10).toFixed(1)}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-white">
              <Eye className="w-4 h-4" />
              <span className="text-sm">
                {quizAttempt ? 'Ver certificado' : 'Acessar curso'}
              </span>
            </div>
          )}
        </div>
      </div>
      <h3 className="text-white font-semibold mb-1 group-hover:text-i2know-accent transition-colors">
        {course.title}
      </h3>
      <div className="flex items-center justify-between text-i2know-text-secondary text-sm">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{course.duration || 0}min</span>
        </div>
        <div className="flex items-center gap-1">
          <Tv className="w-3 h-3" />
          <span>{course.instructor}</span>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;