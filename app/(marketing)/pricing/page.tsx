import type { Metadata } from 'next';

import { CtaBannerSection } from '@/components/landing/cta-banner-section';
import { PricingPlans } from '@/components/landing/pricing-plans';
import { Section, SectionHeading, SectionInner, Serif } from '@/components/landing/primitives';
import { Reveal } from '@/components/motion/reveal';
import { getServerSession } from '@/features/auth/server/session';
import { getUserSubscription } from '@/features/billing/server/subscription';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Start free with 5 AI pull request reviews per month. Upgrade to Pro for unlimited reviews on OpenAI models.',
};

const FAQ = [
  {
    q: 'Which models review my code?',
    a: 'Free reviews run on capable open models through OpenRouter. Pro reviews run on OpenAI models with a larger diff budget, which helps on bigger pull requests.',
  },
  {
    q: 'Do you store my source code?',
    a: 'Pull request diffs are read on demand to write the review. If you sync a repository for context, its code is indexed as embeddings so reviews can reference related files. You can disconnect the GitHub App at any time.',
  },
  {
    q: 'Do pushes to the same pull request use more reviews?',
    a: 'No. A pull request counts once per month. New pushes refresh the same review comment on GitHub.',
  },
  {
    q: 'Is payment secure?',
    a: 'Payments are processed by Razorpay. Card details never touch ReviewRay servers.',
  },
];

export default async function PricingPage() {
  const session = await getServerSession();
  const subscription = session ? await getUserSubscription(session.user.id) : null;

  return (
    <>
      <Section divider={false}>
        <SectionInner className="pb-14 lg:pb-16">
          <SectionHeading
            as="h1"
            label="Pricing"
            title={
              <>
                Start free. Upgrade when reviews <Serif>become a habit.</Serif>
              </>
            }
            description="One simple plan for unlimited reviews. No seats, no per-repository fees, cancel whenever you like."
          />
        </SectionInner>
        <PricingPlans
          isLoggedIn={Boolean(session)}
          currentPlan={subscription?.plan ?? null}
          user={session?.user}
        />
      </Section>

      <Section>
        <SectionInner>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
            <Reveal>
              <h2 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                Questions, <Serif>answered.</Serif>
              </h2>
            </Reveal>
            <dl>
              {FAQ.map((item, index) => (
                <Reveal
                  key={item.q}
                  delay={index * 80}
                  className="border-b border-dashed border-rail py-6 first:pt-0 last:border-b-0"
                >
                  <dt className="text-[17px] font-medium">{item.q}</dt>
                  <dd className="mt-2 leading-relaxed text-muted-foreground">{item.a}</dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </SectionInner>
      </Section>

      <CtaBannerSection isLoggedIn={Boolean(session)} />
    </>
  );
}
