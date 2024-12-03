import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface LessonRatingProps {
  lessonId: string;
}

export const LessonRating = ({ lessonId }: LessonRatingProps) => {
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [totalRatings, setTotalRatings] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    loadRatings();
  }, [lessonId]);

  const loadRatings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user's rating
      const { data: userRating } = await supabase
        .from('lesson_ratings')
        .select('rating')
        .eq('lesson_id', lessonId)
        .eq('user_id', user.id)
        .single();

      if (userRating) {
        setRating(userRating.rating);
      }

      // Get total ratings and average
      const { data: ratings } = await supabase
        .from('lesson_ratings')
        .select('rating')
        .eq('lesson_id', lessonId);

      if (ratings) {
        setTotalRatings(ratings.length);
        const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
        setAverageRating(sum / ratings.length || 0);
      }
    } catch (error) {
      console.error('Error loading ratings:', error);
    }
  };

  const handleRate = async (value: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para avaliar",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('lesson_ratings')
        .upsert({
          lesson_id: lessonId,
          user_id: user.id,
          rating: value,
        });

      if (error) throw error;

      setRating(value);
      loadRatings();

      toast({
        title: "Sucesso",
        description: "Avaliação registrada com sucesso",
      });
    } catch (error) {
      console.error('Error rating:', error);
      toast({
        title: "Erro",
        description: "Não foi possível registrar sua avaliação",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className="p-1"
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(null)}
            onClick={() => handleRate(star)}
          >
            <Star
              className={`w-5 h-5 ${
                (hoverRating || rating || 0) >= star
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-400"
              }`}
            />
          </button>
        ))}
      </div>
      <span className="text-sm text-gray-400">
        ({totalRatings} {totalRatings === 1 ? "avaliação" : "avaliações"})
      </span>
    </div>
  );
};