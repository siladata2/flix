'use client';
import { Share2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toaster';

export function ShareButton({ title }: { title: string }) {
  const toast = useToast();

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title, url }); } catch { /* user cancelled */ }
      return;
    }
    await navigator.clipboard.writeText(url);
    toast('Link copied to clipboard');
  }

  return (
    <button onClick={share} className="inline-flex items-center gap-2 border border-line rounded-[7px] px-[18px] py-2.5 text-sm font-semibold hover:border-ink-dim">
      <Share2 size={16} /> Share
    </button>
  );
}
