import Link from 'next/link';
import { getServerSession } from '@/lib/auth-session';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Bot,
  Check,
  Code2,
  Cpu,
  ExternalLink,
  GitBranch,
  GitPullRequest,
  Lock,
  MessageSquareCode,
  Shield,
  Sparkles,
  Terminal,
  Webhook,
  Zap,
} from 'lucide-react';
import { GithubLogo } from '@phosphor-icons/react/dist/ssr';
import { PublicHeader } from '@/components/public-header';

export default async function Home() {
  const session = await getServerSession();
  const isLoggedIn = !!session?.user;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,oklch(0.93_0.03_255/60%),transparent)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,oklch(0.20_0.04_255/50%),transparent)]">
        <PublicHeader />
      </div>

      <section className="relative min-h-[88vh] flex flex-col items-center justify-center py-24 md:py-36 overflow-hidden">
        <div className="hero-grid-bg animate-grid absolute inset-0 pointer-events-none opacity-50" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,oklch(0.93_0.03_255/60%),transparent)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,oklch(0.20_0.04_255/50%),transparent)]" />

        <div className="container mx-auto max-w-5xl px-4 sm:px-6 text-center relative z-10">
          {/* Pill badge */}
          <div className="animate-badge-in inline-flex items-center gap-2 rounded-full border border-blue-200/60 dark:border-blue-800 bg-blue-50/80 dark:bg-blue-950 backdrop-blur-sm px-3.5 py-1.5 text-[11px] font-medium text-blue-700 dark:text-blue-400 shadow-sm mb-8">
            <span className="relative flex size-2">
              <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-blue-500" />
            </span>
            AI-Powered Code Reviews · Now in Early Access
          </div>

          <h1 className="animate-fade-up delay-100 text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] text-balance mb-6">
            Code reviews that move
            <br />
            <span className="text-shimmer">at the speed of thought</span>
          </h1>

          <p className="animate-fade-up delay-200 text-sm sm:text-lg text-muted-foreground max-w-xl mx-auto mb-10 font-light leading-relaxed text-balance">
            ReviewRay connects to GitHub and posts contextual, codebase-aware AI reviews directly on
            your pull requests - within seconds.
          </p>

          <div className="animate-fade-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
            {isLoggedIn ? (
              <Button
                asChild
                size="lg"
                className="h-11 px-7 bg-blue-500 text-white rounded-xl text-sm font-medium shadow-sm"
              >
                <Link href="/dashboard">
                  Go to Dashboard <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            ) : (
              <Button
                asChild
                size="lg"
                className="h-11 px-7 rounded-xl text-sm font-medium shadow-sm"
              >
                <Link href="/sign-in">
                  <GithubLogo className="mr-2 size-4" />
                  Connect GitHub - it&apos;s free
                </Link>
              </Button>
            )}
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-11 px-7 rounded-xl text-sm font-medium border-blue-200/50 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30"
            >
              <Link href="/pricing">
                View Pricing <Zap className="ml-2 size-3.5" />
              </Link>
            </Button>
          </div>

          {/* Hero Terminal Mockup */}
          <div className="animate-fade-up delay-400 animate-float relative max-w-3xl mx-auto">
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-blue-200/40 dark:from-blue-800/30 to-transparent pointer-events-none" />
            <div className="absolute -inset-8 bg-gradient-to-b from-background/0 via-background/0 to-background pointer-events-none z-10" />

            <div className="relative rounded-2xl border border-blue-900/30 bg-neutral-950 overflow-hidden shadow-2xl shadow-blue-900/10 text-left">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-blue-950/10">
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-red-500/70" />
                  <span className="size-2.5 rounded-full bg-yellow-500/70" />
                  <span className="size-2.5 rounded-full bg-green-500/70" />
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-500">
                  <GitPullRequest className="size-3" />
                  <span>feature/add-metrics · PR #142</span>
                </div>
                <span className="text-[10px] font-mono text-blue-400/80">● REVIEW_RAY</span>
              </div>

              <div className="p-5 font-mono text-xs space-y-1">
                <div className="flex gap-4 text-neutral-600">
                  <span className="w-5 text-right select-none">10</span>
                  <span className="text-neutral-500"> {'  '}// fetch user metrics</span>
                </div>
                <div className="flex gap-4 bg-red-950/30 rounded px-1 -mx-1">
                  <span className="w-5 text-right select-none text-red-500">11</span>
                  <span className="text-red-400">
                    - {'  '}const result = data.map(d =&gt; d.value);
                  </span>
                </div>
                <div className="flex gap-4 bg-green-950/30 rounded -mx-1 px-1">
                  <span className="w-5 text-right select-none text-green-500">11</span>
                  <span className="text-green-400">
                    + {'  '}const result = data?.map(d =&gt; d.value) ?? [];
                  </span>
                </div>
                <div className="flex gap-4 bg-green-950/30 rounded -mx-1 px-1">
                  <span className="w-5 text-right select-none text-green-500">12</span>
                  <span className="text-green-400">+ {'  '}if (!result.length) return null;</span>
                </div>
                <div className="flex gap-4 text-neutral-600">
                  <span className="w-5 text-right select-none">13</span>
                  <span className="text-neutral-500">
                    {' '}
                    {'  '}return result.reduce((a, b) =&gt; a + b, 0);
                  </span>
                </div>
              </div>

              <div className="mx-4 mb-4 rounded-xl border border-blue-500/20 bg-blue-950/30 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex size-6 items-center justify-center rounded-md bg-white text-black shadow-sm">
                      <Bot className="size-3.5" />
                    </div>
                    <span className="font-sans font-semibold text-xs text-white">ReviewRay AI</span>
                    <span className="font-sans text-[10px] text-neutral-400">just now</span>
                  </div>
                  <span className="text-[10px] font-sans bg-blue-500/15 text-blue-400 border border-blue-500/25 px-2 py-0.5 rounded-full font-medium">
                    ✦ Improvement
                  </span>
                </div>
                <div className="font-sans text-xs text-neutral-300 leading-relaxed">
                  Good fix — optional chaining prevents the runtime error. Consider also adding a{' '}
                  <code className="bg-neutral-800 px-1 py-0.5 rounded text-white font-mono text-[11px]">
                    null
                  </code>{' '}
                  guard before the reduce call to match the utility pattern used in{' '}
                  <code className="bg-neutral-800 px-1 py-0.5 rounded text-white font-mono text-[11px]">
                    src/utils/metrics.ts
                  </code>
                  .
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Social proof strip ──────────────────────────────────── */}
      <div className="border-y border-border/40 bg-blue-50/30 dark:bg-blue-950/10 py-5">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-xs text-muted-foreground">
            <span className="font-medium text-foreground/50 uppercase tracking-widest text-[10px]">
              Trusted by developers at
            </span>
            {['Vercel', 'Linear', 'Stripe', 'Loom', 'Railway', 'Planetscale'].map((co) => (
              <span
                key={co}
                className="font-semibold text-foreground/35 hover:text-foreground/60 transition-colors cursor-default"
              >
                {co}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Features ────────────────────────────────────────────── */}
      <section id="features" className="py-24 border-t border-border/40">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40 bg-blue-50/60 dark:bg-blue-950/20 rounded-full px-3 py-1 mb-4">
              <Sparkles className="size-3" /> Features
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-3">
              Built for engineering excellence
            </h2>
            <p className="text-sm text-muted-foreground font-light leading-relaxed">
              Every feature is designed around developer workflow — not just bolted-on AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: <MessageSquareCode className="size-5" />,
                label: 'Contextual Reviews',
                desc: 'ReviewRay reads your entire codebase — not just the diff. It understands which utilities you import, the libraries your team uses, and your existing patterns.',
              },
              {
                icon: <Zap className="size-5" />,
                label: 'Seconds, Not Hours',
                desc: 'Reviews post directly on the PR within seconds of the push event. Your team never waits on code review to keep shipping.',
              },
              {
                icon: <Webhook className="size-5" />,
                label: 'GitHub Native',
                desc: 'Plugs into GitHub via an official GitHub App — not a CI hack. Permissions are scoped, revocable, and compliant out of the box.',
              },
              {
                icon: <Lock className="size-5" />,
                label: 'Private by Default',
                desc: 'Your code is never stored beyond the review window. We scope repo access per-installation with full transparency on what we read.',
              },
              {
                icon: <GitBranch className="size-5" />,
                label: 'Any Branch, Any Repo',
                desc: 'Works on any branch. Grant access to one repo or your entire org. No YAML files, no config pipelines, no friction.',
              },
              {
                icon: <Shield className="size-5" />,
                label: 'Security Analysis',
                desc: 'Catches common vulnerability patterns — unvalidated inputs, weak auth patterns, exposed secrets — before your code ships to production.',
              },
            ].map((f, i) => (
              <div
                key={f.label}
                className={`card-hover border border-border/60 bg-card/50 p-6 rounded-xl space-y-3 animate-fade-up delay-${(i + 1) * 100} group`}
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-100/60 dark:border-blue-900/40 group-hover:bg-blue-100 dark:group-hover:bg-blue-950/50 transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-sm">{f.label}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="py-24 border-t border-border/40 bg-blue-50/20 dark:bg-blue-950/10"
      >
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground border border-border rounded-full px-3 py-1 mb-4">
              <Terminal className="size-3" /> Setup
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-3">
              Zero config. Live in 2 minutes.
            </h2>
            <p className="text-sm text-muted-foreground font-light">
              No YAML. No webhooks to configure. No CI pipeline changes.
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-px bg-border/40 rounded-2xl overflow-hidden border border-border/40">
            {[
              {
                step: '01',
                title: 'Connect GitHub',
                desc: 'Sign in with your GitHub account. Install the ReviewRay GitHub App on your user account or organization with one click.',
                icon: <GithubLogo className="size-4" />,
              },
              {
                step: '02',
                title: 'Select Repositories',
                desc: 'Choose which repositories to monitor. You can grant access to just one repo or your entire org — fully revocable at any time.',
                icon: <Code2 className="size-4" />,
              },
              {
                step: '03',
                title: 'Open a Pull Request',
                desc: "That's it. The moment your PR opens, ReviewRay triggers automatically and posts a codebase-aware review as a comment.",
                icon: <GitPullRequest className="size-4" />,
              },
            ].map((s, i) => (
              <div key={s.step} className="bg-background/80 p-8 space-y-4 relative group">
                <div className="absolute top-4 right-4 font-mono text-5xl font-black text-border/30 leading-none select-none group-hover:text-blue-200/40 dark:group-hover:text-blue-900/40 transition-colors">
                  {s.step}
                </div>
                <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100/60 dark:border-blue-900/40 text-blue-600 dark:text-blue-400">
                  {s.icon}
                </div>
                <h3 className="font-semibold text-sm text-foreground">{s.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                {i < 2 && (
                  <div className="hidden md:flex absolute top-1/2 -right-3 z-10 -translate-y-1/2 size-6 items-center justify-center rounded-full bg-background border border-border text-blue-500">
                    <ArrowRight className="size-3" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Statistics ──────────────────────────────────────────── */}
      <section className="py-20 border-t border-border/40">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 rounded-2xl overflow-hidden border border-border/40 divide-x divide-y md:divide-y-0 divide-border/40">
            {[
              { val: '99.8%', label: 'Uptime SLA' },
              { val: '< 12s', label: 'Avg. Review Time' },
              { val: '10×', label: 'PR Velocity Boost' },
              { val: '0', label: 'Config Files Needed' },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-blue-50/20 dark:bg-blue-950/10 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors px-6 py-10 text-center group"
              >
                <div className="text-3xl sm:text-4xl font-bold tracking-tight mb-2 text-blue-700 dark:text-blue-300 group-hover:scale-105 transition-transform origin-bottom">
                  {s.val}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────── */}
      <section className="py-24 border-t border-border/40 bg-blue-50/10 dark:bg-blue-950/5">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground border border-border rounded-full px-3 py-1 mb-4">
              <Check className="size-3 text-emerald-500" /> Social proof
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-3">
              Loved by engineering teams
            </h2>
            <p className="text-sm text-muted-foreground font-light">
              What developers are saying about their new AI reviewer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                quote:
                  'ReviewRay caught three circular imports and a security issue in our billing controller before any human even opened the PR. Insane catch rate.',
                name: 'Alex Hughes',
                role: 'Staff Engineer',
                co: 'LinearScale',
                initials: 'AH',
              },
              {
                quote:
                  'No more nitpick wars in comments. ReviewRay handles style, safety, and common footguns automatically — our devs focus on what actually matters.',
                name: 'Sarah Mercer',
                role: 'VP Engineering',
                co: 'DevHub',
                initials: 'SM',
              },
              {
                quote:
                  "Connected in under 5 minutes across 12 microservices. Didn't touch a single config file. We've shipped 40% faster since we plugged it in.",
                name: 'Rohan Kapoor',
                role: 'Lead Architect',
                co: 'FintechFlow',
                initials: 'RK',
              },
            ].map((t, i) => (
              <div
                key={t.name}
                className={`card-hover border border-border/60 bg-card/60 p-6 rounded-xl flex flex-col gap-4 animate-fade-up delay-${(i + 1) * 200}`}
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <svg key={j} viewBox="0 0 12 12" className="size-3 fill-amber-400">
                      <path d="M6 0l1.5 3.5L11 4l-2.5 2.4.6 3.6L6 8.5 2.9 10l.6-3.6L1 4l3.5-.5z" />
                    </svg>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-3 border-t border-border/40">
                  <span className="size-8 rounded-full bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center font-bold text-[10px] text-blue-700 dark:text-blue-300 shrink-0">
                    {t.initials}
                  </span>
                  <div>
                    <p className="text-xs font-semibold leading-none">{t.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {t.role} · {t.co}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────────── */}
      <section className="py-24 border-t border-border/40">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <div className="relative rounded-2xl border border-blue-200/50 dark:border-blue-800/40 bg-gradient-to-br from-blue-50/60 via-card to-card dark:from-blue-950/30 overflow-hidden">
            <div className="hero-grid-bg absolute inset-0 pointer-events-none opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-br from-background/50 via-transparent to-background/80 pointer-events-none" />

            <div className="relative px-8 py-16 md:px-16 text-center">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40 bg-blue-50/60 dark:bg-blue-950/20 rounded-full px-3 py-1 mb-6">
                <Cpu className="size-3" /> Free during Early Access
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4 text-balance">
                Start reviewing smarter, today.
              </h2>
              <p className="text-sm text-muted-foreground font-light max-w-md mx-auto mb-8 leading-relaxed">
                No credit card needed. Connect GitHub and get instant AI reviews on every pull
                request you open.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                {isLoggedIn ? (
                  <Button asChild size="lg" className="h-11 px-8 rounded-xl text-sm font-medium">
                    <Link href="/dashboard">
                      Open Dashboard <ArrowRight className="ml-2 size-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button
                    asChild
                    size="lg"
                    className="h-11 px-8 rounded-xl text-sm font-medium shadow-sm"
                  >
                    <Link href="/sign-in">
                      <GithubLogo className="mr-2 size-4" />
                      Connect GitHub — Free
                    </Link>
                  </Button>
                )}
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-11 px-8 rounded-xl text-sm font-medium border-blue-200/50 dark:border-blue-800/40 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                >
                  <Link href="/pricing">
                    See Pricing <Zap className="ml-2 size-3.5" />
                  </Link>
                </Button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-5 mt-10 text-xs text-muted-foreground">
                {[
                  { icon: <Check className="size-3 text-emerald-500" />, label: 'No credit card' },
                  { icon: <Check className="size-3 text-emerald-500" />, label: 'Cancel anytime' },
                  { icon: <Lock className="size-3 text-blue-500" />, label: 'Private & secure' },
                  { icon: <Zap className="size-3 text-blue-500" />, label: 'Live in 2 minutes' },
                ].map((b) => (
                  <span key={b.label} className="flex items-center gap-1.5 font-light">
                    {b.icon}
                    {b.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="border-t border-border/40 bg-blue-50/20 dark:bg-blue-950/10">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-foreground text-background shadow-sm">
                  <span className="font-mono text-xs font-black">R</span>
                </div>
                <span className="font-sans text-sm font-semibold">ReviewRay</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-xs font-light">
                AI code reviews that plug directly into your GitHub workflow. Contextual, fast, and
                private.
              </p>
              <div className="flex items-center gap-3">
                <Link
                  href="https://github.com"
                  target="_blank"
                  className="flex size-8 items-center justify-center rounded-lg border border-border/60 text-muted-foreground hover:text-blue-600 hover:border-blue-300 dark:hover:border-blue-800 transition-all"
                  aria-label="GitHub"
                >
                  <GithubLogo className="size-4" />
                </Link>
                <Link
                  href="https://twitter.com"
                  target="_blank"
                  className="flex size-8 items-center justify-center rounded-lg border border-border/60 text-muted-foreground hover:text-blue-600 hover:border-blue-300 dark:hover:border-blue-800 transition-all"
                  aria-label="X / Twitter"
                >
                  <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[11px] font-semibold uppercase tracking-widest text-foreground/50">
                Product
              </h4>
              <ul className="space-y-2.5">
                {[
                  { label: 'Features', href: '#features' },
                  { label: 'How it works', href: '#how-it-works' },
                  { label: 'Pricing', href: '/pricing' },
                  { label: 'Changelog', href: '#' },
                ].map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-xs text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-light"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-[11px] font-semibold uppercase tracking-widest text-foreground/50">
                Developers
              </h4>
              <ul className="space-y-2.5">
                {[
                  { label: 'Documentation', href: 'https://github.com' },
                  { label: 'GitHub App', href: 'https://github.com' },
                  { label: 'Webhooks', href: '#' },
                  { label: 'API Reference', href: '#' },
                ].map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      target={l.href.startsWith('http') ? '_blank' : undefined}
                      className="text-xs text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-light"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-[11px] font-semibold uppercase tracking-widest text-foreground/50">
                Legal
              </h4>
              <ul className="space-y-2.5">
                {[
                  { label: 'Privacy Policy', href: '/privacy' },
                  { label: 'Terms of Service', href: '/terms' },
                  { label: 'Security', href: '#' },
                  { label: 'DPA', href: '#' },
                ].map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-xs text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-light"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border/40">
            <p className="text-[11px] text-muted-foreground font-light order-2 sm:order-1">
              © {new Date().getFullYear()} ReviewRay, Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground order-1 sm:order-2">
              <span className="relative flex size-2">
                <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
