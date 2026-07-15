/**
 * Reusable Tailwind class helpers for status badges and action buttons.
 *
 * Semantic tones (success, warning, danger, info, primary) keep visual language
 * consistent across the dashboard. Badges use rounded-full pill styling.
 */

import { cn } from '@/lib/utils';

/** Background, border, and text colors for inline status badge pills. */
export const statusBadgeClass = {
  success: 'border-emerald-500/35 bg-emerald-500/12 text-emerald-700 dark:text-emerald-400',
  warning: 'border-amber-500/35 bg-amber-500/12 text-amber-700 dark:text-amber-400',
  danger:  'border-red-500/35 bg-red-500/12 text-red-700 dark:text-red-400',
  info:    'border-blue-500/35 bg-blue-500/12 text-blue-700 dark:text-blue-400',
  primary: 'border-blue-600/40 bg-blue-600/10 text-blue-700 dark:text-blue-400',
  neutral: 'border-border bg-muted/60 text-muted-foreground',
} as const;

/** Button variants for primary actions like "Install" or "Disconnect". */
export const statusButtonClass = {
  success:
    'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500/50 dark:bg-blue-600 dark:hover:bg-blue-500',
  danger:
    'border-red-500/50 bg-red-500/8 text-red-700 hover:bg-red-500/15 dark:text-red-400 dark:hover:bg-red-500/15',
  warning:
    'border-amber-500/50 bg-amber-500/8 text-amber-800 hover:bg-amber-500/15 dark:text-amber-400',
} as const;

/**
 * Builds a complete className string for a small status badge pill.
 *
 * @param tone - Semantic color from `statusBadgeClass` keys.
 * @param className - Optional extra classes.
 * @returns A merged Tailwind class string ready for a `<span>`.
 */
export function statusBadge(tone: keyof typeof statusBadgeClass, className?: string) {
  return cn(
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium',
    statusBadgeClass[tone],
    className,
  );
}
