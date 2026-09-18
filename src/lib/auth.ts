
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
 * Redirects to /admin-login (or / if signed in but under-privileged)
 * unless the caller's role meets `minimum`.
 *
 * Use at the top of every admin page/layout and every mutating
 * Route Handler that is admin-only.
 */
export async function requireRole(minimum: UserRole) {
  const session = await getSessionProfile();

  if (!session) {
    redirect('/admin-login?redirectTo=/admin');
  }

  const userRole = session.profile.role as UserRole;

  if (ROLE_RANK[userRole] < ROLE_RANK[minimum]) {
    // Signed in, but not privileged enough — send back to the admin
    // login screen with an explanatory flag rather than a silent
    // bounce to "/", which looked like the login had simply failed.
    redirect('/admin-login?error=forbidden');
  }

  return session;
}

/**
 * Same role check as requireRole, but for Route Handlers (API routes),
 * which must return JSON instead of triggering a redirect. Use this at
 * the top of any admin-only POST/PATCH/DELETE handler.
 */
export async function requireRoleForApi(minimum: UserRole) {
  const session = await getSessionProfile();

  if (!session) {
    return { session: null, error: { message: 'Sign in required', status: 401 as const } };
  }

  if (ROLE_RANK[session.profile.role] < ROLE_RANK[minimum]) {
    return { session: null, error: { message: 'Forbidden', status: 403 as const } };
  }

  return { session, error: null };
}

export async function requireUser() {
  const session = await getSessionProfile();

  if (!session) {
    redirect('/login');
  }

  return session;
}
