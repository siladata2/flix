# SilaFlix — Supabase setup

## Running migrations

```bash
# with the Supabase CLI, from the project root
supabase link --project-ref <your-project-ref>
supabase db push
```

Migrations run in filename order (0001 → 0011). `0011_seed_data.sql` is
local/dev-only — do not run it against production; seed real categories and
`app_settings` through the admin dashboard instead.

## What's enforced here

- **RLS is on for every table that holds user data or unpublished content.**
  Public (anon) reads only ever see `is_published = true` rows.
- **Roles live in `profiles.role`, never in a JWT the client can shape.**
  `current_user_role()`, `is_staff()`, `is_admin()` are `security definer`
  functions every policy calls — the single source of truth for authorization.
- **`download_options.protected_file_reference`** must never be selected with
  `select *` from a client-facing query. The download API route selects an
  explicit column list that excludes it, resolves it server-side with the
  service-role key, and hands back only a short-lived signed URL.
- **`audit_logs` has no update/delete policy** — it's append-only by omission,
  written only by staff actions or the service role.

## Still to configure per environment

- Storage buckets (`posters`, `backdrops`, `thumbnails`, `avatars` — public read;
  a separate private bucket for source files referenced by `download_options`).
- Auth providers (email is on by default; enable Google OAuth in the Supabase
  dashboard if you want it — no code change needed beyond `lib/supabase/client.ts`).
- Edge Functions for signed-download-URL issuance and moderation webhooks
  (stubs live in `supabase/functions/`, not included in this scaffold — see
  `docs/DEPLOYMENT.md` for the pattern to follow).
