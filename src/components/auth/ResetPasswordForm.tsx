'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { FormField } from './FormField';

export function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) { setError('At least 8 characters'); return; }
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    router.push('/login');
  }

  return (
    <form onSubmit={onSubmit}>
      <FormField label="New password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <p className="text-brand text-sm mb-3">{error}</p>}
      <button type="submit" disabled={loading} className="w-full bg-gold text-[#171412] font-semibold rounded-lg py-2.5 text-sm hover:bg-[#f0b25a] disabled:opacity-50">
        {loading ? 'Updating…' : 'Update password'}
      </button>
    </form>
  );
}
