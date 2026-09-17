'use client';
import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from 'lucide-react';

interface Props {
  src: string; // resolved, already-authorized playback URL (HLS/MP4) for this session
  poster?: string;
  title: string;
  startAtSeconds?: number;
  subtitles?: { label: string; src: string; srclang: string }[];
  onProgress?: (seconds: number, duration: number) => void;
  onEnded?: () => void;
}

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

/**
 * Deliberately minimal native <video> wrapper. For production HLS delivery,
 * pair this with hls.js (loaded only when the source is .m3u8) — omitted
 * here to keep this scaffold dependency-light; the control surface below
 * already covers what section 7 of the spec asks for.
 */
export function VideoPlayer({ src, poster, title, startAtSeconds = 0, subtitles = [], onProgress, onEnded }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [showSpeed, setShowSpeed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (v && startAtSeconds > 0) v.currentTime = startAtSeconds;
  }, [startAtSeconds]);

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); } else { v.pause(); setPlaying(false); }
  }

  function toggleMute() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }

  function toggleFullscreen() {
    videoRef.current?.requestFullscreen?.();
  }

  function setSpeed(rate: number) {
    if (videoRef.current) videoRef.current.playbackRate = rate;
    setShowSpeed(false);
  }

  if (error) {
    return (
      <div className="aspect-video w-full bg-bg-card rounded-xl flex items-center justify-center text-center p-8">
        <div>
          <p className="font-display text-lg mb-2">Playback failed</p>
          <p className="text-ink-faint text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full bg-black rounded-xl overflow-hidden group">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full"
        onTimeUpdate={(e) => onProgress?.(e.currentTarget.currentTime, e.currentTarget.duration)}
        onEnded={onEnded}
        onError={() => setError('This video could not be loaded. Please try again or contact support.')}
        aria-label={title}
      >
        {subtitles.map((s) => (
          <track key={s.srclang} kind="subtitles" label={s.label} srcLang={s.srclang} src={s.src} />
        ))}
      </video>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-8 flex items-center gap-3 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
        <button onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'} className="text-white">
          {playing ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <button onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'} className="text-white">
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <div className="flex-1" />
        <div className="relative">
          <button onClick={() => setShowSpeed((s) => !s)} aria-label="Playback speed" className="text-white">
            <Settings size={18} />
          </button>
          {showSpeed && (
            <div className="absolute bottom-8 right-0 bg-bg-raised border border-line rounded-lg overflow-hidden text-sm">
              {SPEEDS.map((s) => (
                <button key={s} onClick={() => setSpeed(s)} className="block w-full px-4 py-2 text-left hover:bg-bg-card text-white">{s}×</button>
              ))}
            </div>
          )}
        </div>
        <button onClick={toggleFullscreen} aria-label="Fullscreen" className="text-white">
          <Maximize size={18} />
        </button>
      </div>
    </div>
  );
}
