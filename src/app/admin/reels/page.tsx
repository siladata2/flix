import { createClient } from '@/lib/supabase/server';
import { DataTable } from '@/components/admin/DataTable';
import { ModerationActions } from '@/components/admin/ModerationActions';

export default async function AdminReelsPage() {
  const supabase = createClient();
  const { data: reels } = await supabase.from('reels').select('*, profiles(display_name)').order('created_at', { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl mb-6">Reels — moderation queue</h1>
      <DataTable
        columns={['Title', 'Creator', 'Status', '']}
        rows={reels ?? []}
        emptyMessage="No reels submitted yet."
        renderRow={(r: any) => (
          <tr key={r.id}>
            <td className="px-4 py-3 font-medium">{r.title}</td>
            <td className="px-4 py-3 text-ink-faint">{r.profiles?.display_name ?? '—'}</td>
            <td className="px-4 py-3 text-ink-faint capitalize">{r.status}</td>
            <td className="px-4 py-3 text-right"><ModerationActions table="reels" id={r.id} /></td>
          </tr>
        )}
      />
    </div>
  );
}
