import { Button } from "@/components/ui/button";
import { Category } from "@/types/course";
import { Sparkles, Timer, Trophy } from "lucide-react";

interface CourseFiltersProps {
  categories?: Category[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

const CourseFilters = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  statusFilter,
  setStatusFilter,
}: CourseFiltersProps) => {
  return (
    <div className="space-y-6">
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
          Todos os Cursos
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

      <div className="flex items-center gap-3 mb-8">
        <Button
          variant={statusFilter === 'all' ? 'default' : 'secondary'}
          className={`rounded-full px-6 py-2 h-9 flex items-center gap-2 ${
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
          className={`rounded-full px-6 py-2 h-9 flex items-center gap-2 ${
            statusFilter === 'new' 
              ? 'bg-blue-500 hover:bg-blue-600' 
              : 'bg-[#2C2C2C] text-white hover:bg-[#3C3C3C]'
          }`}
          onClick={() => setStatusFilter('new')}
        >
          <Sparkles className="w-4 h-4" />
          Novos
        </Button>
        <Button
          variant={statusFilter === 'in_progress' ? 'default' : 'secondary'}
          className={`rounded-full px-6 py-2 h-9 flex items-center gap-2 ${
            statusFilter === 'in_progress' 
              ? 'bg-yellow-500 hover:bg-yellow-600' 
              : 'bg-[#2C2C2C] text-white hover:bg-[#3C3C3C]'
          }`}
          onClick={() => setStatusFilter('in_progress')}
        >
          <Timer className="w-4 h-4" />
          Em Andamento
        </Button>
        <Button
          variant={statusFilter === 'completed' ? 'default' : 'secondary'}
          className={`rounded-full px-6 py-2 h-9 flex items-center gap-2 ${
            statusFilter === 'completed' 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-[#2C2C2C] text-white hover:bg-[#3C3C3C]'
          }`}
          onClick={() => setStatusFilter('completed')}
        >
          <Trophy className="w-4 h-4" />
          Concluídos
        </Button>
      </div>
    </div>
  );
};

export default CourseFilters;