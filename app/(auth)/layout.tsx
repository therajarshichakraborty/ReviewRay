import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { Logo, LogoMark } from '@/components/brand/logo';
import { DiffLine, F, K } from '@/components/landing/code';
import { SelectionBox, Serif } from '@/components/landing/primitives';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { requireUnauth } from '@/features/auth/server/session';

function BrandPanel() {
  return (
    <aside className="relative hidden overflow-hidden border-r bg-surface lg:flex lg:flex-col">
      <div className="bg-grid mask-fade-b pointer-events-none absolute inset-0 opacity-70" />

      <div className="relative flex flex-1 flex-col justify-between p-10 xl:p-14">
        <Logo />

        <div className="max-w-lg">
          <h2 className="text-5xl leading-[1.04] font-semibold tracking-[-0.04em] xl:text-6xl">
            Every pull request, <Serif>reviewed.</Serif>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Severity-ranked findings and ready-to-paste fixes, posted to GitHub in under a minute.
          </p>

          <div className="mt-12">
            <SelectionBox tag="finding / high" className="block w-full rounded-xl">
              <div className="rounded-xl border bg-card p-5 shadow-lg shadow-primary/5">
                <div className="flex items-center gap-2">
                  <LogoMark className="size-5 rounded-[5px]" />
                  <span className="text-sm font-semibold">ReviewRay</span>
                  <span className="rounded-full border border-red-500/25 bg-red-500/10 px-1.5 py-px text-[10px] font-medium text-red-600 dark:text-red-400">
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
                    items.<F>forEach</F>(<K>async</K> i =&gt; save(i));
                  </DiffLine>
                  <DiffLine kind="add">
                    <K>await</K> Promise.<F>all</F>(items.<F>map</F>(save));
                  </DiffLine>
                </div>
              </div>
            </SelectionBox>
          </div>
        </div>

        <p className="font-mono text-xs text-muted-foreground">
          5 free reviews / month · GitHub App · cancel anytime
        </p>
      </div>
    </aside>
  );
}

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  await requireUnauth();

  return (
    <div className="grid min-h-svh lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <BrandPanel />

      <div className="flex flex-col">
        <div className="flex h-16 items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to home
          </Link>
          <ThemeToggle />
        </div>

        <main className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8">
          <div className="w-full max-w-sm">{children}</div>
        </main>

        <p className="px-5 pb-8 text-center text-xs text-muted-foreground sm:px-8">
          By continuing you agree to let ReviewRay read pull requests on repositories you choose.
        </p>
      </div>
    </div>
  );
}
