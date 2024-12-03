import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';

interface Course {
  id: string;
  title: string;
  instructor: string;
  description: string;
  thumbnail_url: string;
  is_featured: boolean;
}

const fetchFeaturedCourse = async () => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('is_featured', true)
    .single();

  if (error) throw error;
  return data;
};

const fetchLatestCourses = async () => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(4);

  if (error) throw error;
  return data;
};

const FeaturedCourse = ({ course }: { course: Course }) => (
  <div className="relative h-[70vh] w-full rounded-xl overflow-hidden mb-12">
    <img
      src={course.thumbnail_url || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"}
      alt={course.title}
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-i2know-body via-transparent to-transparent" />
    <div className="absolute bottom-0 left-0 p-8">
      <span className="text-i2know-accent font-bold mb-2 inline-block">FEATURED COURSE</span>
      <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
      <p className="text-i2know-text-secondary max-w-2xl mb-6">
        {course.description}
      </p>
      <button className="bg-i2know-accent text-white px-6 py-3 rounded-lg hover:bg-opacity-80 transition-colors">
        Start Learning
      </button>
    </div>
  </div>
);

const CourseCard = ({ title, instructor, thumbnail_url }: Course) => (
  <div className="group cursor-pointer">
    <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
      <img
        src={thumbnail_url || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6"}
        alt={title}
        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity" />
    </div>
    <h3 className="font-bold mb-1">{title}</h3>
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
        <div className="animate-pulse">
          <div className="h-[70vh] bg-i2know-card rounded-xl mb-12" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-video bg-i2know-card rounded-lg" />
                <div className="h-4 bg-i2know-card rounded w-3/4" />
                <div className="h-3 bg-i2know-card rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {featuredCourse && <FeaturedCourse course={featuredCourse} />}
      
      <section>
        <h2 className="text-2xl font-bold mb-6">Latest Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestCourses?.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Index;