'use client';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { ReportStatus } from '@/lib/types/database';

export function ReportResolution({ id, status }: { id: string; status: ReportStatus }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function set(next: ReportStatus) {
    startTransition(async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('reports').update({ status: next, reviewed_by: user?.id, reviewed_at: new Date().toISOString() }).eq('id', id);
      router.refresh();
    });
  }

  if (status === 'resolved' || status === 'dismissed') return <span className="text-ink-faint text-xs">Closed</span>;

  return (
    <div className="flex gap-2 justify-end">
      <button disabled={pending} onClick={() => set('resolved')} className="text-xs font-semibold text-gold">Resolve</button>
      <button disabled={pending} onClick={() => set('dismissed')} className="text-xs font-semibold text-ink-faint">Dismiss</button>
    </div>
  );
}
