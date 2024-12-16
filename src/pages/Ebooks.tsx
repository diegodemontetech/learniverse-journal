import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import EbooksHeader from "@/components/ebooks/EbooksHeader";
import EbookFilters from "@/components/ebooks/EbookFilters";
import EbookGrid from "@/components/ebooks/EbookGrid";

type SortOption = "latest" | "rating" | "a-z";

const Ebooks = () => {
  const navigate = useNavigate();
  const { session } = useSessionContext();
  const { toast } = useToast();
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Check session on component mount
  useEffect(() => {
    if (!session) {
      toast({
        title: "Acesso negado",
        description: "Você precisa estar logado para acessar esta página.",
        variant: "destructive",
      });
      navigate("/auth");
    }
  }, [session, navigate, toast]);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*");
      if (error) {
        if (error.message.includes("JWT")) {
          toast({
            title: "Erro de sessão",
            description: "Sua sessão expirou. Por favor, faça login novamente.",
            variant: "destructive",
          });
          navigate("/auth");
          return [];
        }
        throw error;
      }
      return data;
    },
    enabled: !!session,
  });

  const { data: ebooks, isLoading } = useQuery({
    queryKey: ["ebooks", sortBy, selectedCategory],
    queryFn: async () => {
      if (!session) {
        navigate("/auth");
        return [];
      }

      let query = supabase
        .from("ebooks")
        .select("*, categories(name)");

      if (selectedCategory !== "all") {
        query = query.eq("category_id", selectedCategory);
      }

      switch (sortBy) {
        case "rating":
          query = query.order("title");
          break;
        case "a-z":
          query = query.order("title");
          break;
        default:
          query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;
      if (error) {
        if (error.message.includes("JWT")) {
          toast({
            title: "Erro de sessão",
            description: "Sua sessão expirou. Por favor, faça login novamente.",
            variant: "destructive",
          });
          navigate("/auth");
          return [];
        }
        throw error;
      }
      return data;
    },
    enabled: !!session,
  });

  return (
    <div className="min-h-screen p-8 bg-i2know-body">
      <EbooksHeader sortBy={sortBy} onSortChange={setSortBy} />
      <EbookFilters
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      <EbookGrid ebooks={ebooks} isLoading={isLoading} />
    </div>
  );
};

export default Ebooks;