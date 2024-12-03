import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import FeaturedCarousel from "./FeaturedCarousel";
import { Course } from "@/types/course";

const FeaturedSection = () => {
  const { data: featuredCourses } = useQuery({
    queryKey: ["featuredCourses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("is_featured", true)
        .order("updated_at", { ascending: false });
      
      if (error) throw error;
      return data as Course[];
    },
  });

  return <FeaturedCarousel courses={featuredCourses || []} />;
};

export default FeaturedSection;