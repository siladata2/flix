-- SilaFlix — 0007: watchlists, watch history, likes, saved content
create table watchlists (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(user_id) on delete cascade,
  content_type content_type not null,
  content_id uuid not null,
  created_at timestamptz not null default now(),
  unique (user_id, content_type, content_id)
);
create index idx_watchlists_user on watchlists(user_id);

create table watch_history (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(user_id) on delete cascade,
  content_type content_type not null,
  content_id uuid not null,
  progress_seconds int not null default 0,
  duration_seconds int,
  completed boolean not null default false,
  last_watched_at timestamptz not null default now(),
  unique (user_id, content_type, content_id)
);
create index idx_watch_history_user on watch_history(user_id, last_watched_at desc);

create table likes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(user_id) on delete cascade,
  content_type content_type not null,
  content_id uuid not null,
  created_at timestamptz not null default now(),
  unique (user_id, content_type, content_id)
);
create index idx_likes_content on likes(content_type, content_id);

create table saved_content (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(user_id) on delete cascade,
  content_type content_type not null,
  content_id uuid not null,
  created_at timestamptz not null default now(),
  unique (user_id, content_type, content_id)
);
create index idx_saved_content_user on saved_content(user_id);
