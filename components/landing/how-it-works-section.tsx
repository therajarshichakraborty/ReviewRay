import { FolderGit2, GitPullRequestArrow } from 'lucide-react';

import { Reveal } from '@/components/motion/reveal';
import { cn } from '@/lib/utils';
import { GitHubIcon } from './icons';
import { Section, SectionHeading, SectionInner, Serif } from './primitives';

const STEPS = [
  {
    number: '01',
    icon: GitHubIcon,
    title: 'Install the GitHub App',
    description: 'Sign in with GitHub and install ReviewRay on your account or organization.',
    meta: 'about 1 minute',
  },
  {
    number: '02',
    icon: FolderGit2,
    title: 'Pick repositories',
    description:
      'Choose which repositories to review. Optionally sync one to give reviews codebase context.',
    meta: 'optional sync',
  },
  {
    number: '03',
    icon: GitPullRequestArrow,
    title: 'Open a pull request',
    description:
      'ReviewRay reviews it automatically and posts one clear comment. New pushes update it.',
    meta: 'under a minute',
  },
];

export function HowItWorksSection() {
  return (
    <Section id="how-it-works">
      <SectionInner className="pb-0 lg:pb-0">
        <SectionHeading
          label="Setup"
          title={
            <>
              Live on your repos in <Serif>two minutes.</Serif>
            </>
          }
        />
      </SectionInner>

      <ol className="mt-14 grid border-t border-rail md:grid-cols-3 lg:mt-16">
        {STEPS.map((step, index) => (
          <Reveal
            key={step.number}
            as="li"
            delay={index * 120}
            className={cn(
              'group relative p-5 transition-colors duration-300 hover:bg-surface/60 sm:p-8 lg:p-10',
              index > 0 && 'border-t border-dashed border-rail md:border-t-0 md:border-l',
            )}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-primary">{step.number}</span>
              <span className="font-mono text-xs text-muted-foreground">{step.meta}</span>
            </div>
            <div className="mt-10 flex size-11 items-center justify-center rounded-xl border bg-card shadow-sm transition-all duration-500 ease-[var(--ease-spring)] group-hover:-translate-y-1 group-hover:-rotate-3 group-hover:border-primary/40 group-hover:shadow-lg group-hover:shadow-primary/15">
              <step.icon className="size-5 transition-colors group-hover:text-primary" />
            </div>
            <h3 className="mt-6 text-lg font-medium tracking-tight">{step.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
              {step.description}
            </p>
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-500 group-hover:scale-x-100"
            />
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
