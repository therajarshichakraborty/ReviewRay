/**
 * Semantic status badge styling shared across the dashboard. Badges are soft
 * tinted pills without outlines, matching the borderless dashboard surfaces.
 */

import { cn } from '@/lib/utils';

export const statusBadgeClass = {
  success: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-400',
  warning: 'bg-amber-500/14 text-amber-700 dark:text-amber-400',
  danger: 'bg-red-500/12 text-red-700 dark:text-red-400',
  info: 'bg-primary/12 text-primary',
  neutral: 'bg-background text-muted-foreground',
} as const;

export type StatusTone = keyof typeof statusBadgeClass;

export const statusDotClass: Record<StatusTone, string> = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-primary animate-pulse',
  neutral: 'bg-muted-foreground/50',
};

export function statusBadge(tone: StatusTone, className?: string) {
  return cn(
    'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap',
    statusBadgeClass[tone],
    className,
  );
}
