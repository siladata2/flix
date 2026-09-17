import { Suspense } from 'react';
import { AuthCard } from '@/components/auth/AuthCard';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata = { title: 'Sign in' };

export default function LoginPage() {
  return (
    <AuthCard title="Welcome back">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
