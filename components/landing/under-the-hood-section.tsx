import {
  Braces,
  Database,
  FileMinus2,
  GitMerge,
  Layers3,
  MessageSquareText,
  ShieldCheck,
  Timer,
  Workflow,
} from 'lucide-react';

import { Reveal } from '@/components/motion/reveal';
import { cn } from '@/lib/utils';
import { Section, SectionHeading, SectionInner, Serif } from './primitives';

const ITEMS = [
  {
    icon: FileMinus2,
    title: 'Noise is removed first',
    body: 'Lockfiles, generated code, snapshots and binaries never reach the model.',
    meta: 'diff budget',
  },
  {
    icon: Layers3,
    title: 'Source before tests',
    body: 'When a PR is large, the files that matter most are kept and the rest are listed.',
    meta: 'prioritized',
  },
  {
    icon: Database,
    title: 'Vector context',
    body: 'Synced repositories are embedded in Pinecone and searched by title and changed paths.',
    meta: 'pinecone',
  },
  {
    icon: Braces,
    title: 'Fixed review structure',
    body: 'Summary, verdict, ranked issues with fixes, suggestions, strengths. Every time.',
    meta: 'stable output',
  },
  {
    icon: ShieldCheck,
    title: 'Sanitized output',
    body: 'Emojis, em dashes and leaked reasoning are stripped no matter which model answers.',
    meta: 'post-processing',
  },
  {
    icon: Workflow,
    title: 'Model routing by plan',
    body: 'Free reviews run on open models with fallbacks; Pro reviews run on OpenAI.',
    meta: 'openrouter + openai',
  },
  {
    icon: Timer,
    title: 'Debounced pushes',
    body: 'Several quick pushes collapse into a single review instead of a pile of comments.',
    meta: 'inngest',
  },
  {
    icon: MessageSquareText,
    title: 'One living comment',
    body: 'Each new review updates the existing comment, so the conversation stays clean.',
    meta: 'github app',
  },
  {
    icon: GitMerge,
    title: 'Retries that recover',
    body: 'Every step retries on its own. A review that cannot finish is marked failed, never stuck.',
    meta: 'durable jobs',
  },
];

export function UnderTheHoodSection() {
  return (
    <Section id="under-the-hood">
      <SectionInner className="pb-0 lg:pb-0">
        <SectionHeading
          label="Engineering"
          title={
            <>
              Built to be <Serif>boringly</Serif> reliable.
            </>
          }
          description="The details that make every review fast, cheap to run and consistent from one pull request to the next."
        />
      </SectionInner>

      <div className="mt-14 grid border-t border-rail sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
        {ITEMS.map((item, index) => (
          <Reveal
            key={item.title}
            delay={(index % 3) * 90}
            className={cn(
              'group relative border-dashed border-rail p-6 transition-colors duration-300 hover:bg-surface/70 sm:p-8',
              index < ITEMS.length - 1 && 'border-b',
              index >= ITEMS.length - 3 && 'lg:border-b-0',
              index % 2 === 1 ? 'sm:border-l' : 'sm:border-l-0',
              index % 3 === 0 ? 'lg:border-l-0' : 'lg:border-l',
            )}
          >
            <div className="flex items-center justify-between">
              <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-primary transition-transform duration-500 ease-[var(--ease-spring)] group-hover:scale-110 group-hover:rotate-6">
                <item.icon className="size-4" />
              </span>
              <span className="font-mono text-[11px] text-muted-foreground">{item.meta}</span>
            </div>
            <h3 className="mt-6 text-base font-medium">{item.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
