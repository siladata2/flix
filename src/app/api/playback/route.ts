import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Resolves a short-lived, authorized playback URL for a movie or episode.
 * This is where you'd add entitlement checks (active subscription, region
 * locking, device limits) before calling out to your video/CDN provider's
 * signed-URL API with VIDEO_PROVIDER_API_KEY (server-only env var).
 */
export async function GET(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Sign in required' }, { status: 401 });

  const type = req.nextUrl.searchParams.get('type');
  const id = req.nextUrl.searchParams.get('id');
  if ((type !== 'movie' && type !== 'episode') || !id) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const table = type === 'movie' ? 'movie_sources' : 'episode_sources';
  const fkColumn = type === 'movie' ? 'movie_id' : 'episode_id';
  const { data: source } = await supabase.from(table).select('*').eq(fkColumn, id).eq('is_active', true).limit(1).maybeSingle();

  if (!source) return NextResponse.json({ error: 'No active playback source for this title' }, { status: 404 });

  // TODO: replace with a real call to VIDEO_PROVIDER_BASE_URL using
  // VIDEO_PROVIDER_API_KEY to mint a signed, short-lived URL for source.external_id.
  // Returning the raw external_id here is a placeholder for local development only.
  const url = `${process.env.VIDEO_PROVIDER_BASE_URL ?? ''}/${source.external_id}`;

  return NextResponse.json({ url, expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString() });
}
