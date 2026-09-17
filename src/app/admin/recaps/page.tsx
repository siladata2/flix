import { createClient } from '@/lib/supabase/server';
import { DataTable } from '@/components/admin/DataTable';
import { PublishToggle } from '@/components/admin/PublishToggle';

export default async function AdminRecapsPage() {
  const supabase = createClient();
  const { data: recaps } = await supabase.from('recaps').select('*').order('created_at', { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl mb-6">Recaps</h1>
      <DataTable
        columns={['Title', 'Language', 'Status', 'Published']}
        rows={recaps ?? []}
        emptyMessage="No recaps yet."
        renderRow={(r) => (
          <tr key={r.id}>
            <td className="px-4 py-3 font-medium">{r.title}</td>
            <td className="px-4 py-3 text-ink-faint">{r.language}</td>
            <td className="px-4 py-3 text-ink-faint capitalize">{r.status}</td>
            <td className="px-4 py-3"><PublishToggle table="recaps" id={r.id} isPublished={r.is_published} /></td>
          </tr>
        )}
      />
    </div>
  );
}
