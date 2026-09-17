import { createClient } from '@/lib/supabase/server';
import { StatCard } from '@/components/admin/StatCard';

export default async function AdminDashboardPage() {
  const supabase = createClient();

  const [movies, series, episodes, reels, recaps, users, pendingReports, publishedMovies] = await Promise.all([
    supabase.from('movies').select('id', { count: 'exact', head: true }),
    supabase.from('series').select('id', { count: 'exact', head: true }),
    supabase.from('episodes').select('id', { count: 'exact', head: true }),
    supabase.from('reels').select('id', { count: 'exact', head: true }),
    supabase.from('recaps').select('id', { count: 'exact', head: true }),
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('reports').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('movies').select('id', { count: 'exact', head: true }).eq('is_published', true),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total users" value={users.count ?? 0} />
        <StatCard label="Total movies" value={movies.count ?? 0} />
        <StatCard label="Published movies" value={publishedMovies.count ?? 0} />
        <StatCard label="Total series" value={series.count ?? 0} />
        <StatCard label="Total episodes" value={episodes.count ?? 0} />
        <StatCard label="Total reels" value={reels.count ?? 0} />
        <StatCard label="Total recaps" value={recaps.count ?? 0} />
        <StatCard label="Pending reports" value={pendingReports.count ?? 0} />
      </div>
      <p className="text-ink-faint text-sm">
        View counts and download-activity charts belong here once an analytics pipeline (e.g. logging playback events to a table and aggregating) is wired up — see <code>/admin/analytics</code> for the stub.
      </p>
    </div>
  );
}
