// SERVICE-ROLE client — bypasses RLS entirely. Import this ONLY from:
//   - Route Handlers under src/app/api/** that have already verified the
//     caller's role server-side (see lib/auth.ts requireRole()), or
//   - trusted server-only jobs (e.g. signed download URL issuance).
// Never import this file from a Client Component, and never forward its
// responses to the browser unfiltered.
import 'server-only';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/types/database';

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Supabase admin client is missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }
  return createSupabaseClient<Database>(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
