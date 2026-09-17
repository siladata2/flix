import Link from 'next/link';
import Image from 'next/image';
import type { Series } from '@/lib/types/database';

export function SeriesCard({ series }: { series: Pick<Series, 'title' | 'slug' | 'poster_url' | 'content_rating'> }) {
  return (
    <Link
      href={`/series/${series.slug}`}
      className="group relative flex-none w-[190px] rounded-[10px] overflow-hidden border border-line bg-bg-card transition-transform hover:-translate-y-1.5 hover:border-gold/40"
    >
      <div className="relative aspect-[2/3] w-full bg-bg-raised">
        {series.poster_url ? (
          <Image src={series.poster_url} alt={`${series.title} poster`} fill sizes="190px" className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-3">
            <span className="font-display text-sm text-center text-ink-dim">{series.title}</span>
          </div>
        )}
        <span className="absolute top-2 left-2 text-[10.5px] font-semibold bg-bg/70 border border-white/15 px-1.5 py-0.5 rounded">SERIES</span>
      </div>
      <div className="px-3 py-2.5 text-[12px] text-ink-faint truncate">{series.title}</div>
    </Link>
  );
}
