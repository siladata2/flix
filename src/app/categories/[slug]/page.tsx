import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { MovieCard } from '@/components/home/MovieCard';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Movie } from '@/lib/types/database';

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data: category } = await supabase.from('categories').select('*').eq('slug', params.slug).maybeSingle();
  if (!category) notFound();

  const { data: movies } = await supabase
    .from('movies')
    .select('*, content_categories!inner(categories!inner(slug))')
    .eq('is_published', true)
    .eq('content_categories.categories.slug', params.slug);

  return (
    <div className="wrap pt-32 pb-20">
      <h1 className="font-display text-3xl mb-2">{category.name}</h1>
      {category.description && <p className="text-ink-faint mb-8">{category.description}</p>}
      {(movies ?? []).length === 0 ? (
        <EmptyState title="Nothing here yet" message="Titles tagged with this category will appear here." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {(movies as Movie[]).map((m) => <MovieCard key={m.id} movie={m} />)}
        </div>
      )}
    </div>
  );
}
