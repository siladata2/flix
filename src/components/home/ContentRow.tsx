import type { ReactNode } from 'react';
import Link from 'next/link';

export function ContentRow({
  title,
  seeAllHref,
  children,
}: {
  title: string;
  seeAllHref?: string;
  children: ReactNode;
}) {
  return (
    <section className="wrap py-6">
      <div className="flex items-baseline justify-between gap-4 mb-4">
        <h2 className="font-display text-2xl">{title}</h2>
        {seeAllHref && (
          <Link href={seeAllHref} className="text-[13.5px] text-ink-faint hover:text-gold flex-none">See all</Link>
        )}
      </div>
      <div className="row-scroll">{children}</div>
    </section>
  );
}
