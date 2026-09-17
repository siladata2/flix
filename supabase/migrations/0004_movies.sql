-- SilaFlix — 0004: movies
create table movies (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  synopsis text,
  poster_url text,
  backdrop_url text,
  trailer_url text,
  cast_members jsonb default '[]'::jsonb,
  director text,
  release_year int check (release_year between 1888 and 2100),
  runtime_minutes int check (runtime_minutes > 0),
  language text,
  subtitle_languages text[] default '{}',
  content_rating text,
  status publish_status not null default 'draft',
  is_featured boolean not null default false,
  is_published boolean not null default false,
  view_count bigint not null default 0,
  created_by uuid references profiles(user_id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_movies_slug on movies(slug);
create index idx_movies_published on movies(is_published) where is_published = true;
create index idx_movies_featured on movies(is_featured) where is_featured = true;
create index idx_movies_release_year on movies(release_year);
create index idx_movies_status on movies(status);

create trigger trg_movies_updated_at
  before update on movies
  for each row execute function set_updated_at();

-- One authoritative source video reference per movie (actual hosting lives
-- with a dedicated video/CDN provider — see docs/VIDEO_HOSTING.md).
create table movie_sources (
  id uuid primary key default uuid_generate_v4(),
  movie_id uuid not null references movies(id) on delete cascade,
  provider text not null,
  external_id text not null,
  quality text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create index idx_movie_sources_movie on movie_sources(movie_id);
