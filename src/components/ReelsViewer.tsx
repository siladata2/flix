
'use client';

import { useState, useRef } from 'react';
import {
  Heart,
  Bookmark,
  Share2,
  Flag,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toaster';
import type { Reel } from '@/lib/types/database';

export function ReelsViewer({
  reels,
  startIndex = 0,
}: {
  reels: Reel[];
  startIndex?: number;
}) {
  const [index, setIndex] = useState(startIndex);
  const [muted, setMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const toast = useToast();
  const reel = reels[index];

  function go(delta: number) {
    setIndex((i) =>
      Math.min(Math.max(i + delta, 0), reels.length - 1)
    );
  }

  async function like() {
    if (!reel) return;

    const res = await fetch('/api/likes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content_type: 'reel',
        content_id: reel.id,
      }),
    });

    if (res.status === 401) {
      toast('Sign in to like reels');
      return;
    }

    toast('Liked');
  }

  async function save() {
    if (!reel) return;

    const res = await fetch('/api/saved', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content_type: 'reel',
        content_id: reel.id,
      }),
    });

    if (res.status === 401) {
      toast('Sign in to save reels');
      return;
    }

    toast('Saved');
  }

  async function report() {
    if (!reel) return;

    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content_type: 'reel',
        content_id: reel.id,
        reason: 'user_reported',
      }),
    });

    if (res.status === 401) {
      toast('Sign in to report content');
      return;
    }

    toast('Thanks — our moderation team will review this');
  }

  async function share() {
    if (!reel) return;

    const url = `${window.location.origin}/reels/${reel.id}`;

    if (navigator.share) {
      try {
        await navigator.share({ url });
      } catch {
        // User cancelled sharing
      }
      return;
    }

    await navigator.clipboard.writeText(url);
    toast('Link copied');
  }

  if (!reel) return null;

  return (
    <div
      className="fixed inset-0 bg-black flex items-center justify-center pt-0 md:pt-16 pb-16 md:pb-0"
      ref={containerRef}
    >
      <div className="relative h-full md:h-[88vh] aspect-[9/16] bg-bg-card">
        <video
          key={reel.id}
          src={reel.video_url}
          poster={reel.thumbnail_url ?? undefined}
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted={muted}
          playsInline
          onClick={(e) => {
            e.currentTarget.paused
              ? e.currentTarget.play()
              : e.currentTarget.pause();
          }}
        />

        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <p className="text-white font-semibold text-sm mb-1">
            {reel.title}
          </p>

          {reel.description && (
            <p className="text-white/70 text-xs line-clamp-2">
              {reel.description}
            </p>
          )}
        </div>

        <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5">
          <button
            onClick={like}
            aria-label="Like"
            className="text-white flex flex-col items-center gap-1"
          >
            <Heart size={26} />
          </button>

          <button
            onClick={save}
            aria-label="Save"
            className="text-white flex flex-col items-center gap-1"
          >
            <Bookmark size={24} />
          </button>

          <button
            onClick={share}
            aria-label="Share"
            className="text-white flex flex-col items-center gap-1"
          >
            <Share2 size={24} />
          </button>

          <button
            onClick={report}
            aria-label="Report"
            className="text-white/70 flex flex-col items-center gap-1"
          >
            <Flag size={20} />
          </button>

          <button
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? 'Unmute' : 'Mute'}
            className="text-white flex flex-col items-center gap-1"
          >
            {muted ? (
              <VolumeX size={22} />
            ) : (
              <Volume2 size={22} />
            )}
          </button>
        </div>

        <button
          onClick={() => go(-1)}
          disabled={index === 0}
          className="hidden md:block absolute -left-14 top-1/2 -translate-y-1/2 text-white/60 disabled:opacity-20"
        >
          ▲
        </button>

        <button
          onClick={() => go(1)}
          disabled={index === reels.length - 1}
          className="hidden md:block absolute -left-14 top-[60%] -translate-y-1/2 text-white/60 disabled:opacity-20"
        >
          ▼
        </button>
      </div>
    </div>
  );
}
