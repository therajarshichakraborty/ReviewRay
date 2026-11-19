import type { Metadata } from 'next';

import { CtaBannerSection } from '@/components/landing/cta-banner-section';
import { Section, SectionHeading, SectionInner, Serif } from '@/components/landing/primitives';
import { ReviewSampleSection } from '@/components/landing/review-sample-section';
import { ReviewStudio } from '@/components/landing/studio/review-studio';
import { getServerSession } from '@/features/auth/server/session';

export const metadata: Metadata = {
  title: 'Review',
  description:
    'Try ReviewRay on a sample pull request: pick files, watch them get reviewed, apply fixes and see the verdict change.',
};

export default async function ReviewPage() {
  const session = await getServerSession();

  return (
    <>
      <Section divider={false}>
        <SectionInner className="pb-16 lg:pb-20">
          <SectionHeading
            as="h1"
            label="Live demo"
            title={
              <>
                Try a review. <Serif>Click anything.</Serif>
              </>
            }
            description="This is a sample pull request with four changed files. Pick a file to scan it, apply the suggested fix, re-run the review and watch the verdict change."
          />
          <div className="animate-fade-up mt-16 [animation-delay:200ms]">
            <ReviewStudio />
          </div>
        </SectionInner>
      </Section>
      <ReviewSampleSection />
      <CtaBannerSection isLoggedIn={Boolean(session)} />
    </>
  );
}
