import { notFound } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { sanitizeArticleHtml } from '@/lib/sanitize';
import { PlayButton } from '@/components/player/PlayButton';
import type { Recap } from '@/lib/types/database';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data } = await supabase.from('recaps').select('title, description').eq('slug', params.slug).maybeSingle();
  return { title: data?.title ?? 'Recap not found', description: data?.description ?? undefined };
}

export default async function RecapDetailPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data: recap } = await supabase.from('recaps').select('*').eq('slug', params.slug).eq('is_published', true).maybeSingle();
  if (!recap) notFound();
  const r = recap as Recap;

  return (
    <article className="wrap pt-32 pb-20 max-w-3xl">
      <h1 className="font-display text-3xl md:text-4xl mb-4">{r.title}</h1>
      {r.description && <p className="text-ink-dim text-lg mb-8">{r.description}</p>}

      {r.video_url ? (
        <div className="mb-8">
          <PlayButton contentType="movie" contentId={r.related_movie_id ?? r.id} title={r.title} poster={r.thumbnail_url ?? undefined} />
        </div>
      ) : r.thumbnail_url ? (
        <div className="relative aspect-video rounded-xl overflow-hidden mb-8">
          <Image src={r.thumbnail_url} alt="" fill className="object-cover" />
        </div>
      ) : null}

      {r.article_content && (
        <div
          className="prose prose-invert max-w-none text-ink-dim leading-relaxed [&_h2]:font-display [&_h2]:text-ink [&_h3]:font-display [&_h3]:text-ink"
          dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(r.article_content) }}
        />
      )}
    </article>
  );
}
