import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NewsInteractions } from "./news-interactions/NewsInteractions";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface NewsViewProps {
  newsId: string;
}

const NewsView = ({ newsId }: NewsViewProps) => {
  const navigate = useNavigate();

  const { data: news } = useQuery({
    queryKey: ["news", newsId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select(`
          *,
          author:profiles(first_name, last_name)
        `)
        .eq("id", newsId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: relatedNews } = useQuery({
    queryKey: ["related-news", newsId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select(`
          id,
          title,
          thumbnail_url,
          created_at,
          views_count
        `)
        .neq("id", newsId)
        .order("views_count", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  if (!news) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Button
            variant="ghost"
            className="mb-4 text-gray-400 hover:text-white"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <div className="bg-i2know-card rounded-lg overflow-hidden">
            {news.main_image_url && (
              <img
                src={news.main_image_url}
                alt={news.title}
                className="w-full aspect-video object-cover"
              />
            )}
            
            <div className="p-6 space-y-4">
              <h1 className="text-2xl font-bold text-white">{news.title}</h1>
              
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center gap-4">
                  <span>
                    Por {news.author?.first_name} {news.author?.last_name}
                  </span>
                  <span>{format(new Date(news.created_at), "dd/MM/yyyy")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{news.views_count || 0} visualizações</span>
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="whitespace-pre-wrap">{news.content}</p>
              </div>

              {news.video_url && (
                <div className="aspect-video">
                  <iframe
                    src={news.video_url}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              )}
            </div>
          </div>

          <NewsInteractions newsId={newsId} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-i2know-card rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Mais Lidas</h2>
            <div className="space-y-4">
              {relatedNews?.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 cursor-pointer hover:bg-i2know-card/50 p-2 rounded-lg transition-colors"
                  onClick={() => navigate(`/news/${item.id}`)}
                >
                  {item.thumbnail_url && (
                    <img
                      src={item.thumbnail_url}
                      alt={item.title}
                      className="w-24 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-white font-medium line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                      <Eye className="w-3 h-3" />
                      <span>{item.views_count || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsView;