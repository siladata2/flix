
// Server-only role helpers. Every admin page and every mutating API route
// must call one of these before doing anything — the RLS policies are the
// real backstop, but failing fast here gives clean UX instead of a raw
// Postgres permission error.

import 'server-only';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { UserRole } from '@/lib/types/database';

const ROLE_RANK: Record<UserRole, number> = {
  user: 0,
  moderator: 1,
  editor: 1,
  admin: 2,
  super_admin: 3,
};

export async function getSessionProfile() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  return profile ? { user, profile } : null;
}

/**
 * Redirects to /login (or / if signed in but under-privileged)
 * unless the caller's role meets `minimum`.
 *
 * Use at the top of every admin page/layout and every mutating
 * Route Handler.
 */
export async function requireRole(minimum: UserRole) {
  const session = await getSessionProfile();

  if (!session) {
    redirect('/login?redirectTo=/admin');
  }

  const userRole = session.profile.role as UserRole;

  if (ROLE_RANK[userRole] < ROLE_RANK[minimum]) {
    redirect('/');
  }

  return session;
}

export async function requireUser() {
  const session = await getSessionProfile();

  if (!session) {
    redirect('/login');
  }

  return session;
}
