'use client';
/**
 * Settings page body with Profile and Subscription tabs.
 *
 * Profile fields are read-only (sourced from GitHub). Subscription tab shows
 * plan details, usage, and upgrade/cancel actions via billing components.
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
import { statusBadge } from '../lib/status-style';
import { CancelSubscriptionButton } from '@/features/billing/components/cancel-subscription-button';
import { getDisplayName, getInitials } from '@/features/auth/components/user-menu';

type SettingsContentProps = {
  profile: SettingsProfile;
  subscription: UserSubscription;
  usage: UsageSummary;
};

/**
 * Formats a renewal ISO date for display, or returns null when absent.
 *
 * @param renewsAt - Subscription renewal timestamp or null.
 * @returns Formatted date like "June 12, 2026", or null.
 */
function formatRenewalDate(renewsAt: string | null): string | null {
  if (!renewsAt) {
    return null;
  }

  return format(new Date(renewsAt), 'MMMM d, yyyy');
}

/**
 * Maps subscription status enum to a lowercase label for the UI.
 *
 * @param status - `active`, `trialing`, or `canceled`.
 * @returns Display string for the status line.
 */
function getSubscriptionStatusLabel(status: UserSubscription['status']): string {
  if (status === 'active') {
    return 'active';
  }

  if (status === 'trialing') {
    return 'trialing';
  }

  return 'canceled';
}

/**
 * Profile tab — avatar, read-only name/email, member since date.
 *
 * @param profile - User profile from GitHub OAuth.
 * @returns Profile card content.
 */
function ProfileTab({ profile }: { profile: SettingsProfile }) {
  const displayName = getDisplayName(profile);
  const initials = getInitials(profile);
  const memberSince = format(new Date(profile.memberSince), 'MMMM d, yyyy');

  return (
    <Card className="rounded-xl border border-border/60 bg-card/30 backdrop-blur-sm shadow-sm overflow-hidden">
      <CardHeader className="border-b border-border/40 pb-5">
        <CardTitle className="text-base font-semibold tracking-tight">Profile Settings</CardTitle>
        <CardDescription className="text-xs text-muted-foreground font-light">Account information from your GitHub authentication.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-5">
        <div className="flex items-center gap-4">
          <Avatar size="lg" className="border border-border/60 shadow-sm">
            {profile.image ? <AvatarImage src={profile.image} alt={displayName} /> : null}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-0.5">
            <p className="font-semibold text-sm text-foreground/90">{displayName}</p>
            <p className="text-xs text-muted-foreground font-light">{profile.email}</p>
            <p className="text-[10px] text-muted-foreground font-light">Member since {memberSince}</p>
          </div>
        </div>
        <Separator className="bg-border/40" />
        <div className="grid gap-4 max-w-md">
          <div className="grid gap-1.5">
            <Label htmlFor="name" className="text-xs font-medium text-foreground/80">Display name</Label>
            <Input id="name" defaultValue={profile.name} readOnly className="h-9 rounded-lg border-border/60 bg-background/30 text-xs focus-visible:ring-0 focus-visible:border-border cursor-not-allowed select-none" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="email" className="text-xs font-medium text-foreground/80">Email</Label>
            <Input id="email" type="email" defaultValue={profile.email} readOnly className="h-9 rounded-lg border-border/60 bg-background/30 text-xs focus-visible:ring-0 focus-visible:border-border cursor-not-allowed select-none" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t border-border/40 pt-4 bg-muted/10">
        <p className="text-xs text-muted-foreground/85 font-light">
          Profile details are managed by GitHub. Update them directly in your GitHub account settings.
        </p>
      </CardFooter>
    </Card>
  );
}

/**
 * Builds the monthly usage summary line for the subscription tab.
 *
 * @param usage - Review count used and optional monthly limit.
 * @returns Sentence describing current usage.
 */
function getUsageText(usage: UsageSummary): string {
  if (usage.limit === null) {
    return `You've used ${usage.used} reviews this month (unlimited reviews).`;
  }

  return `You've used ${usage.used} out of your ${usage.limit} monthly reviews.`;
}

/**
 * Subscription tab — plan card, usage, feature list, billing actions.
 *
 * @param subscription - Current plan and billing status.
 * @param usage - Monthly AI review usage counts.
 * @returns Subscription management card.
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

  // Monochrome variables reflecting active state
  let cardBorderClass = 'border-border/60';
  let planTextClass = 'text-foreground/90';
  let statusTextClass = 'text-muted-foreground';
  let badgeTone: 'success' | 'neutral' | 'warning' = 'neutral';

  if (isActive) {
    cardBorderClass = 'border-neutral-300 dark:border-neutral-800';
    planTextClass = 'text-foreground font-semibold';
    statusTextClass = 'text-foreground/95 font-medium';
    badgeTone = 'success';
  }

  if (subscription.status === 'canceled') {
    badgeTone = 'warning';
  }

  return (
    <Card className={cn("rounded-xl shadow-sm bg-card/30 backdrop-blur-sm overflow-hidden", cardBorderClass)}>
      <CardHeader className="border-b border-border/40 pb-5">
        <CardTitle className="text-base font-semibold tracking-tight">Subscription Plan</CardTitle>
        <CardDescription className="text-xs text-muted-foreground font-light">Manage your plan subscription and review usage metrics.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-5">
        <div
          className={cn(
            'flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4 transition-colors',
            isActive ? 'border-neutral-300 dark:border-neutral-800 bg-neutral-100/30 dark:bg-neutral-900/40' : 'border-border/60 bg-muted/20',
          )}
        >
          <div className="space-y-1">
            <p className={cn('text-sm font-semibold tracking-tight', planTextClass)}>{planDetails.label} Plan</p>
            <p className="text-xs text-muted-foreground font-light">
              Status: <span className={statusTextClass}>{statusLabel}</span>
            </p>
            {renewalDate ? (
              <p className="text-[10px] text-muted-foreground font-light">Renews on {renewalDate}</p>
            ) : null}
          </div>
          <span className={statusBadge(badgeTone, 'text-[10px] font-medium')}>{planDetails.label}</span>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-foreground/80">Monthly Review Usage</h4>
          <p className="text-xs text-muted-foreground font-light leading-relaxed">{getUsageText(usage)}</p>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-foreground/80">Included Plan Features</h4>
          <ul className="space-y-2 text-xs text-muted-foreground font-light">
            {planDetails.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <span className="flex size-1 rounded-full bg-neutral-400" />
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

/**
 * Settings page with tabbed Profile and Subscription sections.
 *
 * @param profile - User profile data from the server.
 * @param subscription - Billing subscription state.
 * @param usage - Monthly review usage summary.
 * @returns Tabbed settings UI below `DashboardHeader`.
 */
export function SettingsContent({ profile, subscription, usage }: SettingsContentProps) {
  return (
    <div className="flex flex-1 flex-col p-6">
      <Tabs defaultValue="profile" className="w-full max-w-2xl">
        <TabsList className="bg-neutral-100/60 dark:bg-neutral-900/60 p-0.5 rounded-lg border border-border/60">
          <TabsTrigger value="profile" className="rounded-md px-4 py-1.5 text-xs font-medium">Profile</TabsTrigger>
          <TabsTrigger value="subscription" className="rounded-md px-4 py-1.5 text-xs font-medium">Subscription</TabsTrigger>
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
