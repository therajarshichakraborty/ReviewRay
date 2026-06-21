import Image from 'next/image';
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
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" tooltip="ReviewRay">
              <Link href={DASHBOARD_ROUTES.overview}>
                <span className="flex size-8 shrink-0 w-full items-center justify-center overflow-hidden rounded-none bg-sidebar">
                  <Image
                    src="/logo.svg"
                    alt="Logo"
                    width={96}
                    height={96}
                    className="w-24"
                    style={{ height: 'auto' }}
                    loading="eager"
                  />
                </span>
                <span className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-medium">ReviewRay</span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <DashboardNav />
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <SidebarUserButton user={user} plan={plan} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
