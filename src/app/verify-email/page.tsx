import Link from 'next/link';
import { AuthCard } from '@/components/auth/AuthCard';

export const metadata = { title: 'Verify your email' };

export default function VerifyEmailPage() {
  return (
    <AuthCard title="You're verified 🎉">
      <p className="text-sm text-ink-dim mb-5">Your email is confirmed. You can sign in now.</p>
      <Link href="/login" className="block text-center w-full bg-gold text-[#171412] font-semibold rounded-lg py-2.5 text-sm hover:bg-[#f0b25a]">
        Go to sign in
      </Link>
    </AuthCard>
  );
}
