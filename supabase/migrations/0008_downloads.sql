-- SilaFlix — 0008: authorized download options + access logging
create table download_options (
  id uuid primary key default uuid_generate_v4(),
  content_type content_type not null,
  content_id uuid not null,
  quality text not null,
  format text not null,
  file_size_bytes bigint,
  language text,
  subtitle_language text,
  -- Never store a public path here. This points at a private bucket object;
  -- the API issues a short-lived signed URL, it is never sent to the client directly.
  protected_file_reference text not null,
  authorization_status authorization_status not null default 'pending',
  approved_by uuid references profiles(user_id),
  approved_at timestamptz,
  is_active boolean not null default false,
  created_at timestamptz not null default now()
);
create index idx_download_options_content on download_options(content_type, content_id);
create index idx_download_options_status on download_options(authorization_status);

create table download_access_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(user_id) on delete cascade,
  download_option_id uuid not null references download_options(id) on delete cascade,
  ip_address inet,
  user_agent text,
  signed_url_issued_at timestamptz not null default now(),
  expires_at timestamptz not null
);
create index idx_download_logs_user on download_access_logs(user_id, signed_url_issued_at desc);
create index idx_download_logs_option on download_access_logs(download_option_id);
