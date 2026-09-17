'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { FormField } from './FormField';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setSent(true);
  }

  if (sent) return <p className="text-sm text-ink-dim">If an account exists for <strong>{email}</strong>, a reset link is on its way.</p>;

  return (
    <form onSubmit={onSubmit}>
      <FormField label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      {error && <p className="text-brand text-sm mb-3">{error}</p>}
      <button type="submit" disabled={loading} className="w-full bg-gold text-[#171412] font-semibold rounded-lg py-2.5 text-sm hover:bg-[#f0b25a] disabled:opacity-50">
        {loading ? 'Sending…' : 'Send reset link'}
      </button>
    </form>
  );
}
