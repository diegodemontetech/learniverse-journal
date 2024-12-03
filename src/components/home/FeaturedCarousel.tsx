import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Course } from "@/types/course";

interface FeaturedCarouselProps {
  courses: Course[];
}

const FeaturedCarousel = ({ courses }: FeaturedCarouselProps) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

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
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
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
        <h1 className="text-4xl font-bold mb-4 max-w-2xl">
          {currentCourse.title}
        </h1>

        {/* Course Description */}
        <p className="text-lg mb-6 max-w-2xl text-gray-200">
          {currentCourse.description}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <Button 
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-lg px-8"
            onClick={() => navigate(`/courses/${currentCourse.id}`)}
          >
            Começar Agora
          </Button>
          <Button 
            size="lg"
            variant="secondary"
            className="bg-gray-600/80 hover:bg-gray-700/80 text-white text-lg px-8"
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
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
        onClick={handlePrevious}
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
        onClick={handleNext}
      >
        <ChevronRight className="h-8 w-8" />
      </Button>
    </div>
  );
};

export default FeaturedCarousel;