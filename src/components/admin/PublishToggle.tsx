'use client';
import { useState, useTransition } from 'react';
import { createClient } from '@/lib/supabase/client';

export function PublishToggle({ table, id, isPublished }: { table: 'movies' | 'series' | 'episodes' | 'reels' | 'recaps'; id: string; isPublished: boolean }) {
  const [published, setPublished] = useState(isPublished);
  const [pending, startTransition] = useTransition();

  function toggle() {
    startTransition(async () => {
      const supabase = createClient();
      // Staff-only per RLS (<table>_staff_update); silently no-ops for
      // under-privileged sessions since the policy simply rejects the write.
      const { error } = await supabase.from(table).update({ is_published: !published, status: !published ? 'published' : 'unpublished' }).eq('id', id);
      if (!error) setPublished((p) => !p);
    });
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${published ? 'border-gold text-gold' : 'border-line text-ink-faint'}`}
    >
      {published ? 'Published' : 'Draft'}
    </button>
  );
}
