import { createClient } from '@/lib/supabase/server';
import { HeroBanner } from '@/components/home/HeroBanner';
import { ContentRow } from '@/components/home/ContentRow';
import { MovieCard } from '@/components/home/MovieCard';
import { SeriesCard } from '@/components/home/SeriesCard';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Movie, Series } from '@/lib/types/database';

export const revalidate = 60; // homepage sections refresh at most once a minute

async function getHomeData() {
  const supabase = createClient();

  const [featured, trending, popularSeries, latest, africanCinema] = await Promise.all([
    supabase.from('movies').select('*').eq('is_published', true).eq('is_featured', true).order('updated_at', { ascending: false }).limit(1).maybeSingle(),
    supabase.from('movies').select('*').eq('is_published', true).order('view_count', { ascending: false }).limit(12),
    supabase.from('series').select('*').eq('is_published', true).order('view_count', { ascending: false } as never).limit(12),
    supabase.from('movies').select('*').eq('is_published', true).order('created_at', { ascending: false }).limit(12),
    supabase
      .from('movies')
      .select('*, content_categories!inner(categories!inner(slug))')
      .eq('is_published', true)
      .eq('content_categories.categories.slug', 'african-cinema')
      .limit(12),
  ]);

  return {
    featured: featured.data as Movie | null,
    trending: (trending.data ?? []) as Movie[],
    popularSeries: (popularSeries.data ?? []) as Series[],
    latest: (latest.data ?? []) as Movie[],
    africanCinema: (africanCinema.data ?? []) as Movie[],
  };
}

export default async function HomePage() {
  const { featured, trending, popularSeries, latest, africanCinema } = await getHomeData();

  return (
    <>
      {featured ? (
        <HeroBanner movie={featured} />
      ) : (
        <div className="wrap pt-40 pb-10">
          <EmptyState
            title="No featured title yet"
            message="Once an admin marks a movie as featured and published, it will appear here as the homepage hero."
          />
        </div>
      )}

      {/* Continue Watching and Recommended For You render per-user data —
          see src/app/(authenticated sections) / ContinueWatchingRow for the
          client-side variant used once a session exists. */}

      <ContentRow title="Trending movies" seeAllHref="/movies">
        {trending.length
          ? trending.map((m) => <MovieCard key={m.id} movie={m} />)
          : <EmptyState title="Nothing trending yet" message="Published movies with views will appear here." />}
      </ContentRow>

      <ContentRow title="Popular series" seeAllHref="/series">
        {popularSeries.length
          ? popularSeries.map((s) => <SeriesCard key={s.id} series={s} />)
          : <EmptyState title="No series published yet" message="Publish a series from the admin dashboard to feature it here." />}
      </ContentRow>

      <ContentRow title="Latest releases" seeAllHref="/movies?sort=newest">
        {latest.length
          ? latest.map((m) => <MovieCard key={m.id} movie={m} />)
          : <EmptyState title="Nothing new yet" message="Newly published movies show up here first." />}
      </ContentRow>

      <ContentRow title="African cinema" seeAllHref="/categories/african-cinema">
        {africanCinema.length
          ? africanCinema.map((m) => <MovieCard key={m.id} movie={m} />)
          : <EmptyState title="No titles tagged yet" message="Tag a published movie with the African Cinema category to feature it here." />}
      </ContentRow>
    </>
  );
}
