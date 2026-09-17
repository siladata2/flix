-- SilaFlix — 0006: reels & movie recaps
create table reels (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  video_url text not null,
  thumbnail_url text,
  creator_id uuid not null references profiles(user_id),
  duration_seconds int check (duration_seconds > 0),
  status publish_status not null default 'in_review',
  is_published boolean not null default false,
  view_count bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_reels_published on reels(is_published) where is_published = true;
create index idx_reels_creator on reels(creator_id);
create index idx_reels_status on reels(status);
create trigger trg_reels_updated_at before update on reels for each row execute function set_updated_at();

create table recaps (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  description text,
  thumbnail_url text,
  video_url text,
  article_content text, -- sanitized HTML — see lib/sanitize.ts before ever rendering
  language text default 'en',
  author_id uuid references profiles(user_id),
  related_movie_id uuid references movies(id) on delete set null,
  status publish_status not null default 'draft',
  is_published boolean not null default false,
  view_count bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_recaps_slug on recaps(slug);
create index idx_recaps_published on recaps(is_published) where is_published = true;
create trigger trg_recaps_updated_at before update on recaps for each row execute function set_updated_at();
