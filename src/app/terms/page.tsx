import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Terms of Use' };

export default function TermsPage() {
  return (
    <div className="wrap pt-32 pb-20 max-w-2xl prose prose-invert text-ink-dim leading-relaxed">
      <h1 className="font-display text-3xl mb-6 text-ink">Terms of use</h1>
      <p><em>Placeholder terms — replace with counsel-reviewed text before launch.</em></p>
      <h2 className="font-display text-xl text-ink mt-6 mb-2">Your account</h2>
      <p>You are responsible for activity under your account and for keeping your credentials secure.</p>
      <h2 className="font-display text-xl text-ink mt-6 mb-2">Content use</h2>
      <p>Content is licensed for personal, non-commercial viewing. Downloads are for offline personal use only and must not be redistributed.</p>
      <h2 className="font-display text-xl text-ink mt-6 mb-2">Termination</h2>
      <p>We may suspend accounts that violate these terms or misuse the platform.</p>
    </div>
  );
}
