import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Bookmark, User, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  thumbnail_url: string;
  created_at: string;
  author: {
    first_name: string;
    last_name: string;
  };
}

const NewsCard = ({ article }: { article: NewsArticle }) => (
  <Card className="bg-i2know-card hover:bg-i2know-card/90 transition-colors overflow-hidden group">
    <div className="relative aspect-video overflow-hidden">
      <img
        src={article.thumbnail_url}
        alt={article.title}
        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
      />
    </div>
    <CardHeader className="space-y-2">
      <h3 className="text-base sm:text-lg font-bold text-i2know-text-primary line-clamp-2">
        {article.title}
      </h3>
      <p className="text-sm sm:text-base text-i2know-text-secondary line-clamp-2">
        {article.content}
      </p>
    </CardHeader>
    <CardFooter className="flex flex-wrap gap-2 sm:gap-4 text-i2know-text-secondary text-xs sm:text-sm">
      <div className="flex items-center gap-1 sm:gap-2">
        <User className="w-3 h-3 sm:w-4 sm:h-4" />
        <span>{article.author?.first_name || "Anônimo"}</span>
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
        <span>{format(new Date(article.created_at), "dd/MM/yyyy")}</span>
      </div>
      <button className="text-i2know-text-secondary hover:text-i2know-accent transition-colors ml-auto">
        <Bookmark className="w-3 h-3 sm:w-4 sm:h-4" />
      </button>
    </CardFooter>
  </Card>
);

const NewsCardSkeleton = () => (
  <Card className="bg-i2know-card overflow-hidden">
    <Skeleton className="aspect-video w-full" />
    <CardHeader className="space-y-2">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
    </CardHeader>
    <CardFooter className="flex items-center justify-between">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-4" />
    </CardFooter>
  </Card>
);

const News = () => {
  const { data: news, isLoading } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select(`
          *,
          author:profiles(first_name, last_name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as NewsArticle[];
    },
  });

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-i2know-text-primary">
          Últimas Notícias
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[...Array(6)].map((_, i) => (
            <NewsCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-i2know-text-primary">
        Últimas Notícias
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {news?.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};

export default News;