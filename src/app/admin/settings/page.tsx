import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { AppSettingsForm } from '@/components/admin/AppSettingsForm';

export default async function AdminSettingsPage() {
  await requireRole('admin');
  const supabase = createClient();
  const { data: settings } = await supabase.from('app_settings').select('*');

  return (
    <div>
      <h1 className="font-display text-2xl mb-6">App settings</h1>
      <AppSettingsForm settings={settings ?? []} />
    </div>
  );
}
