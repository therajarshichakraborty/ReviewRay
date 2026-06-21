'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { AnimatedThemeToggler } from './animated-theme-toggler';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
}

/**
 * Bridges next-themes' `useTheme` into the AnimatedThemeToggler's
 * controlled API so they stay in sync.
 *
 * Renders nothing until after hydration so `resolvedTheme` is defined
 * and there's no server/client mismatch.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatedThemeToggler
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      onThemeChange={setTheme}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        width: '42px',
        height: '42px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: resolvedTheme === 'dark' ? '#ffffff' : '#18181b',
        color: resolvedTheme === 'dark' ? '#18181b' : '#ffffff',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        border: '1px solid rgba(128,128,128,0.3)',
        cursor: 'pointer',
      }}
      className={cn(className)}
    />
  );
}
