-- SilaFlix — 0010: Row Level Security
-- Every policy below is enforced by Postgres itself, so it holds even if
-- application code has a bug. Client-supplied roles are never trusted —
-- all role checks call current_user_role()/is_staff()/is_admin(), which
-- read the server-side profiles row for auth.uid().

-- ===================== PROFILES =====================
alter table profiles enable row level security;

create policy "profiles_select_own_or_staff"
  on profiles for select
  using (user_id = auth.uid() or is_staff());

create policy "profiles_update_own"
  on profiles for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid() and role = (select role from profiles p where p.user_id = auth.uid()));
  -- ^ a user can edit their own profile fields but cannot change their own role.

create policy "profiles_admin_manage"
  on profiles for all
  using (is_admin())
  with check (is_admin());

-- ===================== PUBLIC CONTENT (movies, series, seasons, episodes, recaps) =====================
alter table movies enable row level security;
alter table series enable row level security;
alter table seasons enable row level security;
alter table episodes enable row level security;
alter table recaps enable row level security;
alter table movie_sources enable row level security;
alter table episode_sources enable row level security;

create policy "movies_public_read_published" on movies for select using (is_published = true or is_staff());
create policy "movies_staff_write" on movies for insert with check (is_staff());
create policy "movies_staff_update" on movies for update using (is_staff()) with check (is_staff());
create policy "movies_admin_delete" on movies for delete using (is_admin());

create policy "series_public_read_published" on series for select using (is_published = true or is_staff());
create policy "series_staff_write" on series for insert with check (is_staff());
create policy "series_staff_update" on series for update using (is_staff()) with check (is_staff());
create policy "series_admin_delete" on series for delete using (is_admin());

create policy "seasons_public_read" on seasons for select using (
  exists (select 1 from series s where s.id = seasons.series_id and (s.is_published or is_staff()))
);
create policy "seasons_staff_write" on seasons for all using (is_staff()) with check (is_staff());

create policy "episodes_public_read_published" on episodes for select using (is_published = true or is_staff());
create policy "episodes_staff_write" on episodes for insert with check (is_staff());
create policy "episodes_staff_update" on episodes for update using (is_staff()) with check (is_staff());
create policy "episodes_admin_delete" on episodes for delete using (is_admin());

create policy "recaps_public_read_published" on recaps for select using (is_published = true or is_staff());
create policy "recaps_staff_write" on recaps for insert with check (is_staff());
create policy "recaps_staff_update" on recaps for update using (is_staff()) with check (is_staff());
create policy "recaps_admin_delete" on recaps for delete using (is_admin());

-- Video source rows never go to anonymous clients directly (fetched only by
-- trusted server code), but RLS still applies defense-in-depth.
create policy "movie_sources_staff_only" on movie_sources for select using (is_staff());
create policy "movie_sources_staff_write" on movie_sources for all using (is_staff()) with check (is_staff());
create policy "episode_sources_staff_only" on episode_sources for select using (is_staff());
create policy "episode_sources_staff_write" on episode_sources for all using (is_staff()) with check (is_staff());

-- ===================== REELS (user-submitted + moderated) =====================
alter table reels enable row level security;

create policy "reels_public_read_published" on reels for select using (is_published = true or is_staff() or creator_id = auth.uid());
create policy "reels_owner_submit" on reels for insert with check (creator_id = auth.uid());
create policy "reels_owner_or_staff_update" on reels for update
  using (creator_id = auth.uid() or is_staff())
  with check (
    is_staff() or (creator_id = auth.uid() and is_published = false)
    -- ^ owners can edit their own unpublished reel; only staff can publish/moderate.
  );
create policy "reels_staff_delete" on reels for delete using (is_staff());

-- ===================== CATEGORIES =====================
alter table categories enable row level security;
alter table content_categories enable row level security;

create policy "categories_public_read" on categories for select using (true);
create policy "categories_staff_write" on categories for all using (is_staff()) with check (is_staff());
create policy "content_categories_public_read" on content_categories for select using (true);
create policy "content_categories_staff_write" on content_categories for all using (is_staff()) with check (is_staff());

-- ===================== PRIVATE USER DATA =====================
alter table watchlists enable row level security;
alter table watch_history enable row level security;
alter table likes enable row level security;
alter table saved_content enable row level security;
alter table notifications enable row level security;

create policy "watchlists_owner_only" on watchlists for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "watch_history_owner_only" on watch_history for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "likes_owner_only" on likes for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "likes_public_read_for_counts" on likes for select using (true);
create policy "saved_content_owner_only" on saved_content for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "notifications_owner_read" on notifications for select using (user_id = auth.uid());
create policy "notifications_owner_update" on notifications for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "notifications_staff_create" on notifications for insert with check (is_staff());

-- ===================== DOWNLOADS =====================
alter table download_options enable row level security;
alter table download_access_logs enable row level security;

-- Public users may only see APPROVED + ACTIVE download options; never the
-- protected_file_reference column logic is enforced in the API layer, which
-- selects an explicit column list instead of "select *" for this table.
create policy "download_options_public_read_active" on download_options for select
  using (authorization_status = 'approved' and is_active = true or is_staff());
create policy "download_options_staff_write" on download_options for insert with check (is_staff());
create policy "download_options_staff_update" on download_options for update using (is_staff()) with check (is_staff());
create policy "download_options_admin_delete" on download_options for delete using (is_admin());

create policy "download_logs_owner_read" on download_access_logs for select using (user_id = auth.uid() or is_staff());
create policy "download_logs_owner_insert" on download_access_logs for insert with check (user_id = auth.uid());

-- ===================== REPORTS =====================
alter table reports enable row level security;
create policy "reports_reporter_create" on reports for insert with check (reporter_id = auth.uid());
create policy "reports_reporter_read_own" on reports for select using (reporter_id = auth.uid() or is_staff());
create policy "reports_staff_update" on reports for update using (is_staff()) with check (is_staff());

-- ===================== AUDIT LOGS (protected — staff read, nobody edits) =====================
alter table audit_logs enable row level security;
create policy "audit_logs_staff_read" on audit_logs for select using (is_staff());
create policy "audit_logs_server_insert" on audit_logs for insert with check (auth.role() = 'service_role' or is_staff());
-- No update/delete policy exists for any role: audit_logs is append-only by omission.

-- ===================== APP SETTINGS =====================
alter table app_settings enable row level security;
create policy "app_settings_public_read" on app_settings for select using (true);
create policy "app_settings_admin_write" on app_settings for all using (is_admin()) with check (is_admin());

-- ===================== CONTACT SUBMISSIONS =====================
alter table contact_submissions enable row level security;
create policy "contact_submissions_anyone_insert" on contact_submissions for insert with check (true);
create policy "contact_submissions_staff_read" on contact_submissions for select using (is_staff());
create policy "contact_submissions_staff_update" on contact_submissions for update using (is_staff()) with check (is_staff());
