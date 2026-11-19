import { ArrowUpRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

import { LogoMark, Wordmark } from '@/components/brand/logo';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { SidebarUserMenu, type UserMenuUser } from '@/features/auth/components/user-menu';
import type { UsageSummary } from '@/features/billing/server/usage';
import { DashboardNav } from '@/features/dashboard/components/dashboard-nav';
import { DASHBOARD_ROUTES } from '@/features/dashboard/lib/routes';
import type { SubscriptionPlan } from '@/features/dashboard/lib/types';
import { PLAN_DETAILS } from '@/features/settings/lib/plan-details';
import { Meter } from './ui';

type DashboardSidebarProps = {
  user: UserMenuUser;
  plan: SubscriptionPlan;
  usage: UsageSummary;
};

function UsageCard({ plan, usage }: { plan: SubscriptionPlan; usage: UsageSummary }) {
  if (usage.limit === null) {
    return (
      <div className="animate-fade-in rounded-xl bg-background p-3.5 group-data-[collapsible=icon]:hidden">
        <p className="flex items-center gap-1.5 text-sm font-medium">
          <Sparkles className="size-3.5 text-primary" />
          {PLAN_DETAILS[plan].label} plan
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Unlimited reviews · {usage.used} this month
        </p>
      </div>
    );
  }

  const exhausted = usage.used >= usage.limit;

  return (
    <div className="animate-fade-in rounded-xl bg-background p-3.5 group-data-[collapsible=icon]:hidden">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium">Free plan</span>
        <span className="font-mono text-muted-foreground tabular-nums">
          {usage.used}/{usage.limit}
        </span>
      </div>
      <Meter
        value={usage.used}
        max={usage.limit}
        label="Reviews used this month"
        className="mt-2.5 bg-muted"
        barClassName={exhausted ? 'bg-amber-500' : undefined}
      />
      <Link
        href="/pricing"
        className="group mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary"
      >
        {exhausted ? 'Limit reached. Upgrade' : 'Upgrade for unlimited'}
        <ArrowUpRight className="size-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    </div>
  );
}

export function DashboardSidebar({ user, plan, usage }: DashboardSidebarProps) {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              tooltip="ReviewRay"
              className="hover:bg-transparent active:bg-transparent"
            >
              <Link href={DASHBOARD_ROUTES.overview}>
                <LogoMark className="size-8 transition-transform duration-500 ease-[var(--ease-spring)] hover:rotate-[-8deg]" />
                <Wordmark className="group-data-[collapsible=icon]:hidden" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <DashboardNav />
      </SidebarContent>

      <SidebarFooter className="gap-3">
        <UsageCard plan={plan} usage={usage} />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarUserMenu user={user} planLabel={PLAN_DETAILS[plan].label} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
