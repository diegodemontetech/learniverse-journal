import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { deleteCourse } from "@/utils/deleteHandlers";
import { useQueryClient } from "@tanstack/react-query";

interface CourseListProps {
  courses: any[];
  onEdit: (course: any) => void;
}

const CourseList = ({ courses, onEdit }: CourseListProps) => {
  const queryClient = useQueryClient();

  const handleDelete = async (courseId: string) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      const { success } = await deleteCourse(courseId);
      if (success) {
        await queryClient.invalidateQueries({ queryKey: ["courses"] });
      }
    }
  };

  return (
    <div className="grid gap-4">
      {courses?.map((course) => (
        <Card
          key={course.id}
          className="bg-[#1a1717] border-none text-white"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">
              {course.title}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(course)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(course.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <p className="text-sm text-gray-400">
                {course.description || "No description"}
              </p>
              <div className="flex gap-4 text-sm">
                <span>Instructor: {course.instructor}</span>
                <span>Duration: {course.duration} minutes</span>
                <span>Category: {course.categories?.name}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CourseList;