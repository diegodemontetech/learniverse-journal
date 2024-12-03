import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const NewsSection = () => {
  const navigate = useNavigate();

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
      return data;
    },
  });

  if (!latestNews?.length) return null;

  return (
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
  );
};

export default NewsSection;