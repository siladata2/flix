'use client';
import { useState } from 'react';
import { Download } from 'lucide-react';
import { formatFileSize } from '@/lib/utils';
import { useToast } from '@/components/ui/Toaster';
import type { DownloadOption } from '@/lib/types/database';

export function DownloadList({ options, isAuthenticated }: { options: DownloadOption[]; isAuthenticated: boolean }) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const toast = useToast();

  async function requestDownload(option: DownloadOption) {
    if (!isAuthenticated) {
      window.location.href = `/login?redirectTo=${window.location.pathname}`;
      return;
    }
    setPendingId(option.id);
    try {
      const res = await fetch(`/api/downloads/${option.id}/authorize`, { method: 'POST' });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        toast(body.error ?? 'This download is not available right now.');
        return;
      }
      const { url, expiresAt } = await res.json();
      toast(`Download ready — link expires ${new Date(expiresAt).toLocaleTimeString()}`);
      window.location.href = url;
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {options.map((o) => (
        <div key={o.id} className="flex items-center gap-4 p-3 rounded-lg border border-line bg-bg-card">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">{o.quality} · {o.format.toUpperCase()}</p>
            <p className="text-ink-faint text-xs">
              {formatFileSize(o.file_size_bytes)}{o.language ? ` · ${o.language}` : ''}{o.subtitle_language ? ` · subs: ${o.subtitle_language}` : ''}
            </p>
          </div>
          <button
            onClick={() => requestDownload(o)}
            disabled={pendingId === o.id}
            className="inline-flex items-center gap-2 border border-line rounded-[7px] px-4 py-2 text-sm font-semibold hover:border-ink-dim disabled:opacity-50"
          >
            <Download size={15} /> {pendingId === o.id ? 'Preparing…' : 'Download'}
          </button>
        </div>
      ))}
    </div>
  );
}
