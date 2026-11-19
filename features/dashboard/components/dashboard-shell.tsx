import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import type { UserMenuUser } from '@/features/auth/components/user-menu';
import type { UsageSummary } from '@/features/billing/server/usage';
import { DashboardSidebar } from '@/features/dashboard/components/dashboard-sidebar';
import type { SubscriptionPlan } from '@/features/dashboard/lib/types';

type DashboardShellProps = {
  children: React.ReactNode;
  user: UserMenuUser;
  plan: SubscriptionPlan;
  usage: UsageSummary;
};

export function DashboardShell({ children, user, plan, usage }: DashboardShellProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <SidebarProvider>
        <DashboardSidebar user={user} plan={plan} usage={usage} />
        <SidebarInset className="min-w-0 md:shadow-[0_1px_3px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.08)]">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
