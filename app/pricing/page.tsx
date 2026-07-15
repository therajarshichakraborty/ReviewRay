import Link from 'next/link';
import { getServerSession } from '@/lib/auth-session';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, Zap, Shield, Cpu, Crown } from 'lucide-react';
import { GithubLogo } from '@phosphor-icons/react/dist/ssr';

import { PublicHeader } from '@/components/public-header';

export const metadata = {
  title: 'Pricing - ReviewRay',
  description:
    'Simple, transparent pricing. Start free with 5 AI reviews per month. Upgrade to Pro for unlimited reviews.',
};

const FREE_FEATURES = [
  '5 AI pull request reviews / month',
  'GitHub App integration',
  'Codebase-aware analysis',
  'Review comments on PRs',
  'Basic security checks',
];

const PRO_FEATURES = [
  'Unlimited AI pull request reviews',
  'Priority review queue (< 5s)',
  'Advanced security & vulnerability scanning',
  'Performance pattern analysis',
  'Architecture & design suggestions',
  'Dedicated support',
  'All Free plan features',
];

const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_TEST_API_KEY ?? '';

export default async function PricingPage() {
  const session = await getServerSession();
  const isLoggedIn = !!session?.user;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,oklch(0.93_0.03_255/60%),transparent)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,oklch(0.20_0.04_255/50%),transparent)]">
        <PublicHeader />
      </div>
      <section className="relative py-20 text-center overflow-hidden">
        <div className="hero-grid-bg animate-grid absolute inset-0 opacity-40 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,oklch(0.93_0.03_255/60%),transparent)] dark:bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,oklch(0.20_0.04_255/40%),transparent)] pointer-events-none" />
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 backdrop-blur-sm px-3.5 py-1.5 text-[11px] font-medium text-muted-foreground mb-6">
            <Cpu className="size-3 text-blue-500" /> Simple, transparent pricing
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Start free. Scale when ready.
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-light max-w-xl mx-auto leading-relaxed">
            ReviewRay is free for small teams. Upgrade to Pro for unlimited reviews and priority
            processing.
          </p>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="pb-24 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Free Plan */}
            <div className="relative rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-8 shadow-sm flex flex-col gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold tracking-tight">Free</h2>
                  <span className="inline-flex items-center rounded-full border border-border/60 bg-muted/60 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                    Current plan
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black tracking-tight">₹0</span>
                  <span className="text-sm text-muted-foreground font-light">/ month</span>
                </div>
                <p className="text-xs text-muted-foreground font-light leading-relaxed">
                  Perfect for solo developers and small open-source projects. No credit card
                  required.
                </p>
              </div>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full h-11 rounded-xl border-border/60 font-medium"
              >
                <Link href={isLoggedIn ? '/dashboard' : '/sign-in'}>
                  {isLoggedIn ? 'Go to Dashboard' : 'Get started free'}
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>

              <ul className="space-y-3">
                {FREE_FEATURES.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 text-xs text-muted-foreground font-light"
                  >
                    <Check className="size-3.5 text-emerald-500 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro Plan */}
            <div className="relative rounded-2xl border-2 border-blue-500 bg-gradient-to-b from-blue-50/40 to-card/60 dark:from-blue-950/30 dark:to-card/60 backdrop-blur-sm p-8 shadow-lg flex flex-col gap-6">
              {/* Popular badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1 text-[11px] font-semibold text-white shadow-sm">
                  <Crown className="size-3" /> Most popular
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold tracking-tight text-blue-700 dark:text-blue-300">
                    Pro
                  </h2>
                  <div className="flex items-center gap-1.5 text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                    <Zap className="size-3" /> Unlimited reviews
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black tracking-tight">₹199</span>
                  <span className="text-sm text-muted-foreground font-light">/ month</span>
                </div>
                <p className="text-xs text-muted-foreground font-light leading-relaxed">
                  For professional developers and growing teams who need unlimited AI reviews
                  without limits.
                </p>
              </div>

              {/* Razorpay payment button */}
              <RazorpayCheckoutButton
                keyId={RAZORPAY_KEY_ID}
                isLoggedIn={isLoggedIn}
                userEmail={session?.user?.email ?? ''}
                userName={session?.user?.name ?? ''}
              />

              <ul className="space-y-3">
                {PRO_FEATURES.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 text-xs text-muted-foreground font-light"
                  >
                    <Check className="size-3.5 text-blue-500 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-xs text-muted-foreground">
            {[
              { icon: <Shield className="size-3 text-emerald-500" />, label: 'No hidden fees' },
              { icon: <Check className="size-3 text-emerald-500" />, label: 'Cancel anytime' },
              { icon: <Zap className="size-3 text-blue-500" />, label: 'Instant activation' },
              { icon: <Shield className="size-3 text-blue-500" />, label: 'Secure via Razorpay' },
            ].map((b) => (
              <span key={b.label} className="flex items-center gap-1.5 font-light">
                {b.icon}
                {b.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border/40 py-16 bg-muted/20">
        <div className="container mx-auto max-w-2xl px-4 sm:px-6">
          <h2 className="text-xl font-bold tracking-tight mb-8 text-center">
            Frequently asked questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'What counts as one PR review?',
                a: 'Each pull request that triggers an AI review counts as one review — regardless of how many commits or files it contains.',
              },
              {
                q: 'What happens when I hit the free limit?',
                a: 'ReviewRay will stop posting reviews for the rest of the month. You\'ll see a "rate limited" badge on those PRs. Upgrade to Pro for unlimited reviews.',
              },
              {
                q: 'Can I cancel Pro anytime?',
                a: 'Yes. You can cancel your subscription from the Settings page at any time. Your plan stays active until the end of the billing cycle.',
              },
              {
                q: 'Is payment secure?',
                a: 'All payments are processed securely through Razorpay, a PCI-DSS Level 1 certified payment gateway. We never store your card details.',
              },
            ].map((faq) => (
              <div key={faq.q} className="border-b border-border/40 pb-5 last:border-b-0">
                <h3 className="text-sm font-semibold mb-2">{faq.q}</h3>
                <p className="text-xs text-muted-foreground font-light leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded bg-foreground text-background">
              <span className="font-mono text-[10px] font-black">R</span>
            </div>
            <span className="text-xs font-semibold text-muted-foreground">ReviewRay</span>
          </Link>
          <p className="text-[11px] text-muted-foreground font-light">
            © {new Date().getFullYear()} ReviewRay. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/**
 * Client-side Razorpay checkout button.
 * Opens the Razorpay payment modal for the Pro plan (₹199/mo).
 *
 * TODO: Replace RAZORPAY_KEY_ID with your actual Razorpay Key ID in .env.local:
 *   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
 */
function RazorpayCheckoutButton({
  keyId,
  isLoggedIn,
  userEmail,
  userName,
}: {
  keyId: string;
  isLoggedIn: boolean;
  userEmail: string;
  userName: string;
}) {
  if (!isLoggedIn) {
    return (
      <Button asChild size="lg" className="w-full h-11 rounded-xl font-medium">
        <Link href="/sign-in">
          <GithubLogo className="mr-2 size-4" />
          Sign in to upgrade
        </Link>
      </Button>
    );
  }

  return <RazorpayButton keyId={keyId} email={userEmail} name={userName} />;
}

// Inline client component for Razorpay
// This must be a separate file in production, but kept inline here for brevity
import RazorpayButton from './_razorpay-button';
