'use client';
import { useState } from 'react';
import { Play } from 'lucide-react';
import { VideoPlayer } from './VideoPlayer';

/**
 * Fetches a short-lived, authorized playback URL from the server (which
 * verifies the caller's entitlement + the source's active status) rather
 * than ever embedding a raw provider URL in page HTML.
 */
export function PlayButton({ contentType, contentId, title, poster }: { contentType: 'movie' | 'episode'; contentId: string; title: string; poster?: string }) {
  const [playbackUrl, setPlaybackUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function play() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/playback?type=${contentType}&id=${contentId}`);
      if (res.status === 401) { window.location.href = `/login?redirectTo=${window.location.pathname}`; return; }
      if (!res.ok) { setError('This title is not available to play right now.'); return; }
      const { url } = await res.json();
      setPlaybackUrl(url);
    } finally {
      setLoading(false);
    }
  }

  if (playbackUrl) return <VideoPlayer src={playbackUrl} title={title} poster={poster} />;

  return (
    <div>
      <button
        onClick={play}
        disabled={loading}
        className="inline-flex items-center gap-2 bg-gold text-[#171412] font-semibold rounded-[7px] px-[18px] py-2.5 text-sm hover:bg-[#f0b25a] disabled:opacity-50"
      >
        <Play size={16} fill="currentColor" /> {loading ? 'Loading…' : 'Watch now'}
      </button>
      {error && <p className="text-brand text-sm mt-2">{error}</p>}
    </div>
  );
}
