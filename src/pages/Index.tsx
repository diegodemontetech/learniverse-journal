import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Tables } from '@/integrations/supabase/types';

type Category = Tables<'categories'>;
type Course = Tables<'courses'>;

const Index = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Fetch featured course
  const { data: featuredCourse } = useQuery({
    queryKey: ['featuredCourse'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_featured', true)
        .limit(1);
      
      if (error) throw error;
      return data?.[0] as Course | undefined;
    },
  });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      
      if (error) throw error;
      return data as Category[];
    },
  });

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative h-[600px] w-full overflow-hidden rounded-xl">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${featuredCourse?.thumbnail_url || '/placeholder.svg'})`,
          }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-end p-8 text-white">
          {featuredCourse ? (
            <>
              {/* Featured Tag */}
              <div className="inline-flex mb-4">
                <span className="bg-red-600 px-3 py-1 rounded-md text-sm font-medium">
                  Em Destaque
                </span>
              </div>

              {/* Course Title */}
              <h1 className="text-5xl font-bold mb-4 max-w-2xl">
                {featuredCourse.title}
              </h1>

              {/* Course Description */}
              <p className="text-lg mb-8 max-w-2xl text-gray-200">
                {featuredCourse.description}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-8">
                <Button 
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 text-lg px-12 py-6 h-auto"
                  onClick={() => navigate(`/courses/${featuredCourse.id}`)}
                >
                  Começar Agora
                </Button>
                <Button 
                  size="lg"
                  variant="secondary"
                  className="bg-gray-600/80 hover:bg-gray-700/80 text-white text-lg px-12 py-6 h-auto"
                  onClick={() => navigate(`/courses/${featuredCourse.id}/details`)}
                >
                  Mais Informações
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <h1 className="text-4xl font-bold mb-4">
                Bem-vindo ao i2know
              </h1>
              <p className="text-lg mb-8 max-w-2xl text-gray-200">
                Em breve, novos cursos estarão disponíveis aqui.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-3 mt-8 overflow-x-auto pb-4">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'secondary'}
          className={`rounded-full px-12 py-2.5 h-10 flex items-center justify-center ${
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
            className={`rounded-full px-12 py-2.5 h-10 flex items-center justify-center ${
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
    </Layout>
  );
};

export default Index;