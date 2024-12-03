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

  if (!latestNews?.length) {
    // Insert sample news articles if none exist
    const insertSampleNews = async () => {
      const { data: authorData } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

      const authorId = authorData?.[0]?.id;

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