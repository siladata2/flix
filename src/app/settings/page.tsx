import type { Metadata } from 'next';
import { requireUser } from '@/lib/auth';
import { SettingsForm } from '@/components/SettingsForm';

export const metadata: Metadata = { title: 'Settings' };

export default async function SettingsPage() {
  const { profile } = await requireUser();
  return (
    <div className="wrap pt-32 pb-20 max-w-xl">
      <h1 className="font-display text-3xl mb-8">Settings</h1>
      <SettingsForm profile={profile} />
    </div>
  );
}
