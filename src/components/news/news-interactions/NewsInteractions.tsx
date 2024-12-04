import { NewsRating } from "./NewsRating";
import { NewsLikes } from "./NewsLikes";
import { NewsComments } from "./NewsComments";

interface NewsInteractionsProps {
  newsId: string;
}

export const NewsInteractions = ({ newsId }: NewsInteractionsProps) => {
  return (
    <div className="space-y-4">
      <div className="bg-[#272727] rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between">
          <NewsRating newsId={newsId} />
          <NewsLikes newsId={newsId} />
        </div>
        <div className="pt-4 border-t border-[#3a3a3a]">
          <NewsComments newsId={newsId} />
        </div>
      </div>
    </div>
  );
};