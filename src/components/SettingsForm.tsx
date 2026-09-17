'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/Toaster';
import type { Profile } from '@/lib/types/database';

const LANGUAGES = ['en', 'sw', 'fr', 'es', 'pt'];

export function SettingsForm({ profile }: { profile: Profile }) {
  const [language, setLanguage] = useState(profile.preferred_language);
  const [notifyEpisodes, setNotifyEpisodes] = useState(true);
  const [notifyReleases, setNotifyReleases] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  async function save() {
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from('profiles').update({ preferred_language: language }).eq('id', profile.id);
    // notification preferences would be persisted to a notification_preferences
    // table in a full build — omitted here to stay within this scaffold's scope.
    setSaving(false);
    toast(error ? 'Could not save settings' : 'Settings saved');
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="bg-bg-raised border border-line rounded-2xl p-6">
        <h2 className="font-display text-lg mb-4">Language</h2>
        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-bg-card border border-line rounded-lg px-3.5 py-2.5 text-sm">
          {LANGUAGES.map((l) => <option key={l} value={l}>{l.toUpperCase()}</option>)}
        </select>
      </section>

      <section className="bg-bg-raised border border-line rounded-2xl p-6">
        <h2 className="font-display text-lg mb-4">Notifications</h2>
        <label className="flex items-center gap-3 mb-3 text-sm">
          <input type="checkbox" checked={notifyEpisodes} onChange={(e) => setNotifyEpisodes(e.target.checked)} /> New episode alerts
        </label>
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" checked={notifyReleases} onChange={(e) => setNotifyReleases(e.target.checked)} /> New movie releases
        </label>
      </section>

      <button onClick={save} disabled={saving} className="self-start bg-gold text-[#171412] font-semibold rounded-lg px-5 py-2.5 text-sm hover:bg-[#f0b25a] disabled:opacity-50">
        {saving ? 'Saving…' : 'Save settings'}
      </button>
    </div>
  );
}
