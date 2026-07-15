'use client';
/**
 * Settings page body with Profile and Subscription tabs.
 * Clean, premium aesthetic with neutral styling and refined accents.
 */

import { format } from 'date-fns';
import { UpgradeButton } from '@/features/billing/components/upgrade-button';
import type { UserSubscription } from '@/features/dashboard/lib/types';
import { PLAN_DETAILS } from '@/features/settings/lib/plan-details';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SettingsProfile } from '@/features/settings/types';
import { UsageSummary } from '@/features/billing/server/usage';
import { statusBadge } from '../lib/status-styles';
import { CancelSubscriptionButton } from '@/features/billing/components/cancel-subscription-button';
import { getDisplayName, getInitials } from '@/features/auth/components/user-menu';

type SettingsContentProps = {
  profile: SettingsProfile;
  subscription: UserSubscription;
  usage: UsageSummary;
};

function formatRenewalDate(renewsAt: string | null): string | null {
  if (!renewsAt) return null;
  return format(new Date(renewsAt), 'MMMM d, yyyy');
}

function getSubscriptionStatusLabel(status: UserSubscription['status']): string {
  if (status === 'active') return 'active';
  if (status === 'trialing') return 'trialing';
  return 'canceled';
}

function getUsageText(usage: UsageSummary): string {
  if (usage.limit === null)
    return `You've used ${usage.used} reviews this month (unlimited reviews).`;
  return `You've used ${usage.used} out of your ${usage.limit} monthly reviews.`;
}

/**
 * Profile tab — avatar, read-only name/email, member since date.
 */
function ProfileTab({ profile }: { profile: SettingsProfile }) {
  const displayName = getDisplayName(profile);
  const initials = getInitials(profile);
  const memberSince = format(new Date(profile.memberSince), 'MMMM d, yyyy');

  return (
    <Card className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm">
      <CardHeader className="border-b border-border/40 pb-5 bg-muted/20">
        <CardTitle className="text-base font-semibold tracking-tight">Profile Settings</CardTitle>
        <CardDescription className="text-xs text-muted-foreground font-light">
          Account information from your GitHub authentication. Fields are read-only.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Avatar block */}
        <div className="flex items-center gap-4">
          <Avatar size="lg" className="border-2 border-border shadow-sm">
            {profile.image ? <AvatarImage src={profile.image} alt={displayName} /> : null}
            <AvatarFallback className="bg-muted text-foreground font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-0.5">
            <p className="font-semibold text-sm text-foreground/90">{displayName}</p>
            <p className="text-xs text-muted-foreground font-light">{profile.email}</p>
            <p className="text-[10px] text-muted-foreground font-light">
              Member since {memberSince}
            </p>
          </div>
        </div>

        <Separator className="bg-border/60" />

        {/* Read-only fields */}
        <div className="grid gap-4 max-w-md">
          <div className="grid gap-1.5">
            <Label htmlFor="name" className="text-xs font-medium text-foreground/80">
              Display name
            </Label>
            <Input
              id="name"
              defaultValue={profile.name}
              readOnly
              className="h-9 rounded-lg border-border/50 bg-muted/30 text-xs focus-visible:ring-0 focus-visible:border-border cursor-not-allowed select-none"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="email" className="text-xs font-medium text-foreground/80">
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              defaultValue={profile.email}
              readOnly
              className="h-9 rounded-lg border-border/50 bg-muted/30 text-xs focus-visible:ring-0 focus-visible:border-border cursor-not-allowed select-none"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t border-border/40 pt-4 bg-muted/10">
        <p className="text-xs text-muted-foreground/80 font-light">
          Profile details are managed by GitHub. Update them directly in your{' '}
          <a
            href="https://github.com/settings/profile"
            target="_blank"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            GitHub account settings
          </a>
          .
        </p>
      </CardFooter>
    </Card>
  );
}

/**
 * Subscription tab — plan card, usage meter, feature list, billing actions.
 */
