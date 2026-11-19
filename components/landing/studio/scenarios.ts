export type Severity = 'High' | 'Medium' | 'Low';

export type DiffRow = {
  n?: number;
  kind: 'add' | 'del' | 'ctx';
  code: string;
  /** Marks a row introduced by the applied fix, so it can flash in. */
  fresh?: boolean;
};

export type Scenario = {
  id: string;
  path: string;
  status: 'M' | 'A';
  delta: string;
  rows: DiffRow[];
  /** Index into `rows` of the line the finding points at. */
  flagged: number;
  fixedRows: DiffRow[];
  finding: {
    severity: Severity;
    title: string;
    body: string;
    line: number;
  };
  fix: string;
  context: string[];
  tokens: string;
  seconds: number;
};

export const SCENARIOS: Scenario[] = [
  {
    id: 'auth',
    path: 'src/lib/auth.ts',
    status: 'M',
    delta: '+1 -2',
    rows: [
      { n: 18, kind: 'ctx', code: 'export async function getSession(req: Request) {' },
      { n: 19, kind: 'ctx', code: "  const token = req.headers.get('authorization');" },
      { kind: 'del', code: '  if (!token) return null;' },
      { kind: 'del', code: '  const payload = jwt.verify(token, env.JWT_SECRET);' },
      { n: 20, kind: 'add', code: '  const payload = jwt.decode(token);' },
      { n: 21, kind: 'ctx', code: '  return db.user.findUnique({ where: { id: payload.sub } });' },
      { n: 22, kind: 'ctx', code: '}' },
    ],
    flagged: 4,
    fixedRows: [
      { n: 18, kind: 'ctx', code: 'export async function getSession(req: Request) {' },
      { n: 19, kind: 'ctx', code: "  const token = req.headers.get('authorization');" },
      { n: 20, kind: 'add', code: '  if (!token) return null;', fresh: true },
      {
        n: 21,
        kind: 'add',
        code: '  const payload = jwt.verify(token, env.JWT_SECRET);',
        fresh: true,
      },
      { n: 22, kind: 'ctx', code: '  return db.user.findUnique({ where: { id: payload.sub } });' },
      { n: 23, kind: 'ctx', code: '}' },
    ],
    finding: {
      severity: 'High',
      title: 'Token is decoded but never verified',
      body: 'jwt.decode skips the signature check, so a forged token signs in as any user. The null guard was removed too.',
      line: 20,
    },
    fix: 'if (!token) return null;\nconst payload = jwt.verify(token, env.JWT_SECRET);',
    context: ['src/lib/env.ts', 'src/middleware.ts', 'src/lib/session.ts'],
    tokens: '3.4k',
    seconds: 38,
  },
  {
    id: 'orders',
    path: 'src/app/api/orders/route.ts',
    status: 'M',
    delta: '+1 -1',
    rows: [
      { n: 31, kind: 'ctx', code: 'export async function POST(req: Request) {' },
      { n: 32, kind: 'ctx', code: '  const { items } = await req.json();' },
      { kind: 'del', code: '  await Promise.all(items.map(saveOrder));' },
      { n: 33, kind: 'add', code: '  items.forEach(async (item) => saveOrder(item));' },
      { n: 34, kind: 'ctx', code: '  return Response.json({ ok: true });' },
      { n: 35, kind: 'ctx', code: '}' },
    ],
    flagged: 3,
    fixedRows: [
      { n: 31, kind: 'ctx', code: 'export async function POST(req: Request) {' },
      { n: 32, kind: 'ctx', code: '  const { items } = await req.json();' },
      { n: 33, kind: 'add', code: '  await Promise.all(items.map(saveOrder));', fresh: true },
      { n: 34, kind: 'ctx', code: '  return Response.json({ ok: true });' },
      { n: 35, kind: 'ctx', code: '}' },
    ],
    finding: {
      severity: 'Medium',
      title: 'Promises are never awaited',
      body: 'forEach ignores the returned promises, so the response is sent before orders are saved and failures disappear.',
      line: 33,
    },
    fix: 'await Promise.all(items.map(saveOrder));',
    context: ['src/lib/orders.ts', 'src/lib/db.ts'],
    tokens: '2.1k',
    seconds: 24,
  },
  {
    id: 'limiter',
    path: 'src/lib/rate-limit.ts',
    status: 'A',
    delta: '+6',
    rows: [
      { n: 1, kind: 'add', code: "const limiter = new Ratelimit({ limit: 20, window: '1m' });" },
      { n: 2, kind: 'add', code: '' },
      { n: 3, kind: 'add', code: 'export async function guard(req: Request) {' },
      { n: 4, kind: 'add', code: "  const { success } = await limiter.limit('orders');" },
      { n: 5, kind: 'add', code: '  if (!success) throw new HttpError(429);' },
      { n: 6, kind: 'add', code: '}' },
    ],
    flagged: 3,
    fixedRows: [
      { n: 1, kind: 'add', code: "const limiter = new Ratelimit({ limit: 20, window: '1m' });" },
      { n: 2, kind: 'add', code: '' },
      { n: 3, kind: 'add', code: 'export async function guard(req: Request) {' },
      { n: 4, kind: 'add', code: '  const key = `orders:${await getUserId(req)}`;', fresh: true },
      { n: 5, kind: 'add', code: '  const { success } = await limiter.limit(key);', fresh: true },
      { n: 6, kind: 'add', code: '  if (!success) throw new HttpError(429);' },
      { n: 7, kind: 'add', code: '}' },
    ],
    finding: {
      severity: 'Medium',
      title: 'One rate-limit bucket for everyone',
      body: "The key is the constant 'orders', so a single busy client blocks every other user.",
      line: 4,
    },
    fix: 'const key = `orders:${await getUserId(req)}`;\nconst { success } = await limiter.limit(key);',
    context: ['src/lib/session.ts', 'src/lib/errors.ts'],
    tokens: '1.8k',
    seconds: 19,
  },
  {
    id: 'schema',
    path: 'prisma/schema.prisma',
    status: 'M',
    delta: '+2',
    rows: [
      { n: 12, kind: 'ctx', code: 'model Order {' },
      { n: 13, kind: 'ctx', code: '  id        String   @id @default(cuid())' },
      { n: 14, kind: 'add', code: '  userId    String' },
      { n: 15, kind: 'add', code: '  status    String   @default("pending")' },
      { n: 16, kind: 'ctx', code: '  createdAt DateTime @default(now())' },
      { n: 17, kind: 'ctx', code: '}' },
    ],
    flagged: 2,
    fixedRows: [
      { n: 12, kind: 'ctx', code: 'model Order {' },
      { n: 13, kind: 'ctx', code: '  id        String   @id @default(cuid())' },
      { n: 14, kind: 'add', code: '  userId    String' },
      { n: 15, kind: 'add', code: '  status    String   @default("pending")' },
      { n: 16, kind: 'ctx', code: '  createdAt DateTime @default(now())' },
      { n: 17, kind: 'add', code: '', fresh: true },
      { n: 18, kind: 'add', code: '  @@index([userId])', fresh: true },
      { n: 19, kind: 'ctx', code: '}' },
    ],
    finding: {
      severity: 'Low',
      title: 'No index on userId',
      body: 'Orders are listed per user, but userId is not indexed, so those queries scan the whole table as it grows.',
      line: 14,
    },
    fix: '@@index([userId])',
    context: ['src/lib/orders.ts'],
    tokens: '1.2k',
    seconds: 14,
  },
];

export const COMMITS = [
  { sha: 'a41c9e2', message: 'Move session parsing into getSession', time: '2h ago' },
  { sha: '7be03f1', message: 'Add per-route rate limiting', time: '3h ago' },
  { sha: 'c9d2a70', message: 'Store order status and owner', time: '5h ago' },
];

export const SEVERITY_STYLES: Record<
  Severity,
  { text: string; bg: string; dot: string; bar: string }
> = {
  High: {
    text: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-500/10',
    dot: 'bg-red-500',
    bar: 'bg-red-500',
  },
  Medium: {
    text: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-500/10',
    dot: 'bg-amber-500',
    bar: 'bg-amber-500',
  },
  Low: {
    text: 'text-primary',
    bg: 'bg-primary/10',
    dot: 'bg-primary',
    bar: 'bg-primary',
  },
};
