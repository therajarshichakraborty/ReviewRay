import { TooltipProvider } from '@/components/ui/tooltip';
import { DashboardSidebar } from '@/features/dashboard/components/dashboard-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { UserMenuUser } from '@/features/auth/components/user-menu';

type DashboardShellProps = {
  children: React.ReactNode;
  user: UserMenuUser;
  plan?: string;
};

export function DashboardShell({ children, user, plan }: DashboardShellProps) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <DashboardSidebar user={user} plan={plan} />
        <SidebarInset className="min-h-svh bg-background">
          {/* Subtle grid texture across all dashboard pages */}
          <div className="relative min-h-full flex flex-col">
            <div className="pointer-events-none fixed inset-0 hero-grid-bg opacity-[0.15] dark:opacity-[0.04]" />
            <div className="relative flex flex-1 flex-col">{children}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
