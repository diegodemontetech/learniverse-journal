import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface LessonLikesProps {
  lessonId: string;
}

export const LessonLikes = ({ lessonId }: LessonLikesProps) => {
  const [userLike, setUserLike] = useState<boolean | null>(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    loadLikes();
  }, [lessonId]);

  const loadLikes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user's like status - now handling empty results
      const { data: userLikes } = await supabase
        .from('lesson_likes')
        .select('is_like')
        .eq('lesson_id', lessonId)
        .eq('user_id', user.id);

      if (userLikes && userLikes.length > 0) {
        setUserLike(userLikes[0].is_like);
      } else {
        setUserLike(null);
      }

      // Get total likes and dislikes
      const { data: likesData } = await supabase
        .from('lesson_likes')
        .select('is_like')
        .eq('lesson_id', lessonId);

      if (likesData) {
        const totalLikes = likesData.filter(l => l.is_like).length;
        const totalDislikes = likesData.filter(l => !l.is_like).length;
        setLikes(totalLikes);
        setDislikes(totalDislikes);
      }
    } catch (error) {
      console.error('Error loading likes:', error);
    }
  };

  const handleLike = async (isLike: boolean) => {
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

      // If clicking the same button again, remove the like/dislike
      if (userLike === isLike) {
        const { error } = await supabase
          .from('lesson_likes')
          .delete()
          .eq('lesson_id', lessonId)
          .eq('user_id', user.id);

        if (error) throw error;
        setUserLike(null);
      } else {
        // First try to delete any existing like/dislike
        await supabase
          .from('lesson_likes')
          .delete()
          .eq('lesson_id', lessonId)
          .eq('user_id', user.id);

        // Then insert the new like/dislike
        const { error } = await supabase
          .from('lesson_likes')
          .insert([{
            lesson_id: lessonId,
            user_id: user.id,
            is_like: isLike,
          }]);

        if (error) throw error;
        setUserLike(isLike);
      }

      // Reload likes to update counts
      await loadLikes();
    } catch (error: any) {
      console.error('Error updating like:', error);
      toast({
        title: "Erro",
        description: "Não foi possível registrar sua avaliação",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => handleLike(true)}
        className="flex items-center gap-1"
      >
        <ThumbsUp
          className={`w-5 h-5 ${
            userLike === true ? "text-green-500" : "text-gray-400"
          }`}
        />
        <span className="text-sm text-gray-400">{likes}</span>
      </button>
      <button
        onClick={() => handleLike(false)}
        className="flex items-center gap-1"
      >
        <ThumbsDown
          className={`w-5 h-5 ${
            userLike === false ? "text-red-500" : "text-gray-400"
          }`}
        />
        <span className="text-sm text-gray-400">{dislikes}</span>
      </button>
    </div>
  );
};