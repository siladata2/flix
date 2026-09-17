'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { slugify } from '@/lib/utils';
import { movieInputSchema } from '@/lib/validations';
import type { Movie } from '@/lib/types/database';

export function MovieForm({ movie }: { movie?: Movie }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: movie?.title ?? '',
    slug: movie?.slug ?? '',
    synopsis: movie?.synopsis ?? '',
    poster_url: movie?.poster_url ?? '',
    backdrop_url: movie?.backdrop_url ?? '',
    trailer_url: movie?.trailer_url ?? '',
    director: movie?.director ?? '',
    release_year: movie?.release_year ?? new Date().getFullYear(),
    runtime_minutes: movie?.runtime_minutes ?? 90,
    language: movie?.language ?? 'English',
    content_rating: movie?.content_rating ?? '',
    is_featured: movie?.is_featured ?? false,
    is_published: movie?.is_published ?? false,
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = movieInputSchema.safeParse(form);
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? 'Please check the form'); return; }

    setSaving(true);
    const res = movie
      ? await fetch(`/api/movies/${movie.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsed.data) })
      : await fetch('/api/movies', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsed.data) });
    setSaving(false);

    if (!res.ok) { const body = await res.json().catch(() => ({})); setError(body.error?.formErrors?.[0] ?? body.error ?? 'Save failed'); return; }
    router.push('/admin/movies');
    router.refresh();
  }

  function field<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Title" value={form.title} onChange={(v) => { field('title', v); if (!movie) field('slug', slugify(v)); }} required />
        <Input label="Slug" value={form.slug} onChange={(v) => field('slug', v)} required />
      </div>
      <Textarea label="Synopsis" value={form.synopsis} onChange={(v) => field('synopsis', v)} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Poster URL" value={form.poster_url} onChange={(v) => field('poster_url', v)} />
        <Input label="Backdrop URL" value={form.backdrop_url} onChange={(v) => field('backdrop_url', v)} />
      </div>
      <Input label="Trailer URL" value={form.trailer_url} onChange={(v) => field('trailer_url', v)} />
      <div className="grid grid-cols-3 gap-4">
        <Input label="Director" value={form.director} onChange={(v) => field('director', v)} />
        <Input label="Release year" type="number" value={String(form.release_year)} onChange={(v) => field('release_year', Number(v))} />
        <Input label="Runtime (min)" type="number" value={String(form.runtime_minutes)} onChange={(v) => field('runtime_minutes', Number(v))} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Language" value={form.language} onChange={(v) => field('language', v)} />
        <Input label="Content rating" value={form.content_rating} onChange={(v) => field('content_rating', v)} placeholder="e.g. 16+" />
      </div>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_featured} onChange={(e) => field('is_featured', e.target.checked)} /> Feature on homepage</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_published} onChange={(e) => field('is_published', e.target.checked)} /> Published</label>
      </div>
      {error && <p className="text-brand text-sm">{error}</p>}
      <button type="submit" disabled={saving} className="self-start bg-gold text-[#171412] font-semibold rounded-lg px-6 py-2.5 text-sm hover:bg-[#f0b25a] disabled:opacity-50">
        {saving ? 'Saving…' : movie ? 'Save changes' : 'Create movie'}
      </button>
    </form>
  );
}

function Input({ label, value, onChange, type = 'text', required, placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className="block text-[12.5px] text-ink-dim mb-1.5">{label}</label>
      <input type={type} required={required} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-bg-card border border-line rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-gold/60" />
    </div>
  );
}
function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-[12.5px] text-ink-dim mb-1.5">{label}</label>
      <textarea rows={4} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-bg-card border border-line rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-gold/60" />
    </div>
  );
}
