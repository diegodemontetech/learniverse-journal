import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Clock, BookOpen } from "lucide-react";

const Courses = () => {
  const navigate = useNavigate();

  const { data: courses, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*, categories(name)");
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-white">Carregando cursos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">Cursos</h1>
        <p className="text-i2know-text-secondary text-lg">
          Explore nossa coleção de cursos e comece sua jornada de aprendizado
        </p>
      </div>

      {/* Filters Section */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
        <Button
          variant="secondary"
          className="bg-i2know-card hover:bg-i2know-accent text-white whitespace-nowrap"
        >
          Todos os Cursos
        </Button>
        <Button
          variant="secondary"
          className="bg-i2know-card hover:bg-i2know-accent text-white whitespace-nowrap"
        >
          Mais Populares
        </Button>
        <Button
          variant="secondary"
          className="bg-i2know-card hover:bg-i2know-accent text-white whitespace-nowrap"
        >
          Recém Adicionados
        </Button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses?.map((course) => (
          <Card
            key={course.id}
            className="bg-i2know-card border-none hover:scale-105 transition-transform duration-300 cursor-pointer"
            onClick={() => navigate(`/courses/${course.id}`)}
          >
            <div className="relative aspect-video">
              <img
                src={course.thumbnail_url || "/placeholder.svg"}
                alt={course.title}
                className="w-full h-full object-cover rounded-t-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-xs text-i2know-text-secondary">
                  {course.categories?.name}
                </p>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                {course.title}
              </h3>
              <p className="text-i2know-text-secondary text-sm mb-4 line-clamp-2">
                {course.description}
              </p>
              <div className="flex items-center justify-between text-i2know-text-secondary text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration || 0} min</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>{course.instructor}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Courses;