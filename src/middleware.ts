// Root middleware: refreshes the Supabase session on every request and
// gate-keeps /admin at the edge (defense-in-depth — every admin page also
// calls requireRole() server-side, and RLS is the real backstop underneath).
import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  // Exact-prefix match (not a bare substring check) so routes like
  // /admin-login are never accidentally swept into the /admin/** gate.
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');

  if (isAdminRoute && !user) {
    const loginUrl = new URL('/admin-login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|gif)$).*)',
  ],
};
