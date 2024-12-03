import Footer from "@/components/Footer";
import FeaturedSection from "@/components/home/FeaturedSection";
import LatestCoursesSection from "@/components/home/LatestCoursesSection";
import NewsSection from "@/components/home/NewsSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <FeaturedSection />
      <LatestCoursesSection />
      <NewsSection />
      <Footer />
    </div>
  );
};

export default Index;