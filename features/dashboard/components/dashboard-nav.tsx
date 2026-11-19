'use client';

import { FolderGit2, GitPullRequest, LayoutGrid, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { GitHubIcon } from '@/components/landing/icons';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  DASHBOARD_NAV_ITEMS,
  DASHBOARD_ROUTES,
  type DashboardNavIcon,
  type DashboardRoute,
} from '@/features/dashboard/lib/routes';
import { cn } from '@/lib/utils';

const NAV_ICONS: Record<DashboardNavIcon, React.ComponentType<{ className?: string }>> = {
  overview: LayoutGrid,
  'pull-requests': GitPullRequest,
  repositories: FolderGit2,
  github: GitHubIcon,
  settings: Settings,
};

function isNavActive(pathname: string, href: DashboardRoute) {
  if (href === DASHBOARD_ROUTES.overview) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardNav() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Workspace</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="gap-0.5">
          {DASHBOARD_NAV_ITEMS.map((item) => {
            const Icon = NAV_ICONS[item.icon];
            const active = isNavActive(pathname, item.href);

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  tooltip={item.title}
                  className="group/nav h-9 transition-all duration-200 data-active:bg-background data-active:shadow-[0_1px_2px_rgb(0_0_0/0.06)]"
                >
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    onClick={() => isMobile && setOpenMobile(false)}
                  >
                    <Icon
                      className={cn(
                        'transition-transform duration-300 group-hover/nav:scale-110',
                        active ? 'text-primary' : 'text-muted-foreground',
                      )}
                    />
                    <span className="transition-transform duration-200 group-hover/nav:translate-x-0.5">
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
