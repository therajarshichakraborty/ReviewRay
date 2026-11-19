/**
 * Building blocks for dashboard pages. The dashboard is deliberately borderless:
 * surfaces are separated by soft fills and spacing instead of outlines.
 */

import { AnimatedNumber } from '@/components/motion/animated-number';
import { cn } from '@/lib/utils';

/** Row separators inside a panel, drawn in the page color so they read as gaps. */
export const PANEL_ROWS = 'divide-y-2 divide-background';
/** Hover state for an interactive row inside a panel. */
export const PANEL_ROW_HOVER = 'transition-colors duration-200 hover:bg-background/70';

export function Panel({
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn('overflow-hidden rounded-2xl bg-surface', className)}>
      {title ? (
        <header className="flex items-start justify-between gap-4 px-5 pt-5 pb-1">
          <div className="min-w-0">
            <h3 className="text-[15px] font-medium">{title}</h3>
            {description ? (
              <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {action}
        </header>
      ) : null}
      <div className={cn('p-5', bodyClassName)}>{children}</div>
    </section>
  );
}

export function StatCard({
  label,
  value,
  suffix,
  caption,
  icon: Icon,
  tone = 'default',
  index = 0,
}: {
  label: string;
  /** Numbers count up; strings render as-is. */
  value: number | string;
  suffix?: React.ReactNode;
  caption: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
  tone?: 'default' | 'warning';
  /** Position in a grid, used to stagger the entrance. */
  index?: number;
}) {
  return (
    <div
      className="group animate-fade-up rounded-2xl bg-surface p-5 transition-colors duration-300 hover:bg-accent/60"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-muted-foreground">{label}</p>
        <span className="flex size-8 items-center justify-center rounded-lg bg-background text-muted-foreground transition-all duration-500 ease-[var(--ease-spring)] group-hover:scale-110 group-hover:-rotate-6 group-hover:text-primary">
          <Icon className="size-4" />
        </span>
      </div>
      <p
        className={cn(
          'mt-3 text-3xl font-semibold tracking-[-0.03em] tabular-nums',
          tone === 'warning' && 'text-amber-600 dark:text-amber-400',
        )}
      >
        {typeof value === 'number' ? <AnimatedNumber value={value} /> : value}
        {suffix}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{caption}</p>
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  iconClassName,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <div
      className={cn(
        'animate-fade-in relative flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-surface px-6 py-14 text-center',
        className,
      )}
    >
      <div className="bg-dots mask-radial pointer-events-none absolute inset-0 opacity-70" />
      <span className="animate-float relative flex size-12 items-center justify-center rounded-2xl bg-background shadow-sm">
        <Icon className={cn('size-5 text-muted-foreground', iconClassName)} />
      </span>
      <h3 className="relative mt-5 text-[15px] font-medium">{title}</h3>
      <p className="relative mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {action ? <div className="relative mt-6">{action}</div> : null}
    </div>
  );
}

/** Animated horizontal meter used for usage and progress. */
export function Meter({
  value,
  max,
  className,
  barClassName,
  label,
}: {
  value: number;
  max: number;
  className?: string;
  barClassName?: string;
  label: string;
}) {
  const percent = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
      className={cn('h-1.5 overflow-hidden rounded-full bg-background', className)}
    >
      <div
        className={cn('animate-grow-x h-full origin-left rounded-full bg-primary', barClassName)}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
