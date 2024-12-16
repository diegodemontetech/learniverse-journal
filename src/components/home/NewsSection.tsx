import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from "@supabase/auth-helpers-react";

const NewsSection = () => {
  const navigate = useNavigate();
  const { session } = useSessionContext();

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
    enabled: !!session, // Only run query when session exists
  });

  if (!latestNews?.length) {
    // Insert sample news articles if none exist
    const insertSampleNews = async () => {
      if (!session?.user?.id) return; // Don't insert if no user is logged in

      const { data: authorData } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', session.user.id)
        .single();

      const authorId = authorData?.id;
      if (!authorId) return;

      const sampleNews = [
        {
          title: "Inovação na Pecuária: Sistema VPJ Revoluciona Produção Animal",
          content: "Nova abordagem integrada de criação de Vitelos, Porcos e Javalis está transformando o cenário da pecuária brasileira. Produtores relatam aumento de 40% na eficiência produtiva.",
          thumbnail_url: "https://images.unsplash.com/photo-1465379944081-7f47de8d74ac",
          main_image_url: "https://images.unsplash.com/photo-1465379944081-7f47de8d74ac",
          video_url: "https://www.youtube.com/watch?v=example1",
          is_featured: true,
          layout_position: "featured",
          author_id: authorId,
        },
        {
          title: "Sustentabilidade na Criação de Javalis: Um Novo Paradigma",
          content: "Criadores de javalis implementam práticas sustentáveis que reduzem em 30% o impacto ambiental, mantendo a qualidade da carne. Conheça as técnicas revolucionárias.",
          thumbnail_url: "https://images.unsplash.com/photo-1493962853295-0fd70327578a",
          main_image_url: "https://images.unsplash.com/photo-1493962853295-0fd70327578a",
          is_featured: false,
          layout_position: "most_read",
          author_id: authorId,
        },
        {
          title: "Vitelos Premium: Brasil se Destaca no Mercado Internacional",
          content: "Produção de vitelos de alta qualidade coloca o Brasil em posição de destaque no mercado global. Exportações crescem 25% no último trimestre.",
          thumbnail_url: "https://images.unsplash.com/photo-1517022812141-23620dba5c23",
          main_image_url: "https://images.unsplash.com/photo-1517022812141-23620dba5c23",
          video_url: "https://www.youtube.com/watch?v=example2",
          is_featured: false,
          layout_position: "regular",
          author_id: authorId,
        },
        {
          title: "Tecnologia e Bem-estar Animal na Suinocultura Moderna",
          content: "Novas tecnologias de monitoramento e automação estão revolucionando o bem-estar dos suínos. Produtores registram melhoria significativa na qualidade da produção.",
          thumbnail_url: "https://images.unsplash.com/photo-1452960962994-acf4fd70b632",
          main_image_url: "https://images.unsplash.com/photo-1452960962994-acf4fd70b632",
          is_featured: false,
          layout_position: "regular",
          author_id: authorId,
        }
      ];

      await supabase.from('news').insert(sampleNews);
    };

    insertSampleNews();
    return null;
  }

  const featuredNews = latestNews.find(news => news.layout_position === 'featured');
  const mostReadNews = latestNews.find(news => news.layout_position === 'most_read');
  const regularNews = latestNews.filter(news => news.layout_position === 'regular');

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-white">Últimas Notícias</h2>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {featuredNews && (
          <div 
            className="lg:col-span-2 lg:row-span-2 bg-i2know-card rounded-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
            onClick={() => navigate(`/news/${featuredNews.id}`)}
          >
            <div className="aspect-video relative">
              <img
                src={featuredNews.main_image_url || featuredNews.thumbnail_url || '/placeholder.svg'}
                alt={featuredNews.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-white mb-2 text-xl">{featuredNews.title}</h3>
              <p className="text-gray-300 mb-4">{featuredNews.content}</p>
              <div className="text-sm text-gray-400">
                {featuredNews.author?.first_name} {featuredNews.author?.last_name}
              </div>
            </div>
          </div>
        )}

        {mostReadNews && (
          <div 
            className="lg:col-span-2 bg-i2know-card rounded-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
            onClick={() => navigate(`/news/${mostReadNews.id}`)}
          >
            <div className="aspect-video relative">
              <img
                src={mostReadNews.thumbnail_url || '/placeholder.svg'}
                alt={mostReadNews.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-white mb-2">{mostReadNews.title}</h3>
              <p className="text-sm text-gray-300 line-clamp-2">{mostReadNews.content}</p>
              <div className="mt-2 text-xs text-gray-400">
                {mostReadNews.author?.first_name} {mostReadNews.author?.last_name}
              </div>
            </div>
          </div>
        )}

        {regularNews.map((news) => (
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