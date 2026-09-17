import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getSessionProfile } from '@/lib/auth';
import { formatRuntime } from '@/lib/utils';
import { WatchlistButton } from '@/components/home/WatchlistButton';
import { ContentRow } from '@/components/home/ContentRow';
import { MovieCard } from '@/components/home/MovieCard';
import { DownloadList } from '@/components/DownloadList';
import { ShareButton } from '@/components/ShareButton';
import { PlayButton } from '@/components/player/PlayButton';
import type { Movie, DownloadOption } from '@/lib/types/database';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = createClient();
  const { data: movie } = await supabase.from('movies').select('title, synopsis, backdrop_url').eq('slug', params.slug).eq('is_published', true).maybeSingle();
  if (!movie) return { title: 'Title not found' };
  return {
    title: movie.title,
    description: movie.synopsis ?? undefined,
    openGraph: { images: movie.backdrop_url ? [movie.backdrop_url] : [] },
  };
}

export default async function TitlePage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const session = await getSessionProfile();

  const { data: movie } = await supabase
    .from('movies')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .maybeSingle();

  if (!movie) notFound();
  const m = movie as Movie;

  const [{ data: related }, { data: downloadOptions }, { data: watchlistRow }] = await Promise.all([
    supabase.from('movies').select('*').eq('is_published', true).neq('id', m.id).limit(8),
    supabase
      .from('download_options')
      .select('id, content_type, content_id, quality, format, file_size_bytes, language, subtitle_language, authorization_status, is_active, created_at')
      .eq('content_type', 'movie')
      .eq('content_id', m.id)
      .eq('authorization_status', 'approved')
      .eq('is_active', true),
    session
      ? supabase.from('watchlists').select('id').eq('user_id', session.user.id).eq('content_type', 'movie').eq('content_id', m.id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  return (
    <div className="pb-20">
      <div className="relative aspect-[16/7] w-full">
        {m.backdrop_url ? (
          <Image src={m.backdrop_url} alt="" fill priority className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(155deg,#3a2a1c_0%,#0B0B0C_72%)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
      </div>

      <div className="wrap -mt-24 relative">
        <h1 className="font-display text-4xl md:text-5xl mb-4">{m.title}</h1>
        <div className="flex flex-wrap gap-3 text-ink-dim text-[14.5px] mb-6">
          {m.content_rating && <span className="border border-line rounded-[5px] px-2.5 py-0.5">{m.content_rating}</span>}
          <span>{m.release_year}</span>
          {m.runtime_minutes && <span>{formatRuntime(m.runtime_minutes)}</span>}
          {m.language && <span>{m.language}</span>}
          {m.subtitle_languages?.length > 0 && <span>Subtitles: {m.subtitle_languages.join(', ')}</span>}
        </div>

        {m.synopsis && <p className="max-w-[70ch] text-ink-dim leading-relaxed mb-8">{m.synopsis}</p>}

        {(m.cast_members?.length > 0 || m.director) && (
          <div className="mb-8 text-sm text-ink-dim space-y-1">
            {m.director && <p><span className="text-ink-faint">Director: </span>{m.director}</p>}
            {m.cast_members?.length > 0 && <p><span className="text-ink-faint">Cast: </span>{m.cast_members.map((c) => c.name).join(', ')}</p>}
          </div>
        )}

        <div className="flex flex-wrap items-start gap-3 mb-10">
          <PlayButton contentType="movie" contentId={m.id} title={m.title} poster={m.backdrop_url ?? undefined} />
          <WatchlistButton contentType="movie" contentId={m.id} initialSaved={!!watchlistRow} />
          <ShareButton title={m.title} />
        </div>

        {(downloadOptions ?? []).length > 0 && (
          <div className="mb-10">
            <h2 className="font-display text-xl mb-3">Authorized downloads</h2>
            <DownloadList options={downloadOptions as DownloadOption[]} isAuthenticated={!!session} />
          </div>
        )}
      </div>

      <ContentRow title="You might also like">
        {(related ?? []).map((r) => <MovieCard key={r.id} movie={r as Movie} />)}
      </ContentRow>
    </div>
  );
}
