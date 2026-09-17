import Link from 'next/link';
import Image from 'next/image';
import type { Movie } from '@/lib/types/database';

export function MovieCard({ movie }: { movie: Pick<Movie, 'title' | 'slug' | 'poster_url' | 'release_year' | 'runtime_minutes' | 'content_rating'> }) {
  return (
    <Link
      href={`/title/${movie.slug}`}
      className="group relative flex-none w-[190px] rounded-[10px] overflow-hidden border border-line bg-bg-card scroll-snap-align-start transition-transform hover:-translate-y-1.5 hover:border-gold/40"
    >
      <div className="relative aspect-[2/3] w-full bg-bg-raised">
        {movie.poster_url ? (
          <Image src={movie.poster_url} alt={`${movie.title} poster`} fill sizes="190px" className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-3">
            <span className="font-display text-sm text-center text-ink-dim">{movie.title}</span>
          </div>
        )}
        {movie.content_rating && (
          <span className="absolute top-2 left-2 text-[10.5px] font-semibold bg-bg/70 border border-white/15 px-1.5 py-0.5 rounded">
            {movie.content_rating}
          </span>
        )}
      </div>
      <div className="px-3 py-2.5 flex justify-between text-[12px] text-ink-faint">
        <span className="truncate">{movie.title}</span>
        <span className="flex-none ml-2">{movie.release_year}</span>
      </div>
    </Link>
  );
}
