import type { Metadata } from 'next';

import { CtaBannerSection } from '@/components/landing/cta-banner-section';
import { FeaturesSection } from '@/components/landing/features-section';
import { HowItWorksSection } from '@/components/landing/how-it-works-section';
import { UnderTheHoodSection } from '@/components/landing/under-the-hood-section';
import { getServerSession } from '@/features/auth/server/session';

export const metadata: Metadata = {
  title: 'Features',
  description:
    'Severity-ranked findings, codebase context from vector search and ready-to-paste fixes on every pull request.',
};

export default async function FeaturesPage() {
  const session = await getServerSession();

  return (
    <>
      <FeaturesSection first />
      <UnderTheHoodSection />
      <HowItWorksSection />
      <CtaBannerSection isLoggedIn={Boolean(session)} />
    </>
  );
}
