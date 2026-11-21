import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { Logo, LogoMark } from '@/components/brand/logo';
import { DiffLine, F, K } from '@/components/landing/code';
import { SelectionBox, Serif } from '@/components/landing/primitives';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { requireUnauth } from '@/features/auth/server/session';

function BrandPanel() {
  return (
    <aside className="relative hidden overflow-hidden lg:flex lg:flex-col">
      <div className="relative flex w-full flex-1 flex-col justify-between p-10 lg:ml-auto lg:max-w-[40rem] xl:p-14">
        <div className="animate-fade-in">
          <Logo markClassName="transition-transform duration-500 ease-[var(--ease-spring)] hover:-rotate-6 hover:scale-105" />
        </div>

        <div className="max-w-lg">
          <h2 className="animate-fade-up text-5xl leading-[1.04] font-semibold tracking-[-0.04em] [animation-delay:60ms] xl:text-6xl">
            Every pull request,{' '}
            <span className="animate-blur-in inline-block [animation-delay:380ms]">
              <Serif>reviewed.</Serif>
            </span>
          </h2>
          <p className="animate-fade-up mt-5 text-lg leading-relaxed text-muted-foreground [animation-delay:140ms]">
            Severity-ranked findings and ready-to-paste fixes, posted to GitHub in under a minute.
          </p>

          <div className="animate-fade-up mt-12 [animation-delay:220ms]">
            {/* Idle float, on its own layer so it never fights the entrance transform. */}
            <div className="animate-float [animation-delay:1.2s] [animation-duration:7s]">
              <SelectionBox tag="finding / high" className="block w-full rounded-xl">
                <div className="group/card rounded-xl border transition-transform duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 border-border/70 bg-card p-5 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_12px_32px_-12px_rgb(0_0_0/0.10),0_32px_64px_-32px_rgb(37_99_235/0.22)] dark:shadow-none">
                  <div className="flex items-center gap-2">
                    <LogoMark className="size-5 rounded-[5px]" />
                    <span className="text-sm font-semibold">ReviewRay</span>
                    <span className="animate-pop-in rounded-full border border-red-500/25 [animation-delay:520ms] bg-red-500/10 px-1.5 py-px text-[10px] font-medium text-red-600 dark:text-red-400">
                      High
                    </span>
                    <span className="ml-auto font-mono text-[11px] text-muted-foreground">
                      orders.ts:42
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    <span className="font-medium text-foreground">Promises are not awaited.</span>{' '}
                    Orders can be marked paid before they are saved.
                  </p>
                  <div className="mt-3 overflow-hidden rounded-md border bg-surface py-1.5 font-mono text-[12px] leading-6">
                    <DiffLine kind="del">
                      <span className="relative">
                        items.<F>forEach</F>(<K>async</K> i =&gt; save(i));
                        <span
                          aria-hidden
                          className="animate-strike absolute inset-x-0 top-1/2 h-px origin-left bg-red-500/50 [animation-delay:700ms]"
                        />
                      </span>
                    </DiffLine>
                    <DiffLine kind="add" className="animate-diff-in [animation-delay:1000ms]">
                      <K>await</K> Promise.<F>all</F>(items.<F>map</F>(save));
                    </DiffLine>
                  </div>
                </div>
              </SelectionBox>
            </div>
          </div>
        </div>

        <p className="animate-fade-in font-mono text-xs text-muted-foreground [animation-delay:320ms]">
          1 free review / month · GitHub App · cancel anytime
        </p>
      </div>
    </aside>
  );
}

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  await requireUnauth();

  return (
    <div className="grid min-h-svh bg-white lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] dark:bg-background">
      <BrandPanel />

      <div className="flex flex-col">
        <div className="flex h-16 items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:-translate-x-1" />
            Back to home
          </Link>
          <ThemeToggle />
        </div>

        <main className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8 lg:justify-start lg:pl-12 xl:pl-20">
          <div className="w-full max-w-sm">{children}</div>
        </main>

        <p className="animate-fade-in px-5 pb-8 text-center [animation-delay:400ms] text-xs text-muted-foreground sm:px-8 lg:max-w-[calc(24rem+5rem)] lg:pl-12 lg:text-left xl:pl-20">
          By continuing you agree to let ReviewRay read pull requests on repositories you choose.
        </p>
      </div>
    </div>
  );
}
