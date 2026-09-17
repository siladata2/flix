import { requireRole } from '@/lib/auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

// Every admin route is gated here (moderator+) as well as at the edge in
// src/middleware.ts and, underneath both, by RLS — three layers deep.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole('moderator');

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 min-w-0 px-6 md:px-10 py-8 pb-24 md:pb-8">{children}</div>
    </div>
  );
}
