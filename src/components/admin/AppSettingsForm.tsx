'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/Toaster';

interface Setting { id: string; setting_key: string; setting_value: any; }

// Writes are gated by RLS (app_settings_admin_write) — only admin/super_admin.
export function AppSettingsForm({ settings }: { settings: Setting[] }) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(settings.map((s) => [s.setting_key, typeof s.setting_value === 'string' ? s.setting_value : JSON.stringify(s.setting_value)]))
  );
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  async function save() {
    setSaving(true);
    const supabase = createClient();
    for (const s of settings) {
      await supabase.from('app_settings').update({ setting_value: values[s.setting_key], updated_at: new Date().toISOString() }).eq('id', s.id);
    }
    setSaving(false);
    toast('Settings saved');
  }

  return (
    <div className="max-w-xl flex flex-col gap-4">
      {settings.map((s) => (
        <div key={s.id}>
          <label className="block text-[12.5px] text-ink-dim mb-1.5 capitalize">{s.setting_key.replace(/_/g, ' ')}</label>
          <input
            value={values[s.setting_key] ?? ''}
            onChange={(e) => setValues((v) => ({ ...v, [s.setting_key]: e.target.value }))}
            className="w-full bg-bg-card border border-line rounded-lg px-3.5 py-2.5 text-sm"
          />
        </div>
      ))}
      <button onClick={save} disabled={saving} className="self-start bg-gold text-[#171412] font-semibold rounded-lg px-6 py-2.5 text-sm hover:bg-[#f0b25a] disabled:opacity-50">
        {saving ? 'Saving…' : 'Save settings'}
      </button>
    </div>
  );
}
