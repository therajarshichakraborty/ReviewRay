'use client';

function partOfDay(hour: number) {
  if (hour < 5) return 'Good evening';
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Greeting in the viewer's local time. The server render may use a different
 * timezone, so the text is allowed to differ during hydration.
 */
export function Greeting({ name }: { name: string }) {
  return (
    <span suppressHydrationWarning>
      {partOfDay(new Date().getHours())}, {name}
    </span>
  );
}
