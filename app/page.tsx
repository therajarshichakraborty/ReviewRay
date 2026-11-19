import Link from 'next/link';
import { getServerSession } from '@/lib/auth-session';
import { ArrowRight, Check, Play, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white selection:bg-blue-600 selection:text-white overflow-x-hidden font-sans">
      {/* Sticky Navigation Header */}
      <PublicHeader />

      {/* Hero Section (Aceternity UI Marquee Studio Style) */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
        {/* Soft atmospheric gradient lighting */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[500px] bg-blue-500/5 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 left-10 w-[400px] h-[400px] bg-indigo-500/5 dark:bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

        {/* Faint matrix code background watermark (Image 2 style) */}
        <div className="absolute inset-0 pointer-events-none select-none opacity-[0.025] dark:opacity-[0.04] font-mono text-xs leading-loose overflow-hidden">
          <p className="break-words">
            01010010 01100101 01110110 01101001 01100101 01110111 01010010 01100001 01111001
            import &#123; openai &#125; from &apos;@/features/ai&apos;; const model = &apos;gpt-4o-mini&apos;;
            ast.traverse(node =&gt; &#123; if (node.isUnsafe) flagBug(node); &#125;);
            01010010 01100101 01110110 01101001 01100101 01110111 01010010 01100001 01111001
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Version Pill Badge (Aceternity Image 1 Style: v4.0 Live components are here ->) */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-slate-100/80 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 mb-8 shadow-2xs hover:border-blue-300 dark:hover:border-blue-800 transition-colors">
            <span className="px-1.5 py-0.5 rounded-full bg-blue-600 text-white font-mono text-[10px] font-bold">
              v2.4
            </span>
            <span className="font-medium text-slate-700 dark:text-slate-300">
              OpenAI GPT-4o engine is now live
            </span>
            <ArrowRight className="size-3 text-slate-400" />
          </div>

          {/* Hero Main Headline with Aceternity Inspect Selection Box */}
          <h1 className="text-4xl sm:text-5xl lg:text-[68px] font-extrabold tracking-[-0.035em] leading-[1.08] text-slate-950 dark:text-white max-w-4xl mx-auto">
            Review with the{' '}
            <span className="relative inline-block mt-1 sm:mt-0">
              {/* Blue outline inspect selection box */}
              <span className="relative z-10 px-2 py-0.5 border border-blue-500/80 dark:border-blue-400 bg-blue-50/40 dark:bg-blue-950/30 rounded-md">
                components
                {/* 4 corner handles */}
                <span className="absolute -top-1 -left-1 size-2 bg-white border border-blue-600 rounded-xs" />
                <span className="absolute -top-1 -right-1 size-2 bg-white border border-blue-600 rounded-xs" />
                <span className="absolute -bottom-1 -left-1 size-2 bg-white border border-blue-600 rounded-xs" />
                <span className="absolute -bottom-1 -right-1 size-2 bg-white border border-blue-600 rounded-xs" />
              </span>
              {/* Attached bottom tag (Button / primary in screenshot -> review / strict-mode) */}
              <span className="absolute left-1/2 -translate-x-1/2 -bottom-5 z-20 font-mono text-[9px] font-semibold bg-blue-600 text-white px-2 py-0.5 rounded-sm shadow-xs uppercase tracking-wider whitespace-nowrap">
                review / strict-mode
              </span>
            </span>
            <br />
            your team already ships.
          </h1>

          {/* Subtitle */}
          <p className="mt-8 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
            ReviewRay is an AI review engine that runs on your codebase. Every pull request gets
            instant security audits, bug prevention, and production-ready snippets.
          </p>

          {/* CTA Buttons (Vibrant Blue Pill + White Tour Pill) */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href={isLoggedIn ? '/dashboard' : '/sign-in'}
              className="inline-flex items-center gap-2 h-11 px-7 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/25 transition-all"
            >
              <span>Start reviewing</span>
              <ArrowRight className="size-4" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-xs sm:text-sm font-semibold shadow-xs transition-all"
            >
              <Play className="size-3.5 fill-current text-blue-600 dark:text-blue-400" />
              <span>Watch the 2-min tour</span>
            </a>
          </div>

          {/* Micro Value Proposition Bar */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>free for 3 repos</span>
            <span>·</span>
            <span>no credit card</span>
            <span>·</span>
            <span>zero emoji clutter</span>
          </div>

          {/* Interactive Studio Hero Canvas Mockup */}
          <div className="mt-14 lg:mt-18">
            <HeroMockup />
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

      {/* Call to Action Banner (Image 2 style): Stop waiting on slow pull request reviews */}
      <CtaBannerSection isLoggedIn={isLoggedIn} />

      {/* Footer (Image 2 style) */}
      <Footer />
    </div>
  );
}
