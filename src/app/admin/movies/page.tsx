import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { DataTable } from '@/components/admin/DataTable';
import { PublishToggle } from '@/components/admin/PublishToggle';

export default async function AdminMoviesPage() {
  const supabase = createClient();
  const { data: movies } = await supabase.from('movies').select('*').order('created_at', { ascending: false }).limit(100);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl">Movies</h1>
        <Link href="/admin/movies/new" className="bg-gold text-[#171412] font-semibold rounded-lg px-4 py-2 text-sm hover:bg-[#f0b25a]">
          + Add movie
        </Link>
      </div>

      <DataTable
        columns={['Title', 'Year', 'Status', 'Featured', 'Published', '']}
        rows={movies ?? []}
        emptyMessage="No movies yet — add your first one."
        renderRow={(m) => (
          <tr key={m.id}>
            <td className="px-4 py-3 font-medium">{m.title}</td>
            <td className="px-4 py-3 text-ink-faint">{m.release_year}</td>
            <td className="px-4 py-3 text-ink-faint capitalize">{m.status}</td>
            <td className="px-4 py-3">{m.is_featured ? '★' : ''}</td>
            <td className="px-4 py-3"><PublishToggle table="movies" id={m.id} isPublished={m.is_published} /></td>
            <td className="px-4 py-3 text-right">
              <Link href={`/admin/movies/${m.id}/edit`} className="text-gold text-sm font-semibold">Edit</Link>
            </td>
          </tr>
        )}
      />
    </div>
  );
}
