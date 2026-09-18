'use client';
import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { FormField } from './FormField';
import { ResendVerification } from './ResendVerification';
import { registerSchema } from '@/lib/validations';
import { friendlyAuthError } from '@/lib/authErrors';

export function RegisterForm() {
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '', displayName: '' });
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = registerSchema.safeParse(form);
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? 'Please check the form'); return; }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { display_name: form.displayName }, emailRedirectTo: `${window.location.origin}/verify-email` },
    });
    setLoading(false);
    if (error) { setError(friendlyAuthError(error.message)); return; }
    setDone(true);
  }

  if (done) {
    return (
      <div className="text-sm text-ink-dim">
        <p>Check <strong>{form.email}</strong> for a verification link to activate your account.</p>
        <p className="text-ink-faint text-xs mt-2">Didn&apos;t get it? Check your spam folder, or:</p>
        <ResendVerification email={form.email} />
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <FormField label="Display name" required value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} />
      <FormField label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <FormField label="Password" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <FormField label="Confirm password" type="password" required value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
      {error && <p className="text-brand text-sm mb-3">{error}</p>}
      <button type="submit" disabled={loading} className="w-full bg-gold text-[#171412] font-semibold rounded-lg py-2.5 text-sm hover:bg-[#f0b25a] disabled:opacity-50 mt-1">
        {loading ? 'Creating account…' : 'Create account'}
      </button>
      <p className="text-center mt-4 text-[13px] text-ink-faint">
        Already have an account? <Link href="/login" className="text-gold">Sign in</Link>
      </p>
    </form>
  );
}
