-- SilaFlix — 0005: series, seasons, episodes
create table series (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  synopsis text,
  poster_url text,
  backdrop_url text,
  cast_members jsonb default '[]'::jsonb,
  language text,
  content_rating text,
  status publish_status not null default 'draft',
  is_featured boolean not null default false,
  is_published boolean not null default false,
  created_by uuid references profiles(user_id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_series_slug on series(slug);
create index idx_series_published on series(is_published) where is_published = true;
create trigger trg_series_updated_at before update on series for each row execute function set_updated_at();

create table seasons (
  id uuid primary key default uuid_generate_v4(),
  series_id uuid not null references series(id) on delete cascade,
  season_number int not null check (season_number > 0),
  title text,
  synopsis text,
  created_at timestamptz not null default now(),
  unique (series_id, season_number)
);
create index idx_seasons_series on seasons(series_id);

create table episodes (
  id uuid primary key default uuid_generate_v4(),
  series_id uuid not null references series(id) on delete cascade,
  season_id uuid not null references seasons(id) on delete cascade,
  episode_number int not null check (episode_number > 0),
  title text not null,
  synopsis text,
  thumbnail_url text,
  runtime_minutes int check (runtime_minutes > 0),
  release_date date,
  video_source_id uuid,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (season_id, episode_number)
);
create index idx_episodes_series on episodes(series_id);
create index idx_episodes_season on episodes(season_id);
create index idx_episodes_published on episodes(is_published) where is_published = true;
create trigger trg_episodes_updated_at before update on episodes for each row execute function set_updated_at();

create table episode_sources (
  id uuid primary key default uuid_generate_v4(),
  episode_id uuid not null references episodes(id) on delete cascade,
  provider text not null,
  external_id text not null,
  quality text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create index idx_episode_sources_episode on episode_sources(episode_id);

alter table episodes
  add constraint fk_episode_video_source
  foreign key (video_source_id) references episode_sources(id) on delete set null;
