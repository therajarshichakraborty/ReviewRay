import Link from 'next/link';
import { Sparkles } from 'lucide-react';
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
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm shadow-blue-500/25">
                  <Sparkles className="size-4" />
                </div>
                <span className="font-sans text-sm font-bold tracking-tight text-foreground group-data-[collapsible=icon]:hidden">
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
