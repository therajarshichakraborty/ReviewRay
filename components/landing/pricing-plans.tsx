import { Check } from 'lucide-react';
import Link from 'next/link';

import { Reveal } from '@/components/motion/reveal';
import { Button } from '@/components/ui/button';
import { SIGN_IN_PATH } from '@/features/auth/utils';
import { UpgradeButton } from '@/features/billing/components/upgrade-button';
import { FREE_MONTHLY_LIMIT, PRO_MONTHLY_LIMIT } from '@/features/billing/constants';
import { DASHBOARD_ROUTES } from '@/features/dashboard/lib/routes';
import type { SubscriptionPlan } from '@/features/dashboard/lib/types';
import { PLAN_DETAILS, type PlanDetails } from '@/features/settings/lib/plan-details';
import { cn } from '@/lib/utils';

type PricingPlansProps = {
  isLoggedIn: boolean;
  currentPlan?: SubscriptionPlan | null;
  user?: { name?: string | null; email?: string | null } | null;
};

const NOTES = [
  {
    q: 'What counts as a review?',
    a: `Each pull request ReviewRay reviews counts once per month, no matter how many commits you push to it. Free includes ${FREE_MONTHLY_LIMIT} and Pro includes ${PRO_MONTHLY_LIMIT}.`,
  },
  {
    q: 'What happens at the limit?',
    a: 'New pull requests are marked as limit reached and a short note is left on GitHub. The count resets on the 1st.',
  },
  {
    q: 'Can I cancel any time?',
    a: 'Yes, from Settings. Pro stays active until the end of the period you paid for.',
  },
];

function PlanColumn({ plan, cta }: { plan: PlanDetails; cta: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col p-6 sm:p-8">
      <h3 className="text-lg font-medium">{plan.label}</h3>
      <p className="mt-6 text-5xl font-semibold tracking-[-0.04em]">{plan.price}</p>
      <p className="mt-2 font-mono text-xs text-muted-foreground">{plan.cadence}</p>
      <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{plan.tagline}</p>
      <ul className="mt-6 flex-1">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-3 border-b border-dashed border-rail py-3 text-[15px] last:border-b-0"
          >
            <Check className="mt-1 size-3.5 shrink-0 text-primary" strokeWidth={3} />
            {feature}
          </li>
        ))}
      </ul>
      <div className="mt-8">{cta}</div>
    </div>
  );
}

function Handle({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'animate-handle-pulse absolute size-[7px] border border-primary bg-background',
        className,
      )}
    />
  );
}

export function PricingPlans({ isLoggedIn, currentPlan, user }: PricingPlansProps) {
  const isPro = currentPlan === 'pro';

  const freeCta = (
    <Button asChild variant="outline" className="h-11 w-full rounded-lg text-sm">
      <Link href={isLoggedIn ? DASHBOARD_ROUTES.overview : SIGN_IN_PATH}>
        {isLoggedIn ? 'Open dashboard' : 'Start for free'}
      </Link>
    </Button>
  );

  let proCta: React.ReactNode;
  if (isPro) {
    proCta = (
      <Button asChild variant="outline" className="h-11 w-full rounded-lg text-sm">
        <Link href={DASHBOARD_ROUTES.settings}>Manage subscription</Link>
      </Button>
    );
  } else if (isLoggedIn) {
    proCta = (
      <UpgradeButton
        className="h-11 w-full rounded-lg text-sm"
        prefill={{ name: user?.name ?? undefined, email: user?.email ?? undefined }}
      >
        Upgrade to Pro
      </UpgradeButton>
    );
  } else {
    proCta = (
      <Button asChild className="h-11 w-full rounded-lg text-sm shadow-sm shadow-primary/25">
        <Link href={`${SIGN_IN_PATH}?callbackUrl=${encodeURIComponent('/pricing')}`}>
          Sign in to upgrade
        </Link>
      </Button>
    );
  }

  return (
    <div className="grid border-t border-rail lg:grid-cols-3">
      <Reveal>
        <PlanColumn plan={PLAN_DETAILS.free} cta={freeCta} />
      </Reveal>

      <Reveal
        delay={120}
        className="relative border-t border-dashed border-rail p-3 sm:p-5 lg:border-t-0 lg:border-l"
      >
        <div className="relative h-full border border-primary/70 bg-primary/[0.02] transition-shadow duration-500 hover:shadow-[0_20px_60px_-25px] hover:shadow-primary/40">
          <Handle className="-top-1 -left-1" />
          <Handle className="-top-1 -right-1" />
          <Handle className="-bottom-1 -left-1" />
          <Handle className="-right-1 -bottom-1" />
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-[4px] bg-primary px-1.5 py-0.5 font-mono text-[11px] font-medium text-primary-foreground shadow-sm">
            most developers
          </span>
          <PlanColumn plan={PLAN_DETAILS.pro} cta={proCta} />
        </div>
      </Reveal>

      <Reveal
        delay={240}
        className="border-t border-dashed border-rail p-6 sm:p-8 lg:border-t-0 lg:border-l"
      >
        <h3 className="text-lg font-medium">Good to know</h3>
        <dl className="mt-6 space-y-6">
          {NOTES.map((note) => (
            <div key={note.q}>
              <dt className="text-[15px] font-medium">{note.q}</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{note.a}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </div>
  );
}
