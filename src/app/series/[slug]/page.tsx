import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getSessionProfile } from '@/lib/auth';
import { WatchlistButton } from '@/components/home/WatchlistButton';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Series, Season } from '@/lib/types/database';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data } = await supabase.from('series').select('title, synopsis').eq('slug', params.slug).maybeSingle();
  return { title: data?.title ?? 'Series not found', description: data?.synopsis ?? undefined };
}

export default async function SeriesDetailPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const session = await getSessionProfile();

  const { data: series } = await supabase.from('series').select('*').eq('slug', params.slug).eq('is_published', true).maybeSingle();
  if (!series) notFound();
  const s = series as Series;

  const [{ data: seasons }, { data: watchlistRow }] = await Promise.all([
    supabase.from('seasons').select('*').eq('series_id', s.id).order('season_number'),
    session
      ? supabase.from('watchlists').select('id').eq('user_id', session.user.id).eq('content_type', 'series').eq('content_id', s.id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  return (
    <div className="pb-20">
      <div className="relative aspect-[16/7] w-full">
        {s.backdrop_url ? (
          <Image src={s.backdrop_url} alt="" fill priority className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(155deg,#1c2a3a_0%,#0B0B0C_72%)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
      </div>

      <div className="wrap -mt-24 relative">
        <h1 className="font-display text-4xl md:text-5xl mb-4">{s.title}</h1>
        <div className="flex flex-wrap gap-3 text-ink-dim text-[14.5px] mb-6">
          {s.content_rating && <span className="border border-line rounded-[5px] px-2.5 py-0.5">{s.content_rating}</span>}
          {s.language && <span>{s.language}</span>}
          <span>{(seasons ?? []).length} season{(seasons ?? []).length === 1 ? '' : 's'}</span>
        </div>
        {s.synopsis && <p className="max-w-[70ch] text-ink-dim leading-relaxed mb-8">{s.synopsis}</p>}

        <div className="mb-12">
          <WatchlistButton contentType="series" contentId={s.id} initialSaved={!!watchlistRow} />
        </div>

        <h2 className="font-display text-xl mb-4">Seasons</h2>
        {(seasons ?? []).length === 0 ? (
          <EmptyState title="No seasons yet" message="Seasons and episodes will appear here once published." />
        ) : (
          <div className="flex flex-col gap-2">
            {(seasons as Season[]).map((season) => (
              <Link
                key={season.id}
                href={`/series/${s.slug}/season/${season.season_number}`}
                className="flex items-center justify-between p-4 rounded-lg border border-line bg-bg-card hover:border-gold/40"
              >
                <span className="font-semibold text-sm">Season {season.season_number}{season.title ? ` — ${season.title}` : ''}</span>
                <span className="text-ink-faint text-sm">View episodes →</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
