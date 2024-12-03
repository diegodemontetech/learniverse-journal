import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Clock, Tv, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

type SortOption = "latest" | "rating" | "a-z";

const Courses = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

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
    queryKey: ["courses", sortBy, selectedCategory],
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

      switch (sortBy) {
        case "rating":
          query = query.order("title");
          break;
        case "a-z":
          query = query.order("title");
          break;
        default:
          query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const handleCourseClick = async (courseId: string) => {
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
  };

  const renderSkeleton = () => (
    <>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="relative aspect-[2/3] rounded-lg overflow-hidden">
          <Skeleton className="w-full h-full" />
        </div>
      ))}
    </>
  );

  return (
    <div className="min-h-screen p-8 bg-i2know-body">
      {/* Header with Sort Options */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Cursos</h1>
          <p className="text-i2know-text-secondary">
            Explore nossa coleção de cursos e comece sua jornada
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-i2know-text-secondary">Sort by:</span>
            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as SortOption)}
            >
              <SelectTrigger className="w-[180px] bg-[#2C2C2C] border-none text-white rounded-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-[#2C2C2C] border-none">
                <SelectItem value="latest" className="text-white">Latest</SelectItem>
                <SelectItem value="rating" className="text-white">Rating</SelectItem>
                <SelectItem value="a-z" className="text-white">A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Category Filters - Netflix Style */}
      <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-4">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'secondary'}
          className={`rounded-full px-12 py-2.5 h-10 flex items-center justify-center whitespace-nowrap ${
            selectedCategory === 'all' 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-[#2C2C2C] text-white hover:bg-[#3C3C3C]'
          }`}
          onClick={() => setSelectedCategory('all')}
        >
          All Courses
        </Button>
        {categories?.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'secondary'}
            className={`rounded-full px-12 py-2.5 h-10 flex items-center justify-center whitespace-nowrap ${
              selectedCategory === category.id 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-[#2C2C2C] text-white hover:bg-[#3C3C3C]'
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {isLoading
          ? renderSkeleton()
          : courses?.map((course) => (
              <div
                key={course.id}
                className="group cursor-pointer"
                onClick={() => handleCourseClick(course.id)}
              >
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-3">
                  <img
                    src={course.thumbnail_url || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    {course.user_progress?.[0]?.progress_percentage > 0 && (
                      <div className="mb-2">
                        <div className="h-1 bg-gray-700 rounded-full">
                          <div
                            className="h-full bg-red-600 rounded-full"
                            style={{
                              width: `${course.user_progress[0].progress_percentage}%`
                            }}
                          />
                        </div>
                        <p className="text-xs text-white mt-1">
                          {course.user_progress[0].progress_percentage}% complete
                        </p>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-white">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">Watch now</span>
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
            ))}
      </div>
    </div>
  );
};

export default Courses;