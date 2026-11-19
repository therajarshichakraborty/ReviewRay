'use client';

import { useEffect, useRef } from 'react';

type AnimatedNumberProps = {
  value: number;
  duration?: number;
  className?: string;
};

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - 2 ** (-10 * t));

/**
 * Counts up to `value`, and animates between values when it changes.
 * The real number is rendered on the server; the animation only touches
 * the DOM text, so React state and hydration stay simple.
 */
export function AnimatedNumber({ value, duration = 900, className }: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const previous = useRef(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const from = previous.current;

    if (reduceMotion || from === value) {
      previous.current = value;
      element.textContent = value.toLocaleString('en-US');
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const current = Math.round(from + (value - from) * easeOutExpo(progress));
      element.textContent = current.toLocaleString('en-US');
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        // Committed only on completion, so a cancelled run restarts cleanly.
        previous.current = value;
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {value.toLocaleString('en-US')}
    </span>
  );
}
