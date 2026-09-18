'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function ResendVerification({ email }: { email: string }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function resend() {
    setStatus('sending');
    const supabase = createClient();
    const { error } = await supabase.auth.resend({ type: 'signup', email });
    setStatus(error ? 'error' : 'sent');
  }

  if (status === 'sent') return <p className="text-[13px] text-gold mt-2">Verification email resent — check your inbox.</p>;

  return (
    <button type="button" onClick={resend} disabled={status === 'sending'} className="text-[13px] text-gold mt-2 disabled:opacity-50">
      {status === 'sending' ? 'Resending…' : 'Resend verification email'}
      {status === 'error' && <span className="block text-brand mt-1">Could not resend — try again shortly.</span>}
    </button>
  );
}
