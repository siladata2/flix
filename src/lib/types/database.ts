// Hand-written starter types matching the SQL migrations under
// supabase/migrations/. Once you have a real project, replace this file
// with the CLI-generated version for full accuracy:
//   supabase gen types typescript --project-id <ref> --schema public > src/lib/types/database.ts
export type UserRole = 'user' | 'moderator' | 'editor' | 'admin' | 'super_admin';
export type PublishStatus = 'draft' | 'in_review' | 'published' | 'unpublished' | 'archived';
export type ContentType = 'movie' | 'series' | 'episode' | 'reel' | 'recap';
export type ReportStatus = 'pending' | 'reviewing' | 'resolved' | 'dismissed';
export type AuthorizationStatus = 'pending' | 'approved' | 'rejected' | 'revoked';

export interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  preferred_language: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Movie {
  id: string;
  title: string;
  slug: string;
  synopsis: string | null;
  poster_url: string | null;
  backdrop_url: string | null;
  trailer_url: string | null;
  cast_members: { name: string; role?: string }[];
  director: string | null;
  release_year: number | null;
  runtime_minutes: number | null;
  language: string | null;
  subtitle_languages: string[];
  content_rating: string | null;
  status: PublishStatus;
  is_featured: boolean;
  is_published: boolean;
  view_count: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Series {
  id: string;
  title: string;
  slug: string;
  synopsis: string | null;
  poster_url: string | null;
  backdrop_url: string | null;
  cast_members: { name: string; role?: string }[];
  language: string | null;
  content_rating: string | null;
  status: PublishStatus;
  is_featured: boolean;
  is_published: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Season {
  id: string;
  series_id: string;
  season_number: number;
  title: string | null;
  synopsis: string | null;
  created_at: string;
}

export interface Episode {
  id: string;
  series_id: string;
  season_id: string;
  episode_number: number;
  title: string;
  synopsis: string | null;
  thumbnail_url: string | null;
  runtime_minutes: number | null;
  release_date: string | null;
  video_source_id: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Reel {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  creator_id: string;
  duration_seconds: number | null;
  status: PublishStatus;
  is_published: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface Recap {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  video_url: string | null;
  article_content: string | null;
  language: string;
  author_id: string | null;
  related_movie_id: string | null;
  status: PublishStatus;
  is_published: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

export interface WatchlistItem {
  id: string;
  user_id: string;
  content_type: ContentType;
  content_id: string;
  created_at: string;
}

export interface WatchHistoryItem {
  id: string;
  user_id: string;
  content_type: ContentType;
  content_id: string;
  progress_seconds: number;
  duration_seconds: number | null;
  completed: boolean;
  last_watched_at: string;
}

export interface DownloadOption {
  id: string;
  content_type: ContentType;
  content_id: string;
  quality: string;
  format: string;
  file_size_bytes: number | null;
  language: string | null;
  subtitle_language: string | null;
  authorization_status: AuthorizationStatus;
  is_active: boolean;
  created_at: string;
  // protected_file_reference intentionally omitted — never send to the client
}

export interface Report {
  id: string;
  reporter_id: string;
  content_type: ContentType;
  content_id: string;
  reason: string;
  description: string | null;
  status: ReportStatus;
  created_at: string;
}

// Minimal Database generic so @supabase/ssr's generics compile.
// Replace with the generated version for full type-safety on `.from()` calls.
export type Database = {
  public: {
    Tables: Record<string, { Row: any; Insert: any; Update: any }>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      publish_status: PublishStatus;
      content_type: ContentType;
      report_status: ReportStatus;
      authorization_status: AuthorizationStatus;
    };
  };
};
