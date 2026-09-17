-- SilaFlix — 0003: categories (genres / browse taxonomy)
create table categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  created_at timestamptz not null default now()
);
create index idx_categories_slug on categories(slug);

-- Junction table so any content type can belong to many categories.
create table content_categories (
  id uuid primary key default uuid_generate_v4(),
  content_type content_type not null,
  content_id uuid not null,
  category_id uuid not null references categories(id) on delete cascade,
  unique (content_type, content_id, category_id)
);
create index idx_content_categories_lookup on content_categories(content_type, content_id);
create index idx_content_categories_category on content_categories(category_id);
