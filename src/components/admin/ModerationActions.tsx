'use client';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function ModerationActions({ table, id }: { table: 'reels' | 'recaps'; id: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function act(status: 'published' | 'unpublished') {
    startTransition(async () => {
      const supabase = createClient();
      await supabase.from(table).update({ status, is_published: status === 'published' }).eq('id', id);
      router.refresh();
    });
  }

  return (
    <div className="flex gap-2 justify-end">
      <button disabled={pending} onClick={() => act('published')} className="text-xs font-semibold text-gold">Approve</button>
      <button disabled={pending} onClick={() => act('unpublished')} className="text-xs font-semibold text-brand">Reject</button>
    </div>
  );
}
