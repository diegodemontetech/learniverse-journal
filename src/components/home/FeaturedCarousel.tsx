import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Course } from "@/types/course";
import { useIsMobile } from "@/hooks/use-mobile";

interface FeaturedCarouselProps {
  courses: Course[];
}

const FeaturedCarousel = ({ courses }: FeaturedCarouselProps) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!courses?.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % courses.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [courses]);

  if (!courses?.length) return null;

  const handlePrevious = () => {
    setCurrentIndex((current) => 
      current === 0 ? courses.length - 1 : current - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((current) => 
      (current + 1) % courses.length
    );
  };

  const currentCourse = courses[currentIndex];

  return (
    <div className="relative w-full overflow-hidden rounded-xl" style={{ 
      aspectRatio: isMobile ? '16/13' : '16/9' 
    }}>
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500"
        style={{
          backgroundImage: `url(${currentCourse.thumbnail_url || '/placeholder.svg'})`,
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-8 text-white">
        {/* Featured Tag */}
        <div className="inline-flex mb-4">
          <span className="bg-red-600 px-3 py-1 rounded-md text-sm font-medium">
            Em Destaque
          </span>
        </div>

        {/* Course Title */}
        <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold mb-4 max-w-2xl`}>
          {currentCourse.title}
        </h1>

        {/* Course Description */}
        <p className={`${isMobile ? 'text-base' : 'text-lg'} mb-6 max-w-2xl text-gray-200`}>
          {currentCourse.description}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <Button 
            size={isMobile ? "default" : "lg"}
            className="bg-red-600 hover:bg-red-700 px-4"
            onClick={() => navigate(`/courses/${currentCourse.id}`)}
          >
            Começar Agora
          </Button>
          <Button 
            size={isMobile ? "default" : "lg"}
            variant="secondary"
            className="bg-gray-600/80 hover:bg-gray-700/80 text-white px-4"
            onClick={() => navigate(`/courses/${currentCourse.id}/details`)}
          >
            Mais Informações
          </Button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <Button
        variant="ghost"
        size="icon"
        className={`absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white ${
          isMobile ? 'h-8 w-8' : 'h-10 w-10'
        }`}
        onClick={handlePrevious}
      >
        <ChevronLeft className={isMobile ? "h-6 w-6" : "h-8 w-8"} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white ${
          isMobile ? 'h-8 w-8' : 'h-10 w-10'
        }`}
        onClick={handleNext}
      >
        <ChevronRight className={isMobile ? "h-6 w-6" : "h-8 w-8"} />
      </Button>
    </div>
  );
};

export default FeaturedCarousel;