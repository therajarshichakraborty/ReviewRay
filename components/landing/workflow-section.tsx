import { Check, Copy, X } from 'lucide-react';

import { Reveal } from '@/components/motion/reveal';
import { C, F, K, S } from './code';
import { Section, SectionHeading, SectionInner, Serif } from './primitives';

const BEFORE = [
  'Waiting two days for a first review',
  '"LGTM" on a 900-line diff',
  'Nitpicks a formatter should catch',
  'The bug that shipped on Friday',
];

function ColumnTitle({
  variant,
  children,
}: {
  variant: 'before' | 'after';
  children: React.ReactNode;
}) {
  const isAfter = variant === 'after';
  return (
    <div className="flex items-center gap-3">
      <span
        className={
          isAfter
            ? 'flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm shadow-primary/30'
            : 'flex size-6 items-center justify-center rounded-full bg-muted text-muted-foreground'
        }
      >
        {isAfter ? (
          <Check className="size-3.5" strokeWidth={3} />
        ) : (
          <X className="size-3.5" strokeWidth={3} />
        )}
      </span>
      <span className="font-mono text-sm text-muted-foreground">{children}</span>
    </div>
  );
}

export function WorkflowSection({ first = false }: { first?: boolean }) {
  return (
    <Section id="workflow" divider={!first}>
      <SectionInner>
        <SectionHeading
          as={first ? 'h1' : 'h2'}
          label="Workflow"
          title={
            <>
              Feedback is a <Serif>comment,</Serif> not a meeting.
            </>
          }
          description="Open a pull request and the review lands on GitHub, next to the code it is about. Push again and the same comment updates in place."
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-0">
          <div className="lg:border-r lg:border-dashed lg:border-rail lg:pr-12">
            <ColumnTitle variant="before">before</ColumnTitle>
            <ul className="mt-8">
              {BEFORE.map((item, index) => (
                <Reveal
                  key={item}
                  as="li"
                  delay={index * 90}
                  className="group/item border-b border-dashed border-rail py-5 text-lg text-muted-foreground/70 last:border-b-0"
                >
                  <span className="relative">
                    {item}
                    <span
                      aria-hidden
                      className="absolute top-1/2 left-0 h-px w-full origin-left scale-x-0 bg-muted-foreground/50 transition-[transform,background-color] delay-300 duration-700 ease-[var(--ease-out-expo)] group-hover/item:bg-red-500/70 group-data-[reveal=shown]/item:scale-x-100"
                    />
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>

          <Reveal delay={150} className="lg:pl-12">
            <ColumnTitle variant="after">with reviewray</ColumnTitle>
            <div className="lift mt-8 rounded-2xl border bg-surface/60 p-1.5 hover:shadow-xl hover:shadow-primary/10">
              <div className="overflow-hidden rounded-xl border bg-card">
                <div className="flex items-center justify-between border-b px-5 py-3.5">
                  <p className="font-mono text-[13px]">
                    PR #142 <span className="text-muted-foreground">· src/lib/auth.ts</span>
                  </p>
                  <Copy className="size-4 text-muted-foreground" />
                </div>
                <div className="space-y-4 p-5">
                  <p className="text-[15px] leading-relaxed">
                    <span className="font-semibold">[High] Token is decoded, never verified</span>{' '}
                    <span className="text-muted-foreground">
                      in{' '}
                      <code className="font-mono text-[13px] text-foreground">src/lib/auth.ts</code>
                      . Any forged token is accepted as a valid session.
                    </span>
                  </p>
                  <pre className="overflow-x-auto rounded-lg bg-surface p-4 font-mono text-[13px] leading-6">
                    <C>{'// verify the signature before trusting the payload'}</C>
                    {'\n'}
                    <K>const</K> payload = jwt.<F>verify</F>(token, env.<F>JWT_SECRET</F>);
                    {'\n'}
                    <K>if</K> (!payload) <K>throw new</K> <F>AuthError</F>(
                    <S>&apos;invalid token&apos;</S>);
                  </pre>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Verdict:</span> Request changes
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </SectionInner>
    </Section>
  );
}
