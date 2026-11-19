import { Check } from 'lucide-react';

import { LogoMark } from '@/components/brand/logo';
import { Reveal } from '@/components/motion/reveal';
import { C, F, K, S } from './code';
import { Section, SectionHeading, SectionInner, Serif } from './primitives';

const GUARANTEES = [
  {
    title: 'Summary and verdict first',
    body: 'Approve, approve with suggestions, or request changes. Decided in one line.',
  },
  {
    title: 'Issues ranked by severity',
    body: 'At most five, each tied to a file, with the concrete impact spelled out.',
  },
  {
    title: 'A fix for every issue',
    body: 'Short, scoped code blocks with the corrected implementation.',
  },
  {
    title: 'What works well',
    body: 'Good decisions get called out too, so feedback stays balanced.',
  },
  { title: 'No emojis, no filler', body: 'Plain, professional prose with a hard length limit.' },
];

function Heading({ children }: { children: React.ReactNode }) {
  return <h4 className="border-b pb-1.5 text-sm font-semibold">{children}</h4>;
}

function SampleReview() {
  return (
    <div className="lift rounded-2xl border bg-surface/60 p-1.5 hover:shadow-xl hover:shadow-primary/10">
      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="flex items-center gap-2.5 border-b bg-surface px-4 py-3">
          <LogoMark className="size-6 rounded-md" />
          <span className="text-sm font-semibold">reviewray</span>
          <span className="rounded-full border px-1.5 py-px text-[10px] text-muted-foreground">
            bot
          </span>
          <span className="text-sm text-muted-foreground">commented now</span>
        </div>

        <div className="space-y-5 p-5 text-sm leading-relaxed sm:p-6">
          <section className="space-y-2">
            <Heading>Summary</Heading>
            <p className="text-muted-foreground">
              Adds a rate-limited orders endpoint and moves session parsing into{' '}
              <code className="font-mono text-[12.5px] text-foreground">getSession</code>. The
              structure is clean, but one change weakens authentication.
            </p>
            <p>
              <span className="font-semibold">Verdict:</span>{' '}
              <code className="rounded border bg-muted px-1 font-mono text-[12px]">
                Request changes
              </code>
            </p>
          </section>

          <section className="space-y-2">
            <Heading>Issues</Heading>
            <p>
              1. <span className="font-semibold">[High] Token is decoded, never verified</span> in{' '}
              <code className="font-mono text-[12.5px]">src/lib/auth.ts</code>
            </p>
            <p className="pl-4 text-muted-foreground">
              <code className="font-mono text-[12.5px] text-foreground">jwt.decode</code> does not
              check the signature, so any forged token becomes a valid session.
            </p>
            <pre className="ml-4 overflow-x-auto rounded-lg border bg-surface p-3 font-mono text-[12px] leading-6">
              <K>if</K> (!token) <K>return null</K>;{'\n'}
              <K>const</K> payload = jwt.<F>verify</F>(token, env.JWT_SECRET) <K>as</K>{' '}
              TokenPayload;
            </pre>
            <p>
              2. <span className="font-semibold">[Medium] Limiter key ignores the user</span> in{' '}
              <code className="font-mono text-[12.5px]">src/lib/rate-limit.ts</code>
            </p>
            <pre className="ml-4 overflow-x-auto rounded-lg border bg-surface p-3 font-mono text-[12px] leading-6">
              <C>{'// one bucket per user, not one for everyone'}</C>
              {'\n'}
              <K>const</K> key = <S>`orders:</S>${'{'}session.userId{'}'}
              <S>`</S>;
            </pre>
          </section>

          <section className="space-y-2">
            <Heading>What works well</Heading>
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground marker:text-muted-foreground/60">
              <li>Input is validated with a schema before it reaches the database.</li>
              <li>The new limiter is isolated and easy to test.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

export function ReviewSampleSection({ first = false }: { first?: boolean }) {
  return (
    <Section id="review" divider={!first}>
      <SectionInner>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
          <div>
            <SectionHeading
              as={first ? 'h1' : 'h2'}
              label="Output"
              title={
                <>
                  Reviews that read like <Serif>a senior engineer</Serif> wrote them.
                </>
              }
              description="The same tight structure on every pull request, sized to be read in a minute and acted on in five."
            />
            <ul className="mt-10 space-y-5">
              {GUARANTEES.map((item, index) => (
                <Reveal as="li" key={item.title} delay={index * 80} className="group flex gap-3">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  <div>
                    <p className="text-[15px] font-medium">{item.title}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{item.body}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
          <Reveal delay={200}>
            <SampleReview />
          </Reveal>
        </div>
      </SectionInner>
    </Section>
  );
}
