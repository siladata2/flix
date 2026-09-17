'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Film, Tv, Layers, Clapperboard, Newspaper, Tags,
  Users, Download, Flag, BarChart3, ScrollText, Settings,
} from 'lucide-react';

const items = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/movies', label: 'Movies', icon: Film },
  { href: '/admin/series', label: 'Series', icon: Tv },
  { href: '/admin/seasons', label: 'Seasons', icon: Layers },
  { href: '/admin/episodes', label: 'Episodes', icon: Layers },
  { href: '/admin/reels', label: 'Reels', icon: Clapperboard },
  { href: '/admin/recaps', label: 'Recaps', icon: Newspaper },
  { href: '/admin/categories', label: 'Categories', icon: Tags },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/downloads', label: 'Downloads', icon: Download },
  { href: '/admin/reports', label: 'Reports', icon: Flag },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/audit-logs', label: 'Audit logs', icon: ScrollText },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-60 flex-none border-r border-line min-h-screen pt-8 px-3 hidden md:block">
      <Link href="/" className="font-display font-bold text-lg px-3 mb-8 block">
        Sila<span className="text-gold italic font-medium">Flix</span> <span className="text-ink-faint text-xs font-sans font-normal">admin</span>
      </Link>
      <nav className="flex flex-col gap-0.5">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] ${active ? 'bg-bg-card text-gold' : 'text-ink-dim hover:bg-bg-card'}`}
            >
              <Icon size={16} /> {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
