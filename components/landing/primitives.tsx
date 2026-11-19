/**
 * Layout and typography primitives for the marketing pages.
 *
 * The visual language: a centered column framed by hairline guide rails,
 * sections separated by rules with small markers where they meet the rails,
 * sans headlines with serif accent words, and mono micro-labels.
 */

import { Reveal } from '@/components/motion/reveal';
import { cn } from '@/lib/utils';

/** The framed column every marketing section sits in. */
export function Rails({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('mx-auto w-full max-w-[1200px] border-rail sm:border-x', className)}>
      {children}
    </div>
  );
}

/** Small circular marker where a horizontal rule meets a rail. */
function RailMarker({ side }: { side: 'left' | 'right' }) {
  return (
    <span
      aria-hidden
      className={cn(
        'absolute -top-[5px] z-10 hidden size-[9px] rounded-full border border-rail bg-background sm:block',
        side === 'left' ? '-left-[5px]' : '-right-[5px]',
      )}
    />
  );
}

type SectionProps = {
  id?: string;
  children: React.ReactNode;
  className?: string;
  /** Draw the top rule with rail markers. */
  divider?: boolean;
};

export function Section({ id, children, className, divider = true }: SectionProps) {
  return (
    <section
      id={id}
      className={cn('relative scroll-mt-20', divider && 'border-t border-rail', className)}
    >
      {divider ? (
        <>
          <RailMarker side="left" />
          <RailMarker side="right" />
        </>
      ) : null}
      {children}
    </section>
  );
}

export function SectionInner({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('px-5 py-20 sm:px-10 lg:px-12 lg:py-28', className)}>{children}</div>;
}

/** Tinted pill naming the section ("Review", "Workflow", ...). */
export function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md bg-accent px-2 py-1 text-xs font-medium text-accent-foreground',
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Serif accent word inside a sans headline. */
export function Serif({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('font-serif font-normal tracking-normal', className)}>{children}</span>
  );
}

export function SectionHeading({
  label,
  title,
  description,
  className,
  as: Heading = 'h2',
}: {
  label: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  /** Use `h1` when the heading opens its own page. */
  as?: 'h1' | 'h2';
}) {
  return (
    <div className={cn('max-w-3xl', className)}>
      <Reveal>
        <SectionLabel>{label}</SectionLabel>
      </Reveal>
      <Reveal delay={80}>
        <Heading
          className={cn(
            'mt-5 leading-[1.05] font-semibold tracking-[-0.035em] text-balance',
            Heading === 'h1' ? 'text-5xl sm:text-6xl' : 'text-4xl sm:text-5xl',
          )}
        >
          {title}
        </Heading>
      </Reveal>
      {description ? (
        <Reveal delay={160}>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
            {description}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}

/** Corner handle of a selection box. */
function Handle({ position }: { position: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'animate-handle-pulse absolute size-[7px] border border-primary bg-background',
        position,
      )}
    />
  );
}

/**
 * Design-tool style selection: a tinted box with corner handles and a mono tag.
 * Used to highlight a word or a card, echoing an inspector selecting a layer.
 */
export function SelectionBox({
  children,
  tag,
  tagPosition = 'bottom',
  className,
  tagClassName,
}: {
  children: React.ReactNode;
  tag?: string;
  tagPosition?: 'top' | 'bottom';
  className?: string;
  tagClassName?: string;
}) {
  return (
    <span
      className={cn(
        'group/selection relative inline-block border border-primary/70 bg-primary/[0.07] transition-colors duration-300 hover:bg-primary/[0.12]',
        className,
      )}
    >
      {children}
      <Handle position="-top-1 -left-1" />
      <Handle position="-top-1 -right-1" />
      <Handle position="-bottom-1 -left-1" />
      <Handle position="-bottom-1 -right-1" />
      {tag ? (
        <span
          className={cn(
            'absolute left-1/2 z-10 -translate-x-1/2 rounded-[4px] bg-primary px-1.5 py-0.5 font-mono text-[11px] leading-none font-medium tracking-normal whitespace-nowrap text-primary-foreground shadow-sm transition-transform duration-300 group-hover/selection:-translate-y-0.5',
            tagPosition === 'bottom' ? 'top-full mt-1.5' : 'bottom-full mb-1.5',
            tagClassName,
          )}
        >
          {tag}
        </span>
      ) : null}
    </span>
  );
}

/** Mono micro-copy, e.g. "free for 5 reviews · no card". */
export function MonoNote({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn('font-mono text-xs tracking-tight text-muted-foreground', className)}>
      {children}
    </span>
  );
}