function SubscriptionTab({
  subscription,
  usage,
}: {
  subscription: UserSubscription;
  usage: UsageSummary;
}) {
  const planDetails = PLAN_DETAILS[subscription.plan];
  const renewalDate = formatRenewalDate(subscription.renewsAt);
  const statusLabel = getSubscriptionStatusLabel(subscription.status);

  const isActive = subscription.status === 'active' || subscription.status === 'trialing';

  const cardBorderClass = isActive
    ? 'border-blue-500/20 dark:border-blue-500/10'
    : 'border-border/50';
  let badgeTone: 'success' | 'neutral' | 'warning' | 'primary' = 'neutral';
  if (isActive) badgeTone = 'primary';
  if (subscription.status === 'canceled') badgeTone = 'warning';

  const usagePercent = usage.limit
    ? Math.min(100, Math.round((usage.used / usage.limit) * 100))
    : null;

  return (
    <Card
      className={cn(
        'rounded-xl bg-card overflow-hidden shadow-sm transition-colors',
        cardBorderClass,
      )}
    >
      <CardHeader className="border-b border-border/40 pb-5 bg-muted/20">
        <CardTitle className="text-base font-semibold tracking-tight">Subscription Plan</CardTitle>
        <CardDescription className="text-xs text-muted-foreground font-light">
          Manage your plan subscription and AI review usage metrics.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Plan info block */}
        <div
          className={cn(
            'flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4 transition-colors',
            isActive
              ? 'border-blue-500/15 bg-blue-500/[0.02] dark:border-blue-500/5'
              : 'border-border bg-muted/10',
          )}
        >
          <div className="space-y-1">
            <p
              className={cn(
                'text-sm font-bold tracking-tight',
                isActive ? 'text-blue-600 dark:text-blue-400' : 'text-foreground/80',
              )}
            >
              {planDetails.label} Plan
            </p>
            <p className="text-xs text-muted-foreground font-light">
              Status:{' '}
              <span className={isActive ? 'text-blue-600 dark:text-blue-400 font-medium' : ''}>
                {statusLabel}
              </span>
            </p>
            {renewalDate && (
              <p className="text-[10px] text-muted-foreground font-light">
                Renews on {renewalDate}
              </p>
            )}
          </div>
          <span className={statusBadge(badgeTone, 'text-[10px] font-medium')}>
            {planDetails.label}
          </span>
        </div>

        {/* Usage meter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-foreground/80">Monthly Review Usage</h4>
            {usagePercent !== null && (
              <span className="text-[10px] text-muted-foreground font-light">{usagePercent}%</span>
            )}
          </div>
          {usagePercent !== null && (
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  usagePercent >= 90
                    ? 'bg-red-500'
                    : usagePercent >= 70
                      ? 'bg-amber-500'
                      : 'bg-blue-500',
                )}
                style={{ width: `${usagePercent}%` }}
              />
            </div>
          )}
          <p className="text-xs text-muted-foreground font-light leading-relaxed">
            {getUsageText(usage)}
          </p>
        </div>

        {/* Features list */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-semibold text-foreground/80">Included Plan Features</h4>
          <ul className="space-y-2 text-xs text-muted-foreground font-light">
            {planDetails.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2.5">
                <span className="flex size-1.5 rounded-full bg-muted-foreground/60 shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 border-t border-border/40 pt-4 bg-muted/10">
        {subscription.plan === 'free' ? <UpgradeButton /> : null}
        {subscription.plan === 'pro' ? (
          <CancelSubscriptionButton disabled={subscription.status === 'canceled'} />
        ) : null}
      </CardFooter>
    </Card>
  );
}

export function SettingsContent({ profile, subscription, usage }: SettingsContentProps) {
  return (
    <div className="flex flex-1 flex-col p-6 max-w-2xl mx-auto w-full">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-muted p-0.5 rounded-lg border border-border/50">
          <TabsTrigger
            value="profile"
            className="rounded-md px-4 py-1.5 text-xs font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="subscription"
            className="rounded-md px-4 py-1.5 text-xs font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            Subscription
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6 space-y-6">
          <ProfileTab profile={profile} />
        </TabsContent>

        <TabsContent value="subscription" className="mt-6 space-y-6">
          <SubscriptionTab subscription={subscription} usage={usage} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
