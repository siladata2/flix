import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { MovieCard } from '@/components/home/MovieCard';
import { SeriesCard } from '@/components/home/SeriesCard';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Movie, Series } from '@/lib/types/database';

export const metadata: Metadata = { title: 'Search' };

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q?.trim() ?? '';
  const supabase = createClient();

  let movies: Movie[] = [];
  let series: Series[] = [];

  if (q.length >= 2) {
    const like = `%${q}%`;
    const [m, s] = await Promise.all([
      supabase.from('movies').select('*').eq('is_published', true).ilike('title', like).limit(24),
      supabase.from('series').select('*').eq('is_published', true).ilike('title', like).limit(24),
    ]);
    movies = (m.data ?? []) as Movie[];
    series = (s.data ?? []) as Series[];
  }

  return (
    <div className="wrap pt-32 pb-20">
      <form action="/search" className="mb-8">
        <input
          name="q"
          defaultValue={q}
          type="text"
          placeholder="Search movies, series..."
          className="w-full max-w-xl bg-bg-card border border-line rounded-lg px-4 py-3 text-sm outline-none focus:border-gold/60"
        />
      </form>

      {q.length < 2 ? (
        <p className="text-ink-faint">Type at least 2 characters to search.</p>
      ) : movies.length === 0 && series.length === 0 ? (
        <EmptyState title={`No results for "${q}"`} message="Try a different title or check the spelling." />
      ) : (
        <>
          {movies.length > 0 && (
            <div className="mb-10">
              <h2 className="font-display text-xl mb-4">Movies</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {movies.map((m) => <MovieCard key={m.id} movie={m} />)}
              </div>
            </div>
          )}
          {series.length > 0 && (
            <div>
              <h2 className="font-display text-xl mb-4">Series</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {series.map((s) => <SeriesCard key={s.id} series={s} />)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
