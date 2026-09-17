-- SilaFlix — 0001: extensions & shared enum types
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Roles are enforced server-side only. Never trust a client-supplied role.
create type user_role as enum ('user', 'moderator', 'editor', 'admin', 'super_admin');
create type publish_status as enum ('draft', 'in_review', 'published', 'unpublished', 'archived');
create type content_type as enum ('movie', 'series', 'episode', 'reel', 'recap');
create type report_status as enum ('pending', 'reviewing', 'resolved', 'dismissed');
create type authorization_status as enum ('pending', 'approved', 'rejected', 'revoked');

-- Generic updated_at trigger reused by every table below
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;
