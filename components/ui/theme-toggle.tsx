'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { flushSync } from 'react-dom';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Light/dark switch. Both icons are rendered and CSS picks the visible one, so
 * the server and client markup always match and no mount effect is needed.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme } = useTheme();

  const toggle = () => {
    const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
    const apply = () => flushSync(() => setTheme(next));

    if (typeof document.startViewTransition === 'function') {
      document.startViewTransition(apply);
    } else {
      apply();
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label="Toggle color theme"
      className={cn('text-muted-foreground hover:text-foreground', className)}
    >
      <Moon className="size-4 dark:hidden" />
      <Sun className="hidden size-4 dark:block" />
    </Button>
  );
}
