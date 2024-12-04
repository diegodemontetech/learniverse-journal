import { Button } from "@/components/ui/button";
import { Category } from "@/types/course";
import { Sparkles, Timer, Trophy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CourseFiltersProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

const CourseFilters = ({
  selectedCategory,
  setSelectedCategory,
  statusFilter,
  setStatusFilter,
}: CourseFiltersProps) => {
  const { data: categoriesWithCourses } = useQuery({
    queryKey: ["categories-with-courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select(`
          id,
          name,
          courses:courses(count)
        `)
        .order('name');
      
      if (error) throw error;
      
      // Filter categories that have at least one course
      return data.filter(category => category.courses.length > 0);
    },
  });

  return (
    <div className="space-y-6">
      {/* Category filters with horizontal scroll */}
      <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-4 scrollbar-none">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'secondary'}
          className={`rounded-full px-6 sm:px-12 py-2.5 h-10 flex items-center justify-center whitespace-nowrap min-w-fit ${
            selectedCategory === 'all' 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-[#2C2C2C] text-white hover:bg-[#3C3C3C]'
          }`}
          onClick={() => setSelectedCategory('all')}
        >
          Todos os Cursos
        </Button>
        {categoriesWithCourses?.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'secondary'}
            className={`rounded-full px-6 sm:px-12 py-2.5 h-10 flex items-center justify-center whitespace-nowrap min-w-fit ${
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

      {/* Status filters with better mobile layout */}
      <div className="flex items-center gap-2 sm:gap-3 mb-8 overflow-x-auto pb-4 scrollbar-none">
        <Button
          variant={statusFilter === 'all' ? 'default' : 'secondary'}
          className={`rounded-full px-4 sm:px-6 py-2 h-9 flex items-center gap-1 sm:gap-2 min-w-fit ${
            statusFilter === 'all' 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-[#2C2C2C] text-white hover:bg-[#3C3C3C]'
          }`}
          onClick={() => setStatusFilter('all')}
        >
          Todos
        </Button>
        <Button
          variant={statusFilter === 'new' ? 'default' : 'secondary'}
          className={`rounded-full px-4 sm:px-6 py-2 h-9 flex items-center gap-1 sm:gap-2 min-w-fit ${
            statusFilter === 'new' 
              ? 'bg-blue-500 hover:bg-blue-600' 
              : 'bg-[#2C2C2C] text-white hover:bg-[#3C3C3C]'
          }`}
          onClick={() => setStatusFilter('new')}
        >
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="whitespace-nowrap">Novos</span>
        </Button>
        <Button
          variant={statusFilter === 'in_progress' ? 'default' : 'secondary'}
          className={`rounded-full px-4 sm:px-6 py-2 h-9 flex items-center gap-1 sm:gap-2 min-w-fit ${
            statusFilter === 'in_progress' 
              ? 'bg-yellow-500 hover:bg-yellow-600' 
              : 'bg-[#2C2C2C] text-white hover:bg-[#3C3C3C]'
          }`}
          onClick={() => setStatusFilter('in_progress')}
        >
          <Timer className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="whitespace-nowrap">Em Andamento</span>
        </Button>
        <Button
          variant={statusFilter === 'completed' ? 'default' : 'secondary'}
          className={`rounded-full px-4 sm:px-6 py-2 h-9 flex items-center gap-1 sm:gap-2 min-w-fit ${
            statusFilter === 'completed' 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-[#2C2C2C] text-white hover:bg-[#3C3C3C]'
          }`}
          onClick={() => setStatusFilter('completed')}
        >
          <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="whitespace-nowrap">Concluídos</span>
        </Button>
      </div>
    </div>
  );
};

export default CourseFilters;