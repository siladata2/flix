import Link from 'next/link';
import Image from 'next/image';
import { Play, Info, Plus } from 'lucide-react';
import type { Movie } from '@/lib/types/database';
import { formatRuntime } from '@/lib/utils';
import { WatchlistButton } from './WatchlistButton';

export function HeroBanner({ movie }: { movie: Movie }) {
  return (
    <section className="relative min-h-[min(92vh,860px)] flex items-end pt-36 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        {movie.backdrop_url ? (
          <Image src={movie.backdrop_url} alt="" fill priority className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_78%_20%,rgba(232,163,61,0.25),transparent_60%),radial-gradient(ellipse_50%_60%_at_15%_85%,rgba(193,67,43,0.28),transparent_65%),linear-gradient(180deg,#17130f_0%,#0B0B0C_78%)]" />
        )}
        <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-bg to-transparent" />
      </div>

      <div className="wrap relative pb-16 w-full">
        <div className="flex items-center gap-2 text-[13px] text-gold font-semibold mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-gold" /> Featured tonight
        </div>
        <h1 className="font-display text-[clamp(40px,7vw,86px)] leading-[0.98] max-w-[15ch] mb-5">{movie.title}</h1>
        <div className="flex items-center gap-3.5 flex-wrap text-ink-dim text-[14.5px] mb-5">
          {movie.content_rating && <span className="border border-line rounded-[5px] px-2.5 py-0.5 text-[12.5px]">{movie.content_rating}</span>}
          <span>{movie.release_year}</span>
          {movie.runtime_minutes && <span className="border border-line rounded-[5px] px-2.5 py-0.5 text-[12.5px]">{formatRuntime(movie.runtime_minutes)}</span>}
        </div>
        {movie.synopsis && <p className="max-w-[52ch] text-ink-dim text-[16px] leading-relaxed mb-8">{movie.synopsis}</p>}
        <div className="flex gap-3 flex-wrap">
          <Link href={`/title/${movie.slug}`} className="btn btn-gold inline-flex items-center gap-2 bg-gold text-[#171412] font-semibold rounded-[7px] px-[18px] py-2.5 text-sm hover:bg-[#f0b25a]">
            <Play size={16} fill="currentColor" /> Watch now
          </Link>
          <Link href={`/title/${movie.slug}`} className="inline-flex items-center gap-2 border border-line rounded-[7px] px-[18px] py-2.5 text-sm font-semibold hover:border-ink-dim">
            <Info size={16} /> More info
          </Link>
          <WatchlistButton contentType="movie" contentId={movie.id} />
        </div>
      </div>
    </section>
  );
}
