import { Copy, Gauge, Lock, Search, ShieldCheck } from 'lucide-react';

import { Reveal } from '@/components/motion/reveal';
import { cn } from '@/lib/utils';
import { DiffLine, F, K } from './code';
import { Section, SectionHeading, SectionInner, SelectionBox, Serif } from './primitives';

function Illustration({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-dots flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border bg-surface/50 p-6 transition-colors duration-500 group-hover/card:bg-accent/40">
      <div className="w-full max-w-[280px] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/card:-translate-y-1 group-hover/card:scale-[1.02]">
        {children}
      </div>
    </div>
  );
}

const SEVERITY_ROWS = [
  {
    label: 'Critical',
    note: 'SQL built from user input',
    tone: 'text-red-600 dark:text-red-400',
    dot: 'bg-red-500',
  },
  {
    label: 'High',
    note: 'Token never verified',
    tone: 'text-red-600 dark:text-red-400',
    dot: 'bg-red-400',
    selected: true,
  },
  {
    label: 'Medium',
    note: 'Unawaited promise',
    tone: 'text-amber-600 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  { label: 'Low', note: 'Missing test for retry', tone: 'text-primary', dot: 'bg-primary' },
];

function SeverityIllustration() {
  return (
    <Illustration>
      <div className="space-y-1.5 rounded-xl border bg-card p-2 shadow-sm">
        {SEVERITY_ROWS.map((row) => {
          const content = (
            <div className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[12px] transition-colors hover:bg-muted">
              <span className={cn('size-1.5 shrink-0 rounded-full', row.dot)} />
              <span className={cn('w-14 shrink-0 font-mono text-[11px]', row.tone)}>
                {row.label}
              </span>
              <span className="truncate text-muted-foreground">{row.note}</span>
            </div>
          );

          return row.selected ? (
            <SelectionBox key={row.label} tag="severity / high" className="block rounded-md">
              {content}
            </SelectionBox>
          ) : (
            <div key={row.label}>{content}</div>
          );
        })}
      </div>
    </Illustration>
  );
}

const CONTEXT_RESULTS = [
  { path: 'lib/session.ts', score: '0.92', active: true },
  { path: 'middleware.ts', score: '0.87' },
  { path: 'lib/env.ts', score: '0.81' },
  { path: 'app/api/auth/route.ts', score: '0.74' },
];

function ContextIllustration() {
  return (
    <Illustration>
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="flex items-center gap-2 border-b px-3 py-2.5">
          <Search className="size-3.5 text-muted-foreground" />
          <span className="font-mono text-[12px]">
            getSession
            <span className="animate-caret ml-px inline-block h-3.5 w-px translate-y-0.5 bg-primary" />
          </span>
          <span className="ml-auto rounded border px-1 font-mono text-[10px] text-muted-foreground">
            ctx
          </span>
        </div>
        <div className="space-y-0.5 p-1.5">
          {CONTEXT_RESULTS.map((result, index) => (
            <div
              key={result.path}
              className={cn(
                'flex items-center gap-2 rounded-md px-2 py-1.5 font-mono text-[11.5px] transition-all duration-300',
                result.active
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:translate-x-0.5 hover:bg-muted',
              )}
              style={{ transitionDelay: `${index * 40}ms` }}
            >
              <span
                className={cn('size-2 rounded-sm', result.active ? 'bg-primary' : 'bg-border')}
              />
              <span className="truncate">{result.path}</span>
              <span className="ml-auto tabular-nums">{result.score}</span>
            </div>
          ))}
        </div>
      </div>
    </Illustration>
  );
}

function FixIllustration() {
  return (
    <Illustration>
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <span className="font-mono text-[11px] text-muted-foreground">suggested fix</span>
          <Copy className="size-3.5 text-muted-foreground transition-colors group-hover/card:text-primary" />
        </div>
        <div className="py-1.5 font-mono text-[11px] leading-6">
          <DiffLine kind="del">
            items.<F>forEach</F>(<K>async</K> i =&gt; save(i));
          </DiffLine>
          <DiffLine kind="add">
            <K>await</K> Promise.<F>all</F>(items.<F>map</F>(save));
          </DiffLine>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-center gap-2">
        <span className="rounded-md border bg-card px-2 py-1 font-mono text-[11px] text-muted-foreground shadow-sm transition-all duration-300 group-hover/card:translate-y-px group-hover/card:shadow-none">
          ⌘ C
        </span>
        <span className="font-mono text-[11px] text-muted-foreground">copy, paste, push</span>
      </div>
    </Illustration>
  );
}

const PILLARS = [
  {
    illustration: <SeverityIllustration />,
    title: 'Findings, not noise',
    description:
      'Every issue is ranked by severity and tied to a file. No style nitpicks a formatter would catch, no filler, no emojis.',
  },
  {
    illustration: <ContextIllustration />,
    title: 'Context from your codebase',
    description:
      'Sync a repository once and each review pulls in related code through vector search, so feedback respects how your project works.',
  },
  {
    illustration: <FixIllustration />,
    title: 'Fixes you can paste',
    description:
      'When something is wrong, the review shows the corrected code. Short, scoped snippets you can apply in seconds.',
  },
];

const CAPABILITIES = [
  {
    icon: ShieldCheck,
    title: 'Security first',
    description:
      'Auth gaps, injection, secrets and unsafe input handling are flagged before style.',
  },
  {
    icon: Gauge,
    title: 'Token-efficient',
    description:
      'Lockfiles and generated code are stripped and the diff is budgeted, so reviews stay fast.',
  },
  {
    icon: Lock,
    title: 'Your code stays yours',
    description:
      'Reviews run on demand through the GitHub App. Disconnect any time from the dashboard.',
  },
];

export function FeaturesSection({ first = false }: { first?: boolean }) {
  return (
    <Section id="features" divider={!first}>
      <SectionInner className="pb-0 lg:pb-0">
        <SectionHeading
          as={first ? 'h1' : 'h2'}
          label="Review"
          title={
            <>
              Stop merging what <Serif>a reviewer</Serif> would catch.
            </>
          }
          description="ReviewRay reads the diff the way a senior engineer does: what changed, what it touches and what can break. Then it says so, briefly."
        />
      </SectionInner>

      <div className="mt-14 grid border-t border-rail md:grid-cols-3 lg:mt-20">
        {PILLARS.map((pillar, index) => (
          <Reveal
            key={pillar.title}
            as="article"
            delay={index * 120}
            className={cn(
              'group/card p-5 sm:p-8 lg:p-10',
              index > 0 && 'border-t border-dashed border-rail md:border-t-0 md:border-l',
            )}
          >
            {pillar.illustration}
            <h3 className="mt-8 text-lg font-medium tracking-tight">{pillar.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
              {pillar.description}
            </p>
          </Reveal>
        ))}
      </div>

      <div className="grid border-t border-rail sm:grid-cols-3">
        {CAPABILITIES.map((capability, index) => (
          <Reveal
            key={capability.title}
            delay={index * 100}
            className={cn(
              'group/cap flex gap-4 p-5 transition-colors duration-300 hover:bg-surface/70 sm:p-8 lg:px-10',
              index > 0 && 'border-t border-dashed border-rail sm:border-t-0 sm:border-l',
            )}
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-primary transition-transform duration-300 group-hover/cap:scale-110 group-hover/cap:-rotate-6">
              <capability.icon className="size-4" />
            </span>
            <div>
              <h3 className="text-sm font-medium">{capability.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {capability.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
