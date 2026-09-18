'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { FormField } from './FormField';
import { ResendVerification } from './ResendVerification';
import { friendlyAuthError, isUnconfirmedEmailError } from '@/lib/authErrors';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawError, setRawError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setRawError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setError(friendlyAuthError(error.message)); setRawError(error.message); return; }
    router.push(params.get('redirectTo') ?? '/');
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit}>
      <FormField label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />

      <div className="mb-3.5">
        <label className="block text-[12.5px] text-ink-dim mb-1.5">Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-bg-card border border-line rounded-lg px-3.5 py-2.5 pr-10 text-sm outline-none focus:border-gold/60"
          />
          <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint" aria-label={showPassword ? 'Hide password' : 'Show password'}>
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-3">
          <p className="text-brand text-sm">{error}</p>
          {rawError && isUnconfirmedEmailError(rawError) && email && <ResendVerification email={email} />}
        </div>
      )}

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
