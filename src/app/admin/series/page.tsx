import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { DataTable } from '@/components/admin/DataTable';
import { PublishToggle } from '@/components/admin/PublishToggle';

export default async function AdminSeriesPage() {
  const supabase = createClient();
  const { data: series } = await supabase.from('series').select('*').order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl">Series</h1>
        <p className="text-ink-faint text-xs">Add/edit forms follow the same pattern as Movies — see <code>MovieForm.tsx</code> to replicate as <code>SeriesForm.tsx</code>.</p>
      </div>
      <DataTable
        columns={['Title', 'Status', 'Featured', 'Published']}
        rows={series ?? []}
        emptyMessage="No series yet."
        renderRow={(s) => (
          <tr key={s.id}>
            <td className="px-4 py-3 font-medium">{s.title}</td>
            <td className="px-4 py-3 text-ink-faint capitalize">{s.status}</td>
            <td className="px-4 py-3">{s.is_featured ? '★' : ''}</td>
            <td className="px-4 py-3"><PublishToggle table="series" id={s.id} isPublished={s.is_published} /></td>
          </tr>
        )}
      />
    </div>
  );
}
