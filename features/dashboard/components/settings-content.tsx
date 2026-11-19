'use client';

import { format } from 'date-fns';
import { Check } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getDisplayName, getInitials } from '@/features/auth/utils/display';
import { CancelSubscriptionButton } from '@/features/billing/components/cancel-subscription-button';
import { UpgradeButton } from '@/features/billing/components/upgrade-button';
import type { UsageSummary } from '@/features/billing/server/usage';
import type { UserSubscription } from '@/features/dashboard/lib/types';
import {
  statusBadge,
  statusDotClass,
  type StatusTone,
} from '@/features/dashboard/lib/status-styles';
import { PLAN_DETAILS } from '@/features/settings/lib/plan-details';
import type { SettingsProfile } from '@/features/settings/types';
import { cn } from '@/lib/utils';
import { Meter, Panel } from './ui';

export type SettingsTab = 'profile' | 'billing';

type SettingsContentProps = {
  profile: SettingsProfile;
  subscription: UserSubscription;
  usage: UsageSummary;
  initialTab: SettingsTab;
};

const SUBSCRIPTION_STATUS: Record<UserSubscription['status'], { label: string; tone: StatusTone }> =
  {
    active: { label: 'Active', tone: 'success' },
    trialing: { label: 'Activating', tone: 'info' },
    canceled: { label: 'Canceled', tone: 'warning' },
  };

function ReadOnlyField({ id, label, value }: { id: string; label: string; value: string }) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id} className="text-sm">
        {label}
      </Label>
      <Input
        id={id}
        value={value}
        readOnly
        className="h-10 border-transparent bg-background text-muted-foreground shadow-none"
      />
    </div>
  );
}

function ProfileTab({ profile }: { profile: SettingsProfile }) {
  const displayName = getDisplayName(profile);

  return (
    <Panel
      title="Profile"
      description="Synced from your GitHub account when you sign in."
      bodyClassName="space-y-6 p-6"
    >
      <div className="flex items-center gap-4">
        <Avatar className="size-14">
          {profile.image ? <AvatarImage src={profile.image} alt={displayName} /> : null}
          <AvatarFallback className="text-base font-medium">{getInitials(profile)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-[17px] font-medium">{displayName}</p>
          <p className="text-sm text-muted-foreground">
            Member since {format(new Date(profile.memberSince), 'MMMM d, yyyy')}
          </p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <ReadOnlyField id="name" label="Display name" value={profile.name} />
        <ReadOnlyField id="email" label="Email" value={profile.email} />
      </div>
      <p className="text-sm text-muted-foreground">
        To change these, update your{' '}
        <a
          href="https://github.com/settings/profile"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary hover:underline"
        >
          GitHub profile
        </a>{' '}
        and sign in again.
      </p>
    </Panel>
  );
}

function BillingTab({
  subscription,
  usage,
}: {
  subscription: UserSubscription;
  usage: UsageSummary;
}) {
  const plan = PLAN_DETAILS[subscription.plan];
  const status = SUBSCRIPTION_STATUS[subscription.status];
  const renewal = subscription.renewsAt
    ? format(new Date(subscription.renewsAt), 'MMMM d, yyyy')
    : null;

  return (
    <div className="flex flex-col gap-5">
      <Panel
        title="Plan"
        description="Your subscription and what it includes."
        bodyClassName="p-0"
        action={
          <span className={statusBadge(status.tone)}>
            <span className={cn('size-1.5 rounded-full', statusDotClass[status.tone])} />
            {status.label}
          </span>
        }
      >
        <div className="grid gap-6 p-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <div>
            <p className="text-sm text-muted-foreground">Current plan</p>
            <p className="mt-1 text-3xl font-semibold tracking-[-0.03em]">{plan.label}</p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              {plan.price} · {plan.cadence}
            </p>
            {renewal ? (
              <p className="mt-3 text-sm text-muted-foreground">
                {subscription.status === 'canceled' ? 'Access ends' : 'Renews'} on {renewal}
              </p>
            ) : null}
          </div>
          <ul className="space-y-2.5">
            {plan.features.map((feature, index) => (
              <li
                key={feature}
                className="animate-fade-up flex items-start gap-2.5 text-sm"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <Check className="mt-0.5 size-3.5 shrink-0 text-primary" strokeWidth={3} />
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-wrap items-center gap-2 bg-background/50 px-6 py-4">
          {subscription.plan === 'free' ? (
            <UpgradeButton>Upgrade to Pro · ₹199/month</UpgradeButton>
          ) : (
            <CancelSubscriptionButton disabled={subscription.status === 'canceled'} />
          )}
        </div>
      </Panel>

      <Panel title="Usage" description="Reviews consumed in the current calendar month.">
        <div className="flex items-baseline justify-between">
          <p className="text-3xl font-semibold tracking-[-0.03em] tabular-nums">
            {usage.used}
            {usage.limit !== null ? (
              <span className="text-lg text-muted-foreground"> / {usage.limit}</span>
            ) : null}
          </p>
          <p className="text-sm text-muted-foreground">
            {usage.limit === null ? 'Unlimited' : `${Math.max(0, usage.limit - usage.used)} left`}
          </p>
        </div>
        {usage.limit !== null ? (
          <Meter
            value={usage.used}
            max={usage.limit}
            label="Reviews used this month"
            className="mt-4 h-2"
            barClassName={usage.used >= usage.limit ? 'bg-amber-500' : undefined}
          />
        ) : null}
      </Panel>
    </div>
  );
}

export function SettingsContent({
  profile,
  subscription,
  usage,
  initialTab,
}: SettingsContentProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Tabs
      defaultValue={initialTab}
      onValueChange={(value) => router.replace(`${pathname}?tab=${value}`, { scroll: false })}
      className="gap-6"
    >
      <TabsList>
        <TabsTrigger className="dark:data-active:border-transparent" value="profile">
          Profile
        </TabsTrigger>
        <TabsTrigger className="dark:data-active:border-transparent" value="billing">
          Plan and billing
        </TabsTrigger>
      </TabsList>
      <TabsContent value="profile" className="animate-fade-up">
        <ProfileTab profile={profile} />
      </TabsContent>
      <TabsContent value="billing" className="animate-fade-up">
        <BillingTab subscription={subscription} usage={usage} />
      </TabsContent>
    </Tabs>
  );
}
