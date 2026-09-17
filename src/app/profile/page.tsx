import type { Metadata } from 'next';
import { requireUser } from '@/lib/auth';
import { ProfileForm } from '@/components/ProfileForm';

export const metadata: Metadata = { title: 'Profile' };

export default async function ProfilePage() {
  const { profile } = await requireUser();

  return (
    <div className="wrap pt-32 pb-20 max-w-xl">
      <h1 className="font-display text-3xl mb-8">Profile</h1>
      <ProfileForm profile={profile} />
    </div>
  );
}
