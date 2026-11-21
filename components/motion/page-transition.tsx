import { ViewTransition } from 'react';

/**
 * Animates route changes with the browser View Transitions API.
 *
 * Placed in a `template.tsx`, which remounts on every navigation: the leaving
 * page plays its exit and the arriving page (or its loading skeleton) plays its
 * enter, both in the same short frame. Links tagged with `nav-forward` or
 * `nav-back` transition types get a directional slide instead of a plain fade.
 * Initial page loads are not transitions, so they never animate.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition
      enter={{ 'nav-forward': 'vt-forward', 'nav-back': 'vt-back', default: 'vt-page' }}
      exit={{ 'nav-forward': 'vt-forward', 'nav-back': 'vt-back', default: 'vt-page' }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
