'use client';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Search } from 'lucide-react';

export function SearchBox() {
  const [q, setQ] = useState('');
  const router = useRouter();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <form onSubmit={onSubmit} className="hidden lg:flex items-center gap-2 bg-bg-raised border border-line rounded-lg px-3 py-2 w-[210px] focus-within:w-[280px] transition-all">
      <Search size={15} className="opacity-60 flex-none" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        type="text"
        placeholder="Search titles, genres..."
        aria-label="Search SilaFlix"
        className="bg-transparent outline-none text-[13.5px] w-full placeholder:text-ink-faint"
      />
    </form>
  );
}
