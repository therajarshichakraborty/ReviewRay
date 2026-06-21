'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { AnimatedThemeToggler } from './animated-theme-toggler';

/**
 * A floating theme toggle button fixed to the bottom-right of the viewport.
 * Bridges next-themes with AnimatedThemeToggler's controlled API.
 * Renders only after hydration to avoid server/client mismatch.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render on server — next-themes resolves theme only on client
  if (!mounted) return null;

  const isDark = resolvedTheme === 'dark';

  return (
    <AnimatedThemeToggler
      // Controlled mode: AnimatedThemeToggler reads theme from here
      // and calls onThemeChange instead of managing localStorage itself
      theme={isDark ? 'dark' : 'light'}
      onThemeChange={setTheme}
      // Variant controls the animation shape when toggling
      variant="circle"
      aria-label="Toggle theme"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Inverted bg so it always contrasts with the page
        backgroundColor: isDark ? '#fafafa' : '#09090b',
        color: isDark ? '#09090b' : '#fafafa',
        boxShadow: isDark
          ? '0 4px 16px rgba(255,255,255,0.12), 0 2px 6px rgba(0,0,0,0.2)'
          : '0 4px 16px rgba(0,0,0,0.25), 0 2px 6px rgba(0,0,0,0.15)',
        border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'}`,
        cursor: 'pointer',
        transition: 'background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease',
      }}
    />
  );
}
