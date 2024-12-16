import { useNavigate } from "react-router-dom";
import { BookOpen, FileText, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Ebook {
  id: string;
  title: string;
  author: string;
  thumbnail_url: string;
  total_pages: number;
  categories: {
    name: string;
  };
}

interface EbookGridProps {
  ebooks?: Ebook[];
  isLoading: boolean;
}

const EbookGrid = ({ ebooks, isLoading }: EbookGridProps) => {
  const navigate = useNavigate();

  const renderSkeleton = () => (
    <>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="relative aspect-[2/3] rounded-lg overflow-hidden">
          <Skeleton className="w-full h-full" />
        </div>
      ))}
    </>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
      {isLoading
        ? renderSkeleton()
        : ebooks?.map((ebook) => (
            <div
              key={ebook.id}
              className="group cursor-pointer"
              onClick={() => navigate(`/ebooks/${ebook.id}`)}
            >
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-3">
                <img
                  src={ebook.thumbnail_url || "/placeholder.svg"}
                  alt={ebook.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2 text-[#39FF14] mb-2">
                    <Eye className="w-5 h-5 animate-pulse" />
                    <span className="text-sm">Read now</span>
                  </div>
                </div>
              </div>
              <h3 className="text-white font-semibold mb-1 group-hover:text-i2know-accent transition-colors">
                {ebook.title}
              </h3>
              <div className="flex items-center justify-between text-i2know-text-secondary text-sm">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  <span>{ebook.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  <span>{ebook.total_pages} pages</span>
                </div>
              </div>
            </div>
          ))}
    </div>
  );
};

export default EbookGrid;