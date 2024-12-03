export interface Category {
  id: string;
  name: string;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  instructor: string;
  thumbnail_url?: string;
  duration?: number;
  category_id?: string;
  created_at: string;
  user_progress?: Array<{
    progress_percentage: number;
  }>;
  status?: 'new' | 'in_progress' | 'completed';
}