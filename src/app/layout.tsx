import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { Footer } from '@/components/layout/Footer';

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-display', weight: ['400', '500', '600', '700'] });
const inter = Inter({ subsets: ['latin'], variable: '--font-sans', weight: ['400', '500', '600', '700'] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://silaflix.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'SilaFlix — Your World of Entertainment', template: '%s | SilaFlix' },
  description: 'Stream authorized movies, series, reels, and recaps from around the world on SilaFlix.',
  openGraph: {
    siteName: 'SilaFlix',
    type: 'website',
    locale: 'en',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <Header />
        <MobileNav />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
