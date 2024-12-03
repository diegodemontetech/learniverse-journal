import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import CourseFilters from "@/components/course/CourseFilters";
import CourseGrid from "@/components/course/CourseGrid";
import { Course } from "@/types/course";

type SortOption = "latest" | "rating" | "a-z";
type StatusFilter = "all" | "new" | "in_progress" | "completed";

const Courses = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: courses, isLoading } = useQuery({
    queryKey: ["courses", selectedCategory, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("courses")
        .select(`
          *,
          categories(name),
          lessons(count),
          user_progress(progress_percentage)
        `);

      if (selectedCategory !== "all") {
        query = query.eq("category_id", selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;

      const processedCourses = data.map((course: Course) => {
        const progress = course.user_progress?.[0]?.progress_percentage || 0;
        const isNew = new Date(course.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        
        let status = null;
        if (progress === 100) status = 'completed';
        else if (progress > 0) status = 'in_progress';
        else if (isNew) status = 'new';

        return { ...course, status };
      });

      if (statusFilter !== "all") {
        return processedCourses.filter((course) => course.status === statusFilter);
      }

      return processedCourses;
    },
  });

  const handleCourseClick = async (courseId: string) => {
    try {
      // Check if user has existing progress
      const { data: progress } = await supabase
        .from("user_progress")
        .select("*")
        .eq("course_id", courseId)
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!progress) {
        // Create initial progress record
        const { error } = await supabase
          .from("user_progress")
          .insert({
            course_id: courseId,
            user_id: (await supabase.auth.getUser()).data.user?.id,
            progress_percentage: 0
          });

        if (error) {
          toast({
            title: "Error",
            description: "Could not start course. Please try again.",
            variant: "destructive",
          });
          return;
        }
      }

      navigate(`/courses/${courseId}`);
    } catch (error) {
      console.error("Error handling course click:", error);
      toast({
        title: "Error",
        description: "Could not start course. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen p-8 bg-i2know-body">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Cursos</h1>
        <p className="text-i2know-text-secondary">
          Explore nossa coleção de cursos e comece sua jornada
        </p>
      </div>

      <CourseFilters
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter as (status: StatusFilter) => void}
      />

      <CourseGrid
        courses={courses}
        isLoading={isLoading}
        onCourseClick={handleCourseClick}
      />
    </div>
  );
};

export default Courses;