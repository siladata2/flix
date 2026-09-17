import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ReelsViewer } from '@/components/ReelsViewer';
import type { Reel } from '@/lib/types/database';

export default async function SingleReelPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: reels } = await supabase.from('reels').select('*').eq('is_published', true).order('created_at', { ascending: false }).limit(30);
  const list = (reels ?? []) as Reel[];
  const startIndex = list.findIndex((r) => r.id === params.id);
  if (startIndex === -1) notFound();

  return <ReelsViewer reels={list} startIndex={startIndex} />;
}
