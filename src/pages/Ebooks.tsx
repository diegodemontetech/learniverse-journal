import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { Book, FileText, Star, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type SortOption = "latest" | "rating" | "a-z";

const Ebooks = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<SortOption>("latest");

  const { data: ebooks, isLoading } = useQuery({
    queryKey: ["ebooks", sortBy],
    queryFn: async () => {
      let query = supabase
        .from("ebooks")
        .select("*, categories(name)");

      switch (sortBy) {
        case "rating":
          // In a real app, you'd have a ratings column
          query = query.order("title");
          break;
        case "a-z":
          query = query.order("title");
          break;
        default:
          query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

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
    <div className="min-h-screen p-8 bg-i2know-body">
      {/* Header with Sort Options */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">E-books</h1>
          <p className="text-i2know-text-secondary">
            Explore nossa biblioteca digital e expanda seu conhecimento
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-i2know-text-secondary">Sort by:</span>
            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as SortOption)}
            >
              <SelectTrigger className="w-[180px] bg-[#2C2C2C] border-none text-white rounded-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-[#2C2C2C] border-none">
                <SelectItem value="latest" className="text-white">Latest</SelectItem>
                <SelectItem value="rating" className="text-white">Rating</SelectItem>
                <SelectItem value="a-z" className="text-white">A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Ebooks Grid */}
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
                    <div className="flex items-center gap-2 text-yellow-400 mb-2">
                      <Star className="w-4 h-4" />
                      <span className="text-sm">8.5</span>
                    </div>
                    <div className="flex items-center gap-2 text-i2know-text-secondary text-sm">
                      <Eye className="w-4 h-4" />
                      <span>1.5k reads</span>
                    </div>
                  </div>
                </div>
                <h3 className="text-white font-semibold mb-1 group-hover:text-i2know-accent transition-colors">
                  {ebook.title}
                </h3>
                <div className="flex items-center justify-between text-i2know-text-secondary text-sm">
                  <div className="flex items-center gap-1">
                    <Book className="w-3 h-3" />
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
    </div>
  );
};

export default Ebooks;