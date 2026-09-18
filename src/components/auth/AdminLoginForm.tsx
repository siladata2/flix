'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { friendlyAuthError } from '@/lib/authErrors';

// Admin accounts sign in with a short "username" instead of typing a full
// email. Under the hood this still goes through real Supabase Auth (so RLS,
// password hashing, sessions — everything — works exactly like a normal
// account); the username is just resolved to an email address using a fixed
// domain before calling signInWithPassword. See docs/ADMIN_SETUP.md for how
// to create the matching account in Supabase.
const ADMIN_EMAIL_DOMAIN = process.env.NEXT_PUBLIC_ADMIN_EMAIL_DOMAIN || 'silaflix.app';

function resolveEmail(usernameOrEmail: string) {
  const trimmed = usernameOrEmail.trim();
  if (trimmed.includes('@')) return trimmed.toLowerCase();
  return `${trimmed.toLowerCase()}@${ADMIN_EMAIL_DOMAIN}`;
}

export function AdminLoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const forbidden = params.get('error') === 'forbidden';

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: resolveEmail(username),
      password,
    });
    setLoading(false);
    if (error) { setError(friendlyAuthError(error.message)); return; }
    router.push(params.get('redirectTo') || '/admin');
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit}>
      {forbidden && (
        <p className="text-sm text-gold bg-gold/10 border border-gold/30 rounded-lg px-3 py-2 mb-4">
          That account signed in, but doesn&apos;t have admin access on this account yet.
        </p>
      )}
      <div className="mb-3.5">
        <label className="block text-[12.5px] text-ink-dim mb-1.5">Admin username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          required
          autoComplete="username"
          placeholder="e.g. sila22"
          className="w-full bg-bg-card border border-line rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-gold/60"
        />
      </div>
      <div className="mb-3.5">
        <label className="block text-[12.5px] text-ink-dim mb-1.5">Password</label>
        <div className="relative">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? 'text' : 'password'}
            required
            autoComplete="current-password"
            className="w-full bg-bg-card border border-line rounded-lg px-3.5 py-2.5 pr-10 text-sm outline-none focus:border-gold/60"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
      {error && <p className="text-brand text-sm mb-3">{error}</p>}
      <button type="submit" disabled={loading} className="w-full bg-gold text-[#171412] font-semibold rounded-lg py-2.5 text-sm hover:bg-[#f0b25a] disabled:opacity-50">
        {loading ? 'Signing in…' : 'Sign in to admin'}
      </button>
      <p className="text-center mt-5 text-[12.5px] text-ink-faint">
        Not staff? <a href="/login" className="text-gold">Go to regular sign in</a>
      </p>
    </form>
  );
}
