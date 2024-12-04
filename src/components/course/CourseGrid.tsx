import { Skeleton } from "@/components/ui/skeleton";
import { Course } from "@/types/course";
import CourseCard from "./CourseCard";
import { useNavigate } from "react-router-dom";

interface CourseGridProps {
  courses?: Course[];
  isLoading: boolean;
  onCourseClick?: (courseId: string) => void;
  showInactive?: boolean;
}

const CourseGrid = ({ 
  courses, 
  isLoading, 
  onCourseClick,
  showInactive = false 
}: CourseGridProps) => {
  const navigate = useNavigate();

  const handleCourseClick = (courseId: string) => {
    if (onCourseClick) {
      onCourseClick(courseId);
    } else {
      navigate(`/courses/${courseId}`);
    }
  };

  const filteredCourses = courses?.filter(course => 
    showInactive ? true : course.is_active !== false
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 sm:gap-6 mt-6 sm:mt-12">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="relative aspect-[2/3] rounded-lg overflow-hidden">
            <Skeleton className="w-full h-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 sm:gap-6 mt-6 sm:mt-12">
      {filteredCourses?.map((course) => (
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