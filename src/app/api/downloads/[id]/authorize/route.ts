import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

const SIGNED_URL_TTL_SECONDS = 15 * 60; // 15 minutes

/**
 * Issues a short-lived signed URL for an approved, active download option.
 * Every step is server-side: the client never sees protected_file_reference,
 * only the resulting time-limited URL. Every issuance is logged to
 * download_access_logs for audit + basic rate-limiting.
 */
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Sign in required' }, { status: 401 });

  // Simple per-user rate limit: no more than 20 signed downloads per hour.
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from('download_access_logs')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('signed_url_issued_at', oneHourAgo);
  if ((count ?? 0) >= 20) {
    return NextResponse.json({ error: 'Download limit reached — try again later.' }, { status: 429 });
  }

  const admin = createAdminClient();
  const { data: option } = await admin
    .from('download_options')
    .select('*')
    .eq('id', params.id)
    .eq('authorization_status', 'approved')
    .eq('is_active', true)
    .maybeSingle();

  if (!option) return NextResponse.json({ error: 'This download is not currently available' }, { status: 404 });

  const { data: signed, error: signError } = await admin.storage
    .from('protected-downloads')
    .createSignedUrl(option.protected_file_reference, SIGNED_URL_TTL_SECONDS);

  if (signError || !signed) return NextResponse.json({ error: 'Could not prepare this download' }, { status: 500 });

  const expiresAt = new Date(Date.now() + SIGNED_URL_TTL_SECONDS * 1000).toISOString();

  await admin.from('download_access_logs').insert({
    user_id: user.id,
    download_option_id: option.id,
    ip_address: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
    user_agent: req.headers.get('user-agent'),
    expires_at: expiresAt,
  });

  return NextResponse.json({ url: signed.signedUrl, expiresAt });
}
