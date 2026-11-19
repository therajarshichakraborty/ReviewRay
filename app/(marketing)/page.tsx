import { ArrowRight, Play } from 'lucide-react';
import Link from 'next/link';

import { CtaBannerSection } from '@/components/landing/cta-banner-section';
import { FeaturesSection } from '@/components/landing/features-section';
import { HowItWorksSection } from '@/components/landing/how-it-works-section';
import { PricingPlans } from '@/components/landing/pricing-plans';
import {
  MonoNote,
  Section,
  SectionHeading,
  SectionInner,
  SelectionBox,
  Serif,
} from '@/components/landing/primitives';
import { ReviewSampleSection } from '@/components/landing/review-sample-section';
import { ReviewStudio } from '@/components/landing/studio/review-studio';
import { WorkflowSection } from '@/components/landing/workflow-section';
import { Button } from '@/components/ui/button';
import { getServerSession } from '@/features/auth/server/session';
import { SIGN_IN_PATH } from '@/features/auth/utils';
import { getUserSubscription } from '@/features/billing/server/subscription';
import { DASHBOARD_ROUTES } from '@/features/dashboard/lib/routes';

function Hero({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <Section divider={false}>
      <div className="px-5 pt-16 pb-16 sm:px-10 sm:pt-24 lg:px-12 lg:pt-28">
        <Link
          href="/review"
          className="group animate-fade-up inline-flex items-center gap-2.5 rounded-full py-1 pr-3 pl-1 text-sm text-muted-foreground transition-colors hover:bg-muted"
        >
          <span className="rounded-full bg-primary px-2 py-0.5 font-mono text-xs font-medium text-primary-foreground">
            v2.0
          </span>
          <span className="transition-colors group-hover:text-foreground">
            Codebase-aware reviews are here
          </span>
          <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>

        <h1 className="animate-fade-up mt-8 max-w-5xl text-[44px] leading-[1.02] font-semibold tracking-[-0.045em] text-balance [animation-delay:80ms] sm:text-6xl lg:text-[82px]">
          Review with the{' '}
          <SelectionBox tag="context / codebase" className="px-1.5">
            context
          </SelectionBox>
          <br className="hidden sm:block" /> your codebase <Serif>already knows.</Serif>
        </h1>

        <p className="animate-fade-up mt-10 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground [animation-delay:160ms] sm:text-xl">
          ReviewRay is an AI reviewer that reads every pull request alongside the rest of your
          repository. Precise findings, a clear verdict and a fix you can paste, right on GitHub.
        </p>

        <div className="animate-fade-up mt-10 flex flex-wrap items-center gap-3 [animation-delay:240ms]">
          <Button
            asChild
            className="group h-11 rounded-lg px-6 text-[15px] shadow-md shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30"
          >
            <Link href={isLoggedIn ? DASHBOARD_ROUTES.overview : SIGN_IN_PATH}>
              {isLoggedIn ? 'Open dashboard' : 'Start reviewing'}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="group h-11 rounded-lg bg-background px-5 text-[15px] transition-all hover:-translate-y-0.5"
          >
            <Link href="/review">
              <Play className="size-3.5 fill-current transition-transform duration-300 group-hover:scale-110" />
              See a sample review
            </Link>
          </Button>
          <MonoNote className="ml-2 hidden sm:inline">5 free reviews / month · no card</MonoNote>
        </div>

        <div className="animate-fade-up mt-16 [animation-delay:320ms] lg:mt-20">
          <ReviewStudio />
        </div>
      </div>
    </Section>
  );
}

export default async function Home() {
  const session = await getServerSession();
  const isLoggedIn = Boolean(session?.user);
  const subscription = session ? await getUserSubscription(session.user.id) : null;

  return (
    <>
      <Hero isLoggedIn={isLoggedIn} />
      <FeaturesSection />
      <WorkflowSection />
      <ReviewSampleSection />
      <HowItWorksSection />

      <Section id="pricing">
        <SectionInner className="pb-14 lg:pb-16">
          <SectionHeading
            label="Pricing"
            title={
              <>
                Pay for <Serif>volume.</Serif> Precision is always included.
              </>
            }
          />
        </SectionInner>
        <PricingPlans
          isLoggedIn={isLoggedIn}
          currentPlan={subscription?.plan ?? null}
          user={session?.user}
        />
      </Section>

      <CtaBannerSection isLoggedIn={isLoggedIn} />
    </>
  );
}
