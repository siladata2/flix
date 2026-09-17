import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { MovieCard } from '@/components/home/MovieCard';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Movie } from '@/lib/types/database';

export const metadata: Metadata = { title: 'Movies' };

const PAGE_SIZE = 24;

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: { genre?: string; language?: string; year?: string; sort?: string; page?: string };
}) {
  const supabase = createClient();
  const page = Math.max(1, Number(searchParams.page) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase.from('movies').select('*', { count: 'exact' }).eq('is_published', true);

  if (searchParams.language) query = query.eq('language', searchParams.language);
  if (searchParams.year) query = query.eq('release_year', Number(searchParams.year));

  if (searchParams.genre) {
    query = supabase
      .from('movies')
      .select('*, content_categories!inner(categories!inner(slug))', { count: 'exact' })
      .eq('is_published', true)
      .eq('content_categories.categories.slug', searchParams.genre);
  }

  query = searchParams.sort === 'newest'
    ? query.order('created_at', { ascending: false })
    : query.order('view_count', { ascending: false });

  const { data, count } = await query.range(from, to);
  const movies = (data ?? []) as Movie[];
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  return (
    <div className="wrap pt-32 pb-20">
      <h1 className="font-display text-3xl mb-6">Movies</h1>

      <form className="flex flex-wrap gap-3 mb-8" action="/movies">
        <select name="genre" defaultValue={searchParams.genre ?? ''} className="bg-bg-card border border-line rounded-lg px-3 py-2 text-sm">
          <option value="">All genres</option>
          <option value="thriller">Thriller</option>
          <option value="drama">Drama</option>
          <option value="sci-fi">Sci-Fi</option>
          <option value="comedy">Comedy</option>
          <option value="african-cinema">African Cinema</option>
          <option value="documentary">Documentary</option>
        </select>
        <select name="sort" defaultValue={searchParams.sort ?? ''} className="bg-bg-card border border-line rounded-lg px-3 py-2 text-sm">
          <option value="">Most popular</option>
          <option value="newest">Newest</option>
        </select>
        <button type="submit" className="border border-line rounded-lg px-4 py-2 text-sm font-semibold hover:border-ink-dim">Apply</button>
      </form>

      {movies.length === 0 ? (
        <EmptyState title="No movies match these filters" message="Try a different genre or clear the filters to see everything published." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {movies.map((m) => <MovieCard key={m.id} movie={m} />)}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: totalPages }).map((_, i) => (
            <a
              key={i}
              href={`/movies?${new URLSearchParams({ ...searchParams, page: String(i + 1) }).toString()}`}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm border ${page === i + 1 ? 'border-gold text-gold' : 'border-line text-ink-faint'}`}
            >
              {i + 1}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
