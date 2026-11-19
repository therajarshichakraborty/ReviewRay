import { requireAuth } from '@/features/auth/server/session';
import { getUserSubscription } from '@/features/billing/server/subscription';
import { getUsageSummary } from '@/features/billing/server/usage';
import { DashboardShell } from '@/features/dashboard/components/dashboard-shell';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAuth();
  const [subscription, usage] = await Promise.all([
    getUserSubscription(session.user.id),
    getUsageSummary(session.user.id),
  ]);

  return (
    <DashboardShell user={session.user} plan={subscription.plan} usage={usage}>
      {children}
    </DashboardShell>
  );
}
