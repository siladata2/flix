'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/Toaster';
import type { Profile } from '@/lib/types/database';

export function ProfileForm({ profile }: { profile: Profile }) {
  const [displayName, setDisplayName] = useState(profile.display_name ?? '');
  const [username, setUsername] = useState(profile.username ?? '');
  const [bio, setBio] = useState(profile.bio ?? '');
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  async function save() {
    setSaving(true);
    const supabase = createClient();
    // RLS (profiles_update_own) enforces this can only touch the caller's own row.
    const { error } = await supabase.from('profiles').update({ display_name: displayName, username, bio }).eq('id', profile.id);
    setSaving(false);
    toast(error ? 'Could not save changes' : 'Profile updated');
  }

  return (
    <div className="bg-bg-raised border border-line rounded-2xl p-6 flex flex-col gap-4">
      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gold to-brand" />
      <div>
        <label className="block text-[12.5px] text-ink-dim mb-1.5">Display name</label>
        <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full bg-bg-card border border-line rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-gold/60" />
      </div>
      <div>
        <label className="block text-[12.5px] text-ink-dim mb-1.5">Username</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-bg-card border border-line rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-gold/60" />
      </div>
      <div>
        <label className="block text-[12.5px] text-ink-dim mb-1.5">Bio</label>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="w-full bg-bg-card border border-line rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-gold/60" />
      </div>
      <button onClick={save} disabled={saving} className="self-start bg-gold text-[#171412] font-semibold rounded-lg px-5 py-2.5 text-sm hover:bg-[#f0b25a] disabled:opacity-50">
        {saving ? 'Saving…' : 'Save changes'}
      </button>
    </div>
  );
}
