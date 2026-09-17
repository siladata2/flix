'use client';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-[34px] h-[34px] rounded-[7px] bg-gradient-to-br from-gold to-brand border border-line flex-none"
        aria-label="Account menu"
        aria-expanded={open}
      />
      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-52 bg-bg-raised border border-line rounded-xl overflow-hidden shadow-xl">
          <Link href="/profile" className="block px-4 py-2.5 text-sm hover:bg-bg-card">Profile</Link>
          <Link href="/watchlist" className="block px-4 py-2.5 text-sm hover:bg-bg-card">My List</Link>
          <Link href="/history" className="block px-4 py-2.5 text-sm hover:bg-bg-card">Watch history</Link>
          <Link href="/downloads" className="block px-4 py-2.5 text-sm hover:bg-bg-card">Downloads</Link>
          <Link href="/settings" className="block px-4 py-2.5 text-sm hover:bg-bg-card">Settings</Link>
          <Link href="/admin" className="block px-4 py-2.5 text-sm hover:bg-bg-card border-t border-line">Admin dashboard</Link>
          <button onClick={signOut} className="w-full text-left px-4 py-2.5 text-sm text-brand hover:bg-bg-card border-t border-line">
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
