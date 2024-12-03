import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tables } from '@/integrations/supabase/types';
import Footer from '@/components/Footer';

type Category = Tables<'categories'>;
type Course = Tables<'courses'>;
type News = Tables<'news'> & {
  author: {
    first_name: string | null;
    last_name: string | null;
  } | null;
};

const Index = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

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

  const { data: latestNews } = useQuery({
    queryKey: ['latestNews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news')
        .select(`
          *,
          author:profiles(first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(4);
      
      if (error) throw error;
      return data as News[];
    },
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[450px] w-full overflow-hidden rounded-xl">
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
              <h1 className="text-4xl font-bold mb-4 max-w-2xl">
                {featuredCourse.title}
              </h1>

              {/* Course Description */}
              <p className="text-lg mb-6 max-w-2xl text-gray-200">
                {featuredCourse.description}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-6">
                <Button 
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 text-lg px-8"
                  onClick={() => navigate(`/courses/${featuredCourse.id}`)}
                >
                  Começar Agora
                </Button>
                <Button 
                  size="lg"
                  variant="secondary"
                  className="bg-gray-600/80 hover:bg-gray-700/80 text-white text-lg px-8"
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
              <p className="text-lg mb-6 max-w-2xl text-gray-200">
                Em breve, novos cursos estarão disponíveis aqui.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Category Filters */}
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

      {/* Latest Courses Grid */}
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

      {/* Latest News Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-white">Últimas Notícias</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestNews?.map((news) => (
            <div
              key={news.id}
              className="bg-i2know-card rounded-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
              onClick={() => navigate(`/news/${news.id}`)}
            >
              <div className="aspect-video relative">
                <img
                  src={news.thumbnail_url || '/placeholder.svg'}
                  alt={news.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-white mb-2 line-clamp-2">{news.title}</h3>
                <p className="text-sm text-gray-300 line-clamp-2">{news.content}</p>
                <div className="mt-2 text-xs text-gray-400">
                  {news.author?.first_name} {news.author?.last_name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;