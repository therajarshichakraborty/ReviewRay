import type { Metadata } from 'next';

import { CtaBannerSection } from '@/components/landing/cta-banner-section';
import { HowItWorksSection } from '@/components/landing/how-it-works-section';
import { LifecycleSection } from '@/components/landing/lifecycle-section';
import { WorkflowSection } from '@/components/landing/workflow-section';
import { getServerSession } from '@/features/auth/server/session';

export const metadata: Metadata = {
  title: 'Workflow',
  description:
    'Reviews land on GitHub as one living comment. See what happens from opening a pull request to reading its review.',
};

export default async function WorkflowPage() {
  const session = await getServerSession();

  return (
    <>
      <WorkflowSection first />
      <LifecycleSection />
      <HowItWorksSection />
      <CtaBannerSection isLoggedIn={Boolean(session)} />
    </>
  );
}
