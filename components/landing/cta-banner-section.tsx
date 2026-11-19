import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { Reveal } from '@/components/motion/reveal';
import { Button } from '@/components/ui/button';
import { SIGN_IN_PATH } from '@/features/auth/utils';
import { DASHBOARD_ROUTES } from '@/features/dashboard/lib/routes';
import { MonoNote, Section, SelectionBox, Serif } from './primitives';

const GLYPHS = ' .:;+=*#%$&{}[]()<>/\\|~!?01xX';

/** Deterministic pseudo-random texture so server and client markup always match. */
function buildAsciiField(rows: number, cols: number): string {
  let seed = 1442;
  const next = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };

  const lines: string[] = [];
  for (let row = 0; row < rows; row++) {
    let line = '';
    for (let col = 0; col < cols; col++) {
      line += next() < 0.42 ? GLYPHS[Math.floor(next() * GLYPHS.length)] : ' ';
    }
    lines.push(line);
  }
  return lines.join('\n');
}

const ASCII_FIELD = buildAsciiField(22, 180);

export function CtaBannerSection({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <Section className="overflow-hidden">
      <pre
        aria-hidden
        className="mask-radial pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden font-mono text-[13px] leading-[1.6] text-foreground/[0.09] select-none"
      >
        {ASCII_FIELD}
      </pre>

      <div className="relative px-5 py-24 text-center sm:px-10 lg:py-32">
        <Reveal>
          <h2 className="mx-auto max-w-3xl text-5xl leading-[1.02] font-semibold tracking-[-0.04em] text-balance sm:text-6xl lg:text-7xl">
            Stop <Serif>waiting on</Serif>{' '}
            <SelectionBox tag="PR #142 · reviewed in 38s" className="px-1">
              reviews.
            </SelectionBox>
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="mx-auto mt-10 max-w-xl text-lg text-pretty text-muted-foreground">
            Connect a repository in two minutes. Your next pull request is reviewed before you
            finish writing its description.
          </p>
        </Reveal>
        <Reveal delay={220} className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Button
            asChild
            className="group h-11 rounded-lg px-6 text-[15px] shadow-md shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30"
          >
            <Link href={isLoggedIn ? DASHBOARD_ROUTES.overview : SIGN_IN_PATH}>
              {isLoggedIn ? 'Open dashboard' : 'Start reviewing'}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-11 rounded-lg bg-background px-6 text-[15px] transition-all hover:-translate-y-0.5"
          >
            <Link href="/pricing">View pricing</Link>
          </Button>
        </Reveal>
        <MonoNote className="mt-6 block">5 free reviews every month · no card required</MonoNote>
      </div>
    </Section>
  );
}
