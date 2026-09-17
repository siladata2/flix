import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { SearchBox } from './SearchBox';
import { UserMenu } from './UserMenu';

const navLinks = [
  { href: '/movies', label: 'Movies' },
  { href: '/series', label: 'Series' },
  { href: '/reels', label: 'Reels' },
  { href: '/recaps', label: 'Recaps' },
  { href: '/categories', label: 'Categories' },
];

export async function Header() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="fixed top-0 inset-x-0 z-[200] py-4 bg-bg/0 border-b border-transparent transition-colors">
      <div className="wrap flex items-center gap-7">
        <Link href="/" className="font-display font-bold text-[22px] tracking-tight flex-none">
          Sila<span className="text-gold italic font-medium">Flix</span>
        </Link>

        <nav className="hidden md:flex gap-6 flex-1">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="text-[14.5px] font-medium text-ink-dim hover:text-ink transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 flex-none ml-auto">
          <SearchBox />
          {user ? (
            <UserMenu />
          ) : (
            <Link href="/login" className="hidden sm:inline-flex text-sm font-semibold border border-line rounded-[7px] px-4 py-2 hover:border-ink-dim transition-colors">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
