export interface Comment {
  id: string;
  content: string;
  created_at: string;
  likes_count: number;
  dislikes_count: number;
  user: {
    first_name: string;
    last_name: string;
    avatar_url: string;
  };
  replies?: Comment[];
  user_like?: boolean | null;
}