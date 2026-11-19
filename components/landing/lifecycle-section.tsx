import { Reveal } from '@/components/motion/reveal';
import { Section, SectionHeading, SectionInner, Serif } from './primitives';

const STAGES = [
  {
    time: '0s',
    title: 'Pull request opened',
    body: 'GitHub sends a signed webhook. ReviewRay verifies it and checks your monthly usage.',
    status: 'Queued',
  },
  {
    time: '~2s',
    title: 'Diff fetched and budgeted',
    body: 'Changed files are read, noise is dropped and the most important code is kept.',
    status: 'Reviewing',
  },
  {
    time: '~5s',
    title: 'Context retrieved',
    body: 'For synced repositories, related code is pulled from the vector index.',
    status: 'Reviewing',
  },
  {
    time: '~30s',
    title: 'Review written',
    body: 'The model writes a structured review, then the output is checked and cleaned.',
    status: 'Reviewing',
  },
  {
    time: '~40s',
    title: 'Comment posted',
    body: 'One comment lands on the pull request, and the dashboard updates.',
    status: 'Reviewed',
  },
];

export function LifecycleSection() {
  return (
    <Section id="lifecycle">
      <SectionInner>
        <SectionHeading
          label="Lifecycle"
          title={
            <>
              From push to review in <Serif>under a minute.</Serif>
            </>
          }
          description="What happens between opening a pull request and reading its review."
        />

        <ol className="relative mt-16 ml-3 border-l border-dashed border-rail">
          {STAGES.map((stage, index) => (
            <Reveal
              key={stage.title}
              as="li"
              delay={index * 110}
              className="group/stage relative pb-12 pl-10 last:pb-0"
            >
              <span className="absolute top-1 -left-[7px] flex size-3.5 items-center justify-center rounded-full border border-primary bg-background transition-transform duration-500 group-hover/stage:scale-125">
                <span className="size-1.5 scale-0 rounded-full bg-primary transition-transform delay-300 duration-500 ease-[var(--ease-spring)] group-data-[reveal=shown]/stage:scale-100" />
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-sm text-primary">{stage.time}</span>
                <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                  {stage.status}
                </span>
              </div>
              <h3 className="mt-2 text-lg font-medium tracking-tight">{stage.title}</h3>
              <p className="mt-1 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                {stage.body}
              </p>
            </Reveal>
          ))}
        </ol>
      </SectionInner>
    </Section>
  );
}
