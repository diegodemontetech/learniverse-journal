import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Book, FileText } from "lucide-react";

const Ebooks = () => {
  const navigate = useNavigate();

  const { data: ebooks, isLoading } = useQuery({
    queryKey: ["ebooks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ebooks")
        .select("*, categories(name)");
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-white">Carregando e-books...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">E-books</h1>
        <p className="text-i2know-text-secondary text-lg">
          Explore nossa biblioteca digital e expanda seu conhecimento
        </p>
      </div>

      {/* Filters Section */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
        <Button
          variant="secondary"
          className="bg-i2know-card hover:bg-i2know-accent text-white whitespace-nowrap"
        >
          Todos os E-books
        </Button>
        <Button
          variant="secondary"
          className="bg-i2know-card hover:bg-i2know-accent text-white whitespace-nowrap"
        >
          Mais Lidos
        </Button>
        <Button
          variant="secondary"
          className="bg-i2know-card hover:bg-i2know-accent text-white whitespace-nowrap"
        >
          Recém Adicionados
        </Button>
      </div>

      {/* Ebooks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {ebooks?.map((ebook) => (
          <Card
            key={ebook.id}
            className="bg-i2know-card border-none hover:scale-105 transition-transform duration-300 cursor-pointer"
            onClick={() => navigate(`/ebooks/${ebook.id}`)}
          >
            <div className="relative aspect-[3/4]">
              <img
                src={ebook.thumbnail_url || "/placeholder.svg"}
                alt={ebook.title}
                className="w-full h-full object-cover rounded-t-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-xs text-i2know-text-secondary">
                  {ebook.categories?.name}
                </p>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                {ebook.title}
              </h3>
              <p className="text-i2know-text-secondary text-sm mb-4 line-clamp-2">
                {ebook.description}
              </p>
              <div className="flex items-center justify-between text-i2know-text-secondary text-sm">
                <div className="flex items-center gap-2">
                  <Book className="w-4 h-4" />
                  <span>{ebook.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>{ebook.total_pages} páginas</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Ebooks;