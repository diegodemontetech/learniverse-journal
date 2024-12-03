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

export interface Ebook {
  id: string;
  title: string;
  author: string;
  description: string;
  thumbnail_url: string | null;
  pdf_url: string;
  total_pages: number;
  category_id: string;
  category?: {
    name: string;
  };
}