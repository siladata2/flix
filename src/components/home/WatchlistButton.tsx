'use client';
import { useState, useTransition } from 'react';
import { Plus, Check } from 'lucide-react';
import { useToast } from '@/components/ui/Toaster';
import type { ContentType } from '@/lib/types/database';

export function WatchlistButton({ contentType, contentId, initialSaved = false }: { contentType: ContentType; contentId: string; initialSaved?: boolean }) {
  const [saved, setSaved] = useState(initialSaved);
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  function toggle() {
    startTransition(async () => {
      const res = await fetch('/api/watchlist', {
        method: saved ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content_type: contentType, content_id: contentId }),
      });
      if (res.status === 401) {
        toast('Sign in to save titles to your list');
        return;
      }
      if (!res.ok) {
        toast('Could not update your list — try again');
        return;
      }
      setSaved((s) => !s);
      toast(saved ? 'Removed from My List' : 'Added to My List');
    });
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className="inline-flex items-center gap-2 border border-line rounded-[7px] px-[18px] py-2.5 text-sm font-semibold hover:border-ink-dim disabled:opacity-50"
    >
      {saved ? <Check size={16} /> : <Plus size={16} />} My List
    </button>
  );
}
