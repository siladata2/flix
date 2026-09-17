import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Recap } from '@/lib/types/database';

export const metadata: Metadata = { title: 'Movie Recaps' };

export default async function RecapsPage() {
  const supabase = createClient();
  const { data } = await supabase.from('recaps').select('*').eq('is_published', true).order('created_at', { ascending: false });
  const recaps = (data ?? []) as Recap[];

  return (
    <div className="wrap pt-32 pb-20">
      <h1 className="font-display text-3xl mb-2">Movie recaps</h1>
      <p className="text-ink-faint mb-8">Catch the story in minutes — video and written recaps of SilaFlix titles.</p>

      {recaps.length === 0 ? (
        <EmptyState title="No recaps published yet" message="Video or written recaps will appear here once published." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recaps.map((r) => (
            <Link key={r.id} href={`/recaps/${r.slug}`} className="rounded-xl overflow-hidden border border-line bg-bg-card hover:border-gold/40 transition-colors">
              <div className="relative aspect-video bg-bg-raised">
                {r.thumbnail_url && <Image src={r.thumbnail_url} alt="" fill className="object-cover" />}
              </div>
              <div className="p-4">
                <h3 className="font-display text-base mb-1">{r.title}</h3>
                {r.description && <p className="text-ink-faint text-sm line-clamp-2">{r.description}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
