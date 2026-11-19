import { requireAuth } from '@/features/auth/server/session';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  await requireAuth();
  return <div className="min-h-svh">{children}</div>;
}
