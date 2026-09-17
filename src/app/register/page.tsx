import { AuthCard } from '@/components/auth/AuthCard';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata = { title: 'Create account' };

export default function RegisterPage() {
  return (
    <AuthCard title="Join SilaFlix">
      <RegisterForm />
    </AuthCard>
  );
}
