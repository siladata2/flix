
import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/auth';
import { movieInputSchema } from '@/lib/validations';

/**
 * Reference CRUD pattern for admin-managed content.
 * The same shape (requireRole → validate → mutate → audit log)
 * applies to series, episodes, reels, recaps, and categories.
 */

// ============================================
// GET — LOAD MOVIES
// ============================================

export async function GET(req: NextRequest) {
  const supabase = createClient();

  const status = req.nextUrl.searchParams.get('status');

  let query = supabase
    .from('movies')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(
      { error: 'Could not load movies' },
      { status: 500 }
    );
  }

  return NextResponse.json({ movies: data });
}

// ============================================
// POST — CREATE MOVIE
// ============================================

export async function POST(req: NextRequest) {
  const { user, profile } = await requireRoleForApi('editor');

  if (!user) {
    return profile as NextResponse;
  }

  const parsed = movieInputSchema.safeParse(
    await req.json().catch(() => null)
  );

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const supabase = createClient();

  const { data, error } = await supabase
    .from('movies')
    .insert({
      ...parsed.data,
      created_by: user.id,
      status: parsed.data.is_published
        ? 'published'
        : 'draft',
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      {
        error:
          'Could not create movie — check the slug is unique',
      },
      { status: 400 }
    );
  }

  await supabase.from('audit_logs').insert({
    actor_id: user.id,
    action: 'movie.create',
    entity_type: 'movie',
    entity_id: data.id,
    metadata: {
      title: data.title,
    },
  });

  return NextResponse.json(
    { movie: data },
    { status: 201 }
  );
}

// ============================================
// ROLE AUTHENTICATION HELPER
// ============================================

async function requireRoleForApi(
  minimum: Parameters<typeof requireRole>[0]
) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      user: null,
      profile: NextResponse.json(
        { error: 'Sign in required' },
        { status: 401 }
      ),
    };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  const rank: Record<string, number> = {
    user: 0,
    moderator: 1,
    editor: 1,
    admin: 2,
    super_admin: 3,
  };

  // Safely resolve user role and minimum required role
  const userRank = profile
    ? rank[profile.role] ?? -1
    : -1;

  const minimumRank = rank[minimum] ?? 0;

  if (!profile || userRank < minimumRank) {
    return {
      user: null,
      profile: NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      ),
    };
  }

  return {
    user,
    profile,
  };
}
