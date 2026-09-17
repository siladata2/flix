'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { UserRole } from '@/lib/types/database';

const ROLES: UserRole[] = ['user', 'moderator', 'editor', 'admin', 'super_admin'];

// Role changes go through profiles_admin_manage in RLS — only an admin/super_admin
// session can actually write here; anyone else's attempt is rejected server-side.
export function RoleSelect({ userId, currentRole }: { userId: string; currentRole: UserRole }) {
  const [role, setRole] = useState(currentRole);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function change(next: UserRole) {
    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.from('profiles').update({ role: next }).eq('user_id', userId);
      if (!error) { setRole(next); router.refresh(); }
    });
  }

  return (
    <select value={role} disabled={pending} onChange={(e) => change(e.target.value as UserRole)} className="bg-bg-card border border-line rounded-md px-2 py-1 text-xs capitalize">
      {ROLES.map((r) => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
    </select>
  );
}
