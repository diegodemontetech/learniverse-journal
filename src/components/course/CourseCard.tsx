import { useNavigate } from "react-router-dom";
import { Clock, Tv, Eye } from "lucide-react";
import { Course } from "@/types/course";
import CourseStatusBadge from "./CourseStatusBadge";

interface CourseCardProps {
  course: Course;
  onCourseClick: (courseId: string) => void;
}

const CourseCard = ({ course, onCourseClick }: CourseCardProps) => {
  return (
    <div
      className="group cursor-pointer relative"
      onClick={() => onCourseClick(course.id)}
    >
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-3">
        {course.status && <CourseStatusBadge status={course.status} />}
        <img
          src={course.thumbnail_url || "/placeholder.svg"}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-2 text-white">
            <Eye className="w-4 h-4" />
            <span className="text-sm">Acessar curso</span>
          </div>
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