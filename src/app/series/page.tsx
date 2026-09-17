import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { SeriesCard } from '@/components/home/SeriesCard';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Series } from '@/lib/types/database';

export const metadata: Metadata = { title: 'Series' };

export default async function SeriesListPage() {
  const supabase = createClient();
  const { data } = await supabase.from('series').select('*').eq('is_published', true).order('created_at', { ascending: false });
  const series = (data ?? []) as Series[];

  return (
    <div className="wrap pt-32 pb-20">
      <h1 className="font-display text-3xl mb-6">Series</h1>
      {series.length === 0 ? (
        <EmptyState title="No series published yet" message="Publish a series with at least one season and episode from the admin dashboard." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {series.map((s) => <SeriesCard key={s.id} series={s} />)}
        </div>
      )}
    </div>
  );
}
