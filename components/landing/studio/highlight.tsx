/**
 * Minimal syntax highlighter for the short TypeScript and Prisma samples in
 * the studio demo. A single regex pass, no dependencies, safe to run anywhere.
 */

const TOKEN_PATTERN =
  /(\/\/.*$)|('[^']*'|"[^"]*"|`[^`]*`)|(@@?\w+)|\b(const|let|await|async|export|function|return|if|as|new|throw|import|from|model)\b|\b(String|Int|DateTime|Request|Response|Promise)\b|([A-Za-z_$][\w$]*)(?=\()/g;

const TOKEN_CLASSES = [
  'text-muted-foreground/70 italic',
  'text-amber-700 dark:text-amber-300',
  'text-sky-700 dark:text-sky-300',
  'text-violet-600 dark:text-violet-400',
  'text-emerald-700 dark:text-emerald-400',
  'text-primary',
] as const;

export function highlight(code: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let cursor = 0;

  for (const match of code.matchAll(TOKEN_PATTERN)) {
    const index = match.index ?? 0;
    if (index > cursor) nodes.push(code.slice(cursor, index));

    const group = match.slice(1).findIndex((value) => value !== undefined);
    nodes.push(
      <span key={index} className={TOKEN_CLASSES[group]}>
        {match[0]}
      </span>,
    );
    cursor = index + match[0].length;
  }

  if (cursor < code.length) nodes.push(code.slice(cursor));
  return nodes;
}
