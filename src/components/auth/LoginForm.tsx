'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { FormField } from './FormField';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    router.push(params.get('redirectTo') ?? '/');
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit}>
      <FormField label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      <FormField label="Password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
      {error && <p className="text-brand text-sm mb-3">{error}</p>}
      <button type="submit" disabled={loading} className="w-full bg-gold text-[#171412] font-semibold rounded-lg py-2.5 text-sm hover:bg-[#f0b25a] disabled:opacity-50 mt-1">
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
      <div className="flex justify-between mt-4 text-[13px]">
        <Link href="/forgot-password" className="text-ink-faint hover:text-gold">Forgot password?</Link>
        <Link href="/register" className="text-ink-faint hover:text-gold">Create account</Link>
      </div>
    </form>
  );
}
