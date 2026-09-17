-- SilaFlix — 0002: profiles (1:1 extension of auth.users)
create table profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text,
  username text unique,
  avatar_url text,
  bio text,
  preferred_language text default 'en',
  role user_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint username_format check (username is null or username ~ '^[a-zA-Z0-9_.]{3,30}$')
);

create index idx_profiles_user_id on profiles(user_id);
create index idx_profiles_role on profiles(role);

create trigger trg_profiles_updated_at
  before update on profiles
  for each row execute function set_updated_at();

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id, display_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)), 'user');
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Helper used throughout RLS policies: current caller's role, read from the
-- server-trusted profiles table — never from a JWT claim the client can edit.
create or replace function current_user_role()
returns user_role as $$
  select role from public.profiles where user_id = auth.uid();
$$ language sql stable security definer set search_path = public;

create or replace function is_staff()
returns boolean as $$
  select current_user_role() in ('moderator','editor','admin','super_admin');
$$ language sql stable security definer set search_path = public;

create or replace function is_admin()
returns boolean as $$
  select current_user_role() in ('admin','super_admin');
$$ language sql stable security definer set search_path = public;
