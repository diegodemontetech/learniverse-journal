import { Skeleton } from "@/components/ui/skeleton";
import { Course } from "@/types/course";
import CourseCard from "./CourseCard";
import { useNavigate } from "react-router-dom";

interface CourseGridProps {
  courses?: Course[];
  isLoading: boolean;
  onCourseClick?: (courseId: string) => void;
}

const CourseGrid = ({ courses, isLoading, onCourseClick }: CourseGridProps) => {
  const navigate = useNavigate();

  const handleCourseClick = (courseId: string) => {
    if (onCourseClick) {
      onCourseClick(courseId);
    } else {
      navigate(`/courses/${courseId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mt-12">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="relative aspect-[2/3] rounded-lg overflow-hidden">
            <Skeleton className="w-full h-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mt-12">
      {courses?.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          onCourseClick={handleCourseClick}
        />
      ))}
    </div>
  );
};

export default CourseGrid;