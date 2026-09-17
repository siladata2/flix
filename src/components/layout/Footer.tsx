import Link from 'next/link';

const supportPhone = process.env.NEXT_PUBLIC_SUPPORT_PHONE ?? '+255789661031';

const columns = [
  { title: 'Browse', links: [['Movies', '/movies'], ['Series', '/series'], ['Reels', '/reels'], ['Recaps', '/recaps']] },
  { title: 'Account', links: [['Watchlist', '/watchlist'], ['Downloads', '/downloads'], ['Settings', '/settings']] },
  { title: 'Company', links: [['About SilaFlix', '/about'], ['Contact', '/contact'], ['Help centre', '/help']] },
  { title: 'Legal', links: [['Privacy', '/privacy'], ['Terms of use', '/terms'], ['Copyright', '/copyright']] },
];

export function Footer() {
  return (
    <footer className="border-t border-line mt-24 pb-24 md:pb-9 pt-14">
      <div className="wrap">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-11">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-display font-bold text-xl mb-3 inline-block">
              Sila<span className="text-gold italic font-medium">Flix</span>
            </Link>
            <p className="text-[13px] text-ink-faint leading-relaxed max-w-[32ch] mb-3">
              Your World of Entertainment — original and licensed movies, series, reels and recaps.
            </p>
            <p className="text-[13px] text-ink-dim">Support: <a href={`tel:${supportPhone}`} className="hover:text-gold">{supportPhone}</a></p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-[13px] font-semibold mb-3.5">{col.title}</h4>
              {col.links.map(([label, href]) => (
                <Link key={href} href={href} className="block text-[13.5px] text-ink-faint hover:text-gold mb-2.5">{label}</Link>
              ))}
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center flex-wrap gap-3 pt-6 border-t border-line text-[12.5px] text-ink-faint">
          <span>© {new Date().getFullYear()} SilaFlix. All titles are original productions or licensed content.</span>
        </div>
      </div>
    </footer>
  );
}
