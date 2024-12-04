export interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  parent_id: string | null;
  likes_count: number;
  user_like?: boolean;
  user?: {
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  };
  replies?: Comment[];
}