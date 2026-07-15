import Link from 'next/link';

import { DASHBOARD_ROUTES } from '@/features/dashboard/lib/routes';
import { DashboardNav } from '@/features/dashboard/components/dashboard-nav';
import { SidebarUserButton } from '@/features/dashboard/components/sidebar-user-button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { UserMenuUser } from '@/features/auth/components/user-menu';

type DashboardSidebarProps = {
  user: UserMenuUser;
  plan?: string;
};

export function DashboardSidebar({ user, plan = 'Pro' }: DashboardSidebarProps) {
  return (
    <Sidebar collapsible="icon" className="border-r border-border/40">
      <SidebarHeader className="py-4 px-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              tooltip="ReviewRay"
              className="hover:bg-transparent active:bg-transparent"
            >
              <Link href={DASHBOARD_ROUTES.overview} className="flex items-center gap-2.5 px-1.5">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-foreground text-background shadow-md">
                  <span className="font-mono text-xs font-black select-none">R</span>
                </div>
                <span className="font-sans text-sm font-semibold tracking-tight text-foreground group-data-[collapsible=icon]:hidden">
                  ReviewRay
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <DashboardNav />
      </SidebarContent>
      <SidebarFooter className="p-3">
        <SidebarSeparator className="my-2 bg-border/40" />
        <SidebarUserButton user={user} plan={plan} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
