/**
 * Tiny presentational helpers for hand-written code samples on the landing page.
 * Static spans keep the page fast and free of a client-side highlighter.
 */

import { cn } from '@/lib/utils';

export const K = ({ children }: { children: React.ReactNode }) => (
  <span className="text-violet-600 dark:text-violet-400">{children}</span>
);
export const F = ({ children }: { children: React.ReactNode }) => (
  <span className="text-primary">{children}</span>
);
export const S = ({ children }: { children: React.ReactNode }) => (
  <span className="text-amber-700 dark:text-amber-300">{children}</span>
);
export const C = ({ children }: { children: React.ReactNode }) => (
  <span className="text-muted-foreground/80">{children}</span>
);

type DiffLineProps = {
  n?: number;
  kind?: 'add' | 'del' | 'ctx';
  children: React.ReactNode;
};

export function DiffLine({ n, kind = 'ctx', children }: DiffLineProps) {
  return (
    <div
      className={cn(
        'flex gap-3 px-3 whitespace-pre',
        kind === 'add' && 'bg-emerald-500/10',
        kind === 'del' && 'bg-red-500/10',
      )}
    >
      <span className="w-6 shrink-0 text-right text-muted-foreground/50 select-none">
        {n ?? ''}
      </span>
      <span
        className={cn(
          'w-3 shrink-0 select-none',
          kind === 'add' && 'text-emerald-600 dark:text-emerald-400',
          kind === 'del' && 'text-red-600 dark:text-red-400',
        )}
      >
        {kind === 'add' ? '+' : kind === 'del' ? '-' : ' '}
      </span>
      <span className="text-foreground/85">{children}</span>
    </div>
  );
}
