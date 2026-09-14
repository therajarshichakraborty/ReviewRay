import Link from 'next/link';
import { getServerSession } from '@/lib/auth-session';
import { ArrowRight, Check } from 'lucide-react';
import { PublicHeader } from '@/components/public-header';
import { HeroMockup } from '@/components/landing/hero-mockup';
import { TrustedBy } from '@/components/landing/trusted-by';
import { FeaturesSection } from '@/components/landing/features-section';
import { CodeDiffSection } from '@/components/landing/code-diff-section';
import { HowItWorksSection } from '@/components/landing/how-it-works-section';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { CtaBannerSection } from '@/components/landing/cta-banner-section';
import { Footer } from '@/components/landing/footer';

export default async function Home() {
  const session = await getServerSession();
  const isLoggedIn = !!session?.user;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white selection:bg-blue-500 selection:text-white overflow-x-hidden font-sans">
      {/* Sticky Navigation Header */}
      <PublicHeader />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
        {/* Soft atmospheric gradient lighting */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[500px] bg-blue-500/5 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 left-10 w-[400px] h-[400px] bg-indigo-500/5 dark:bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Hero Left Column: Headline, Copy, CTA */}
            <div className="lg:col-span-6 text-left">
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200/60 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50 mb-6 shadow-2xs">
                <span className="size-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
                AI-Powered Code Reviews
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-[58px] xl:text-[64px] font-extrabold tracking-[-0.035em] leading-[1.08] text-slate-950 dark:text-white">
                Smarter code
                <br />
                reviews for
                <br />
                <span className="text-blue-600 dark:text-blue-500">modern teams.</span>
              </h1>

              {/* Subtitle (Strictly NO em dashes) */}
              <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed font-normal">
                ReviewRay reads your pull requests, understands your codebase, and gives contextual,
                actionable feedback in seconds.
              </p>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Link
                  href={isLoggedIn ? '/dashboard' : '/sign-in'}
                  className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-slate-950 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md transition-all"
                >
                  <span>Get started for free</span>
                  <ArrowRight className="size-4" />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center h-11 px-6 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-xs sm:text-sm font-semibold shadow-xs transition-all"
                >
                  See how it works
                </a>
              </div>

              {/* Value Props Checklist */}
              <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-slate-600 dark:text-slate-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <Check className="size-3.5 text-slate-800 dark:text-slate-200 stroke-[2.5]" />
                  No credit card
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="size-3.5 text-slate-800 dark:text-slate-200 stroke-[2.5]" />
                  Easy GitHub setup
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="size-3.5 text-slate-800 dark:text-slate-200 stroke-[2.5]" />
                  Live in 2 minutes
                </span>
              </div>
            </div>

            {/* Hero Right Column: Interactive Product Mockup */}
            <div className="lg:col-span-6">
              <HeroMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof: Trusted by developers at */}
      <TrustedBy />

      {/* Features Section: Everything you need for high-quality code */}
      <FeaturesSection isLoggedIn={isLoggedIn} />

      {/* Code Diff Section: Reviews with real understanding */}
      <CodeDiffSection />

      {/* How It Works Section: From pull request to insights, in three steps */}
      <HowItWorksSection />

      {/* Testimonials Section: What developers are saying */}
      <TestimonialsSection />

      {/* Call to Action Banner: Start reviewing smarter, today */}
      <CtaBannerSection isLoggedIn={isLoggedIn} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
