import { notFound } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { formatRuntime } from '@/lib/utils';
import { PlayButton } from '@/components/player/PlayButton';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Episode } from '@/lib/types/database';

export default async function SeasonPage({ params }: { params: { slug: string; seasonNumber: string } }) {
  const supabase = createClient();

  const { data: series } = await supabase.from('series').select('id, title, slug').eq('slug', params.slug).eq('is_published', true).maybeSingle();
  if (!series) notFound();

  const { data: season } = await supabase
    .from('seasons')
    .select('*')
    .eq('series_id', series.id)
    .eq('season_number', Number(params.seasonNumber))
    .maybeSingle();
  if (!season) notFound();

  const { data: episodes } = await supabase
    .from('episodes')
    .select('*')
    .eq('season_id', season.id)
    .eq('is_published', true)
    .order('episode_number');

  return (
    <div className="wrap pt-32 pb-20">
      <p className="text-ink-faint text-sm mb-1">{series.title}</p>
      <h1 className="font-display text-3xl mb-8">Season {season.season_number}{season.title ? ` — ${season.title}` : ''}</h1>

      {(episodes ?? []).length === 0 ? (
        <EmptyState title="No episodes published yet" message="Episodes will appear here once the admin publishes them." />
      ) : (
        <div className="flex flex-col gap-4">
          {(episodes as Episode[]).map((ep) => (
            <div key={ep.id} className="flex gap-4 p-4 rounded-xl border border-line bg-bg-card">
              <div className="relative w-40 aspect-video flex-none rounded-lg overflow-hidden bg-bg-raised">
                {ep.thumbnail_url && <Image src={ep.thumbnail_url} alt="" fill className="object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-ink-faint text-xs mb-1">
                  <span>Episode {ep.episode_number}</span>
                  {ep.runtime_minutes && <span>· {formatRuntime(ep.runtime_minutes)}</span>}
                </div>
                <h3 className="font-display text-lg mb-1">{ep.title}</h3>
                {ep.synopsis && <p className="text-ink-dim text-sm line-clamp-2 mb-3">{ep.synopsis}</p>}
                <PlayButton contentType="episode" contentId={ep.id} title={ep.title} poster={ep.thumbnail_url ?? undefined} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
