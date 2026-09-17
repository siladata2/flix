import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <div className="wrap pt-32 pb-20 max-w-2xl prose prose-invert text-ink-dim leading-relaxed">
      <h1 className="font-display text-3xl mb-6 text-ink">Privacy policy</h1>
      <p><em>Placeholder policy — replace with counsel-reviewed text before launch.</em></p>
      <h2 className="font-display text-xl text-ink mt-6 mb-2">What we collect</h2>
      <p>Account details (email, display name), watch activity (history, watchlist), and technical data needed to deliver playback and downloads securely.</p>
      <h2 className="font-display text-xl text-ink mt-6 mb-2">How we use it</h2>
      <p>To operate your account, personalize recommendations, secure downloads, and improve the service. We do not sell personal data.</p>
      <h2 className="font-display text-xl text-ink mt-6 mb-2">Your choices</h2>
      <p>You can review and update your data from Settings, or contact us to request deletion.</p>
    </div>
  );
}
