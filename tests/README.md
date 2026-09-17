# Tests — status

These test files are real Vitest specs, but **they have not been run** in
the environment that generated this project (no network/npm access there).

Before you trust them:
```bash
npm install
npm run test
```

## What's covered here
- `utils.test.ts` — pure formatting helpers (no I/O)
- `validations.test.ts` — Zod schema edge cases

## What's intentionally NOT covered here (needs a real Supabase project)
- RLS policy behavior — write these as integration tests against a local
  `supabase start` instance using the Supabase CLI, asserting that e.g. a
  `user`-role session cannot write to `movies`, and an `editor` can.
- Auth flows (signup/login/reset) — best covered with Playwright against a
  running dev server + a disposable Supabase project.
- Admin permission boundaries — same integration-test approach as RLS above:
  create sessions at each role and assert 403s where expected.
- File upload validation, download authorization, rate limiting.

See `docs/DEPLOYMENT.md` for how to stand up a local Supabase instance to
write and run those integration tests against.
