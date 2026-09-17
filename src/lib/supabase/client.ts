// Browser-side Supabase client. Safe to import from any "use client" component.
// Uses only the public URL + anon key — RLS is what actually protects data,
// not this file, so never add the service-role key here.
'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/lib/types/database';

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
