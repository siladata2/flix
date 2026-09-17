import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { ReelsViewer } from '@/components/ReelsViewer';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Reel } from '@/lib/types/database';

export const metadata: Metadata = { title: 'Reels' };

export default async function ReelsPage() {
  const supabase = createClient();
  const { data } = await supabase.from('reels').select('*').eq('is_published', true).order('created_at', { ascending: false }).limit(30);
  const reels = (data ?? []) as Reel[];

  if (reels.length === 0) {
    return (
      <div className="wrap pt-32 pb-20">
        <EmptyState title="No reels published yet" message="Approved, published reels will appear here as a swipeable feed." />
      </div>
    );
  }

  return <ReelsViewer reels={reels} />;
}
