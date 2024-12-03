import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Course } from "@/types/course";

const LatestCoursesSection = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      
      if (error) throw error;
      return data;
    },
  });

  const { data: latestCourses } = useQuery({
    queryKey: ['latestCourses', selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedCategory !== 'all') {
        query = query.eq('category_id', selectedCategory);
      }

      const { data, error } = await query.limit(4);
      
      if (error) throw error;
      return data as Course[];
    },
  });

  return (
    <>
      <div className="mt-12 mb-6">
        <h2 className="text-2xl font-bold mb-6 text-white">Lançamentos</h2>
        <div className="flex items-center gap-3 overflow-x-auto pb-4">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'secondary'}
            className={`rounded-full px-8 flex items-center justify-center ${
              selectedCategory === 'all' 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-[#2C2C2C] text-white hover:bg-[#3C3C3C]'
            }`}
            onClick={() => setSelectedCategory('all')}
          >
            Todos
          </Button>
          {categories?.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'secondary'}
              className={`rounded-full px-8 flex items-center justify-center ${
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
      </div>

      {latestCourses && latestCourses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {latestCourses.map((course) => (
            <div 
              key={course.id}
              className="bg-i2know-card rounded-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
              onClick={() => navigate(`/courses/${course.id}`)}
            >
              <div className="aspect-video relative">
                <img 
                  src={course.thumbnail_url || '/placeholder.svg'} 
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-white mb-2">{course.title}</h3>
                <p className="text-sm text-gray-300">{course.instructor}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default LatestCoursesSection;