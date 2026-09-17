import { createClient } from '@/lib/supabase/server';
import { DataTable } from '@/components/admin/DataTable';
import { PublishToggle } from '@/components/admin/PublishToggle';

export default async function AdminEpisodesPage() {
  const supabase = createClient();
  const { data: episodes } = await supabase.from('episodes').select('*, series(title), seasons(season_number)').order('created_at', { ascending: false }).limit(100);

  return (
    <div>
      <h1 className="font-display text-2xl mb-6">Episodes</h1>
      <DataTable
        columns={['Series', 'Season', 'Ep #', 'Title', 'Published']}
        rows={episodes ?? []}
        emptyMessage="No episodes yet."
        renderRow={(e: any) => (
          <tr key={e.id}>
            <td className="px-4 py-3 font-medium">{e.series?.title}</td>
            <td className="px-4 py-3 text-ink-faint">{e.seasons?.season_number}</td>
            <td className="px-4 py-3 text-ink-faint">{e.episode_number}</td>
            <td className="px-4 py-3">{e.title}</td>
            <td className="px-4 py-3"><PublishToggle table="episodes" id={e.id} isPublished={e.is_published} /></td>
          </tr>
        )}
      />
    </div>
  );
}
