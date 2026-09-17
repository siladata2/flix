import type { ReactNode } from 'react';
import Link from 'next/link';

export function AuthCard({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-32">
      <div className="w-full max-w-[400px]">
        <Link href="/" className="font-display font-bold text-2xl block text-center mb-8">
          Sila<span className="text-gold italic font-medium">Flix</span>
        </Link>
        <div className="bg-bg-raised border border-line rounded-2xl p-8">
          <h1 className="font-display text-xl mb-1">{title}</h1>
          {subtitle && <p className="text-ink-faint text-sm mb-6">{subtitle}</p>}
          {!subtitle && <div className="mb-6" />}
          {children}
        </div>
      </div>
    </div>
  );
}
