-- SilaFlix — 0009: reports, notifications, audit logs, app settings
create table reports (
  id uuid primary key default uuid_generate_v4(),
  reporter_id uuid not null references profiles(user_id) on delete cascade,
  content_type content_type not null,
  content_id uuid not null,
  reason text not null,
  description text,
  status report_status not null default 'pending',
  reviewed_by uuid references profiles(user_id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);
create index idx_reports_status on reports(status);
create index idx_reports_content on reports(content_type, content_id);

create table notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(user_id) on delete cascade,
  title text not null,
  message text not null,
  type text not null default 'general',
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
create index idx_notifications_user on notifications(user_id, is_read, created_at desc);

create table audit_logs (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid references profiles(user_id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index idx_audit_logs_actor on audit_logs(actor_id, created_at desc);
create index idx_audit_logs_entity on audit_logs(entity_type, entity_id);

create table app_settings (
  id uuid primary key default uuid_generate_v4(),
  setting_key text not null unique,
  setting_value jsonb not null,
  updated_by uuid references profiles(user_id),
  updated_at timestamptz not null default now()
);

create table contact_submissions (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  subject text not null,
  category text not null default 'general',
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);
create index idx_contact_submissions_status on contact_submissions(status, created_at desc);
