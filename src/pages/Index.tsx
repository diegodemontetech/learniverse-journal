import { useEffect } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Play, Star } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Course {
  id: string;
  title: string;
  instructor: string;
  description: string;
  thumbnail_url: string;
  is_featured: boolean;
  duration?: number;
}

const fetchFeaturedCourse = async () => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('is_featured', true)
    .limit(1);

  if (error) throw error;
  return data?.[0] || null;
};

const fetchLatestCourses = async () => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(8);

  if (error) throw error;
  return data;
};

const FeaturedCourse = ({ course }: { course: Course }) => (
  <div className="relative h-[85vh] w-full overflow-hidden rounded-3xl mb-16">
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
    <img
      src={course.thumbnail_url || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"}
      alt={course.title}
      className="absolute inset-0 w-full h-full object-cover transform scale-105 hover:scale-100 transition-transform duration-700"
    />
    <div className="relative z-20 h-full flex flex-col justify-end p-16">
      <Badge className="w-fit mb-6 bg-i2know-accent text-white hover:bg-i2know-accent/90 text-sm">FEATURED</Badge>
      <h1 className="text-8xl font-bold mb-6 max-w-3xl leading-tight">{course.title}</h1>
      <div className="flex items-center gap-6 mb-8">
        <div className="flex items-center">
          <Star className="w-5 h-5 text-yellow-400 mr-2" />
          <span className="text-lg">4.8</span>
        </div>
        <span className="text-lg">{course.duration || 120} min</span>
      </div>
      <p className="text-xl text-i2know-text-secondary max-w-2xl mb-10">
        {course.description}
      </p>
      <button className="flex items-center gap-3 bg-i2know-accent text-white px-10 py-5 rounded-xl hover:bg-opacity-80 transition-colors w-fit text-lg">
        <Play className="w-6 h-6" />
        Start Learning
      </button>
    </div>
  </div>
);

const CourseCard = ({ title, instructor, thumbnail_url }: Course) => (
  <div className="group cursor-pointer">
    <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
      <img
        src={thumbnail_url || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6"}
        alt={title}
        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button className="bg-i2know-accent text-white p-4 rounded-full hover:bg-opacity-90 transform hover:scale-110 transition-all duration-300">
          <Play className="w-6 h-6" />
        </button>
      </div>
    </div>
    <h3 className="font-bold text-lg mb-2 group-hover:text-i2know-accent transition-colors">{title}</h3>
    <p className="text-i2know-text-secondary text-sm">{instructor}</p>
  </div>
);

const Index = () => {
  const { data: featuredCourse, isLoading: isFeaturedLoading } = useQuery({
    queryKey: ['featuredCourse'],
    queryFn: fetchFeaturedCourse,
  });

  const { data: latestCourses, isLoading: isLatestLoading } = useQuery({
    queryKey: ['latestCourses'],
    queryFn: fetchLatestCourses,
  });

  if (isFeaturedLoading || isLatestLoading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-8">
          <div className="h-[85vh] bg-i2know-card rounded-3xl" />
          <div className="space-y-4">
            <div className="h-8 bg-i2know-card rounded w-64" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-video bg-i2know-card rounded-xl" />
                  <div className="h-4 bg-i2know-card rounded w-3/4" />
                  <div className="h-3 bg-i2know-card rounded w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {featuredCourse && <FeaturedCourse course={featuredCourse} />}
      
      <section className="space-y-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Continue Watching</h2>
          <select className="bg-transparent border border-gray-700 rounded-full px-4 py-2 text-sm">
            <option value="popular">Popular</option>
            <option value="newest">Newest</option>
            <option value="trending">Trending</option>
          </select>
        </div>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {latestCourses?.map((course) => (
              <CarouselItem key={course.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/4">
                <CourseCard {...course} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>
    </Layout>
  );
};

export default Index;