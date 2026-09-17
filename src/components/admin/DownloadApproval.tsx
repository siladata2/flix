'use client';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { AuthorizationStatus } from '@/lib/types/database';

// approved_by/approved_at are set here client-side for display purposes;
// the RLS policy (download_options_staff_update) is the actual gate on who
// can write this row, so a non-staff session's attempt is rejected regardless.
export function DownloadApproval({ id, status }: { id: string; status: AuthorizationStatus }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function set(next: AuthorizationStatus) {
    startTransition(async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('download_options').update({
        authorization_status: next,
        is_active: next === 'approved',
        approved_by: user?.id ?? null,
        approved_at: next === 'approved' ? new Date().toISOString() : null,
      }).eq('id', id);
      router.refresh();
    });
  }

  if (status === 'approved') {
    return <button disabled={pending} onClick={() => set('revoked')} className="text-xs font-semibold text-brand">Revoke</button>;
  }
  return (
    <div className="flex gap-2 justify-end">
      <button disabled={pending} onClick={() => set('approved')} className="text-xs font-semibold text-gold">Approve</button>
      <button disabled={pending} onClick={() => set('rejected')} className="text-xs font-semibold text-brand">Reject</button>
    </div>
  );
}
