'use client';

import {
  Check,
  CircleCheck,
  Copy,
  Loader2,
  MessageSquare,
  MousePointer2,
  RotateCcw,
  Sparkles,
  Undo2,
  Wand2,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { LogoMark } from '@/components/brand/logo';
import { cn } from '@/lib/utils';
import { highlight } from './highlight';
import {
  COMMITS,
  SCENARIOS,
  SEVERITY_STYLES,
  type DiffRow,
  type Scenario,
  type Severity,
} from './scenarios';

/** Lifecycle of one file in the demo. */
type Phase = 'idle' | 'scanning' | 'found' | 'fixed' | 'clean';
type Phases = Record<string, Phase>;

const SCAN_MS = 1400;
const INITIAL_PHASES: Phases = Object.fromEntries(SCENARIOS.map((s) => [s.id, 'idle']));

/* ------------------------------------------------------------------------ */
/* Derived review state                                                      */
/* ------------------------------------------------------------------------ */

function openFindings(phases: Phases): Scenario[] {
  return SCENARIOS.filter((scenario) => phases[scenario.id] === 'found');
}

function getVerdict(phases: Phases) {
  const scanned = SCENARIOS.filter((s) => phases[s.id] !== 'idle' && phases[s.id] !== 'scanning');
  const open = openFindings(phases);

  if (scanned.length === 0) {
    return { label: 'Reviewing', className: 'bg-muted text-muted-foreground' };
  }
  if (open.some((s) => s.finding.severity === 'High')) {
    return {
      label: 'Request changes',
      className: 'bg-amber-500/12 text-amber-700 dark:text-amber-400',
    };
  }
  if (open.length > 0) {
    return { label: 'Approve with suggestions', className: 'bg-primary/10 text-primary' };
  }
  if (scanned.length === SCENARIOS.length) {
    return {
      label: 'Approve',
      className: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-400',
    };
  }
  return { label: 'Looking good so far', className: 'bg-muted text-muted-foreground' };
}

/* ------------------------------------------------------------------------ */
/* Small pieces                                                              */
/* ------------------------------------------------------------------------ */

function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
      {children}
    </p>
  );
}

function FileStatusIcon({ phase, severity }: { phase: Phase; severity: Severity }) {
  if (phase === 'scanning') return <Loader2 className="size-3.5 animate-spin text-primary" />;
  if (phase === 'fixed' || phase === 'clean') {
    return <Check className="animate-pop-in size-3.5 text-emerald-600 dark:text-emerald-400" />;
  }
  if (phase === 'found') {
    return (
      <span className={cn('animate-pop-in size-2 rounded-full', SEVERITY_STYLES[severity].dot)} />
    );
  }
  return <span className="size-2 rounded-full bg-border" />;
}

function ToolButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={cn(
        'flex size-7 items-center justify-center rounded-md transition-all duration-200 active:scale-90',
        active
          ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30'
          : 'text-muted-foreground hover:bg-background hover:text-foreground',
      )}
    >
      {children}
    </button>
  );
}

function DiffLineRow({
  row,
  flagged,
  scanning,
  index,
}: {
  row: DiffRow;
  flagged: boolean;
  scanning: boolean;
  index: number;
}) {
  return (
    <div
      className={cn(
        'group/line relative flex gap-3 px-3 whitespace-pre transition-colors duration-300',
        row.kind === 'add' && 'bg-emerald-500/[0.08]',
        row.kind === 'del' && 'bg-red-500/[0.08]',
        row.fresh && 'animate-line-flash',
        flagged && 'bg-red-500/15',
        !scanning && 'hover:bg-primary/[0.06]',
      )}
      style={scanning ? { animation: `fade-in 0.4s ${index * 70}ms both` } : undefined}
    >
      {flagged ? <span className="absolute inset-y-0 left-0 w-0.5 bg-red-500" aria-hidden /> : null}
      <span className="w-6 shrink-0 text-right text-muted-foreground/50 select-none">
        {row.n ?? ''}
      </span>
      <span
        className={cn(
          'w-3 shrink-0 select-none',
          row.kind === 'add' && 'text-emerald-600 dark:text-emerald-400',
          row.kind === 'del' && 'text-red-600 dark:text-red-400',
        )}
      >
        {row.kind === 'add' ? '+' : row.kind === 'del' ? '-' : ' '}
      </span>
      <span className={cn('text-foreground/85', row.kind === 'del' && 'opacity-60')}>
        {highlight(row.code)}
      </span>
      {flagged ? (
        <span className="animate-ring-pulse absolute top-1/2 right-3 size-2 -translate-y-1/2 rounded-full bg-red-500" />
      ) : null}
    </div>
  );
}

function Handle({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'animate-handle-pulse absolute size-[7px] border border-primary bg-background',
        className,
      )}
    />
  );
}

/* ------------------------------------------------------------------------ */
/* Finding card                                                              */
/* ------------------------------------------------------------------------ */

function FindingCard({
  scenario,
  phase,
  onApply,
  onUndo,
}: {
  scenario: Scenario;
  phase: Phase;
  onApply: () => void;
  onUndo: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const fileName = scenario.path.split('/').at(-1);
  const severity = SEVERITY_STYLES[scenario.finding.severity];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(scenario.fix);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be blocked (insecure context); the button simply does nothing.
    }
  };

  if (phase === 'clean') {
    return (
      <div className="animate-pop-in flex items-center gap-3 rounded-lg bg-emerald-500/10 px-4 py-3 text-[13px] text-emerald-800 dark:text-emerald-300">
        <CircleCheck className="size-4 shrink-0" />
        Re-reviewed {fileName}. No issues found.
      </div>
    );
  }

  if (phase === 'fixed') {
    return (
      <div className="animate-pop-in flex items-center gap-3 rounded-lg bg-emerald-500/10 px-4 py-3 text-[13px] text-emerald-800 dark:text-emerald-300">
        <CircleCheck className="size-4 shrink-0" />
        <span className="min-w-0 flex-1">
          Fix applied to {fileName}:{scenario.finding.line}. Re-run the review to verify.
        </span>
        <button
          type="button"
          onClick={onUndo}
          className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 font-medium transition-colors hover:bg-emerald-500/15"
        >
          <Undo2 className="size-3.5" />
          Undo
        </button>
      </div>
    );
  }

  return (
    <div className="animate-pop-in relative">
      <div className="relative border border-primary/70">
        <Handle className="-top-1 -left-1" />
        <Handle className="-top-1 -right-1" />
        <Handle className="-bottom-1 -left-1" />
        <Handle className="-right-1 -bottom-1" />
        <span className="absolute bottom-full left-1/2 z-10 mb-1.5 -translate-x-1/2 rounded-[4px] bg-primary px-1.5 py-0.5 font-mono text-[11px] leading-none font-medium whitespace-nowrap text-primary-foreground shadow-sm">
          finding / {scenario.finding.severity.toLowerCase()}
        </span>

        <div className="bg-card p-4 text-left shadow-md">
          <div className="flex items-center gap-2">
            <LogoMark className="size-5 rounded-[5px]" />
            <span className="text-[13px] font-semibold">ReviewRay</span>
            <span
              className={cn(
                'rounded-full px-1.5 py-px text-[10px] font-medium',
                severity.bg,
                severity.text,
              )}
            >
              {scenario.finding.severity}
            </span>
            <span className="ml-auto font-mono text-[10px] text-muted-foreground">
              {fileName}:{scenario.finding.line}
            </span>
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">{scenario.finding.title}.</span>{' '}
            {scenario.finding.body}
          </p>
          <pre className="mt-3 rounded-md bg-emerald-500/[0.08] px-3 py-2 font-mono text-[11.5px] leading-6 break-words whitespace-pre-wrap">
            {scenario.fix.split('\n').map((line) => (
              <span key={line} className="block">
                <span className="mr-3 text-emerald-600 select-none dark:text-emerald-400">+</span>
                {highlight(line)}
              </span>
            ))}
          </pre>
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={onApply}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground shadow-sm shadow-primary/30 transition-all hover:brightness-110 active:scale-95"
            >
              <Wand2 className="size-3.5" />
              Apply fix
            </button>
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {copied ? (
                <Check className="animate-pop-in size-3.5 text-emerald-600" />
              ) : (
                <Copy className="size-3.5" />
              )}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Studio                                                                    */
/* ------------------------------------------------------------------------ */

/**
 * Interactive product demo: a pull request open in ReviewRay. Visitors pick
 * files, watch them get scanned, apply fixes and see the verdict update live.
 */
export function ReviewStudio({ className }: { className?: string }) {
  const [activeId, setActiveId] = useState(SCENARIOS[0].id);
  const [phases, setPhases] = useState<Phases>(INITIAL_PHASES);
  const [tab, setTab] = useState<'files' | 'commits'>('files');
  const [showComments, setShowComments] = useState(true);
  const [interacted, setInteracted] = useState(false);
  const [postState, setPostState] = useState<'idle' | 'posting' | 'posted'>('idle');

  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  const active = SCENARIOS.find((s) => s.id === activeId) ?? SCENARIOS[0];
  const activePhase = phases[active.id];
  const verdict = getVerdict(phases);
  const open = openFindings(phases);
  const resolved = SCENARIOS.filter(
    (s) => phases[s.id] === 'fixed' || phases[s.id] === 'clean',
  ).length;

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((id) => window.clearTimeout(id));
  }, []);

  /**
   * Runs the scan animation for one file. A file that was already fixed comes
   * back clean; anything else surfaces its finding.
   */
  const scan = useCallback(
    (id: string, wasFixed: boolean) => {
      setPhases((current) => ({ ...current, [id]: 'scanning' }));
      later(() => {
        setPhases((latest) =>
          latest[id] === 'scanning' ? { ...latest, [id]: wasFixed ? 'clean' : 'found' } : latest,
        );
      }, SCAN_MS);
    },
    [later],
  );

  // Start the first scan once the studio scrolls into view.
  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          scan(SCENARIOS[0].id, false);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [scan]);

  const markInteracted = () => setInteracted(true);

  const selectFile = (id: string) => {
    markInteracted();
    setActiveId(id);
    setTab('files');
    if (phases[id] === 'idle') scan(id, false);
  };

  const applyFix = () => {
    markInteracted();
    setPhases((current) => ({ ...current, [active.id]: 'fixed' }));
  };

  const undoFix = () => setPhases((current) => ({ ...current, [active.id]: 'found' }));

  const rerun = () => {
    markInteracted();
    if (activePhase !== 'scanning') {
      scan(active.id, activePhase === 'fixed' || activePhase === 'clean');
    }
  };

  const reset = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current.length = 0;
    setPhases(INITIAL_PHASES);
    setActiveId(SCENARIOS[0].id);
    setTab('files');
    setPostState('idle');
    setShowComments(true);
    scan(SCENARIOS[0].id, false);
  };

  const postReview = () => {
    if (postState !== 'idle') return;
    markInteracted();
    setPostState('posting');
    later(() => setPostState('posted'), 900);
    later(() => setPostState('idle'), 3200);
  };

  const onFileKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    const index = SCENARIOS.findIndex((s) => s.id === activeId);
    const next =
      (index + (event.key === 'ArrowDown' ? 1 : -1) + SCENARIOS.length) % SCENARIOS.length;
    selectFile(SCENARIOS[next].id);
    const buttons = (event.currentTarget as HTMLElement).querySelectorAll('button');
    buttons[next]?.focus();
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const element = canvasRef.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    element.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
    element.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
  };

  const rows = activePhase === 'fixed' || activePhase === 'clean' ? active.fixedRows : active.rows;
  const scanning = activePhase === 'scanning';
  const severityCounts = (['High', 'Medium', 'Low'] as const).map((severity) => ({
    severity,
    count: open.filter((s) => s.finding.severity === severity).length,
  }));

  return (
    <div
      ref={rootRef}
      className={cn(
        'relative rounded-[20px] border bg-surface/60 p-1.5 shadow-[0_30px_80px_-30px] shadow-primary/25',
        className,
      )}
    >
      {!interacted ? (
        <div className="animate-pop-in absolute -top-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full bg-foreground px-3 py-1.5 text-xs font-medium whitespace-nowrap text-background shadow-lg [animation-delay:1.6s]">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          Interactive. Pick a file, then apply the fix.
        </div>
      ) : null}

      <div className="overflow-hidden rounded-[14px] border bg-card">
        {/* Title bar */}
        <div className="flex h-12 items-center justify-between gap-3 border-b px-4">
          <div className="flex min-w-0 items-center gap-4">
            <div className="hidden gap-1.5 sm:flex" aria-hidden>
              <span className="size-2.5 rounded-full bg-[#ff5f57]/80" />
              <span className="size-2.5 rounded-full bg-[#febc2e]/80" />
              <span className="size-2.5 rounded-full bg-[#28c840]/80" />
            </div>
            <p className="truncate text-sm text-muted-foreground">
              acme / <span className="text-foreground">checkout-api</span>
            </p>
            <span className="hidden rounded-md bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground sm:inline">
              #142
            </span>
          </div>

          <div className="hidden items-center gap-0.5 rounded-lg bg-muted p-0.5 md:flex">
            <ToolButton label="Select" active onClick={markInteracted}>
              <MousePointer2 className="size-3.5" />
            </ToolButton>
            <ToolButton
              label={showComments ? 'Hide review comments' : 'Show review comments'}
              active={showComments}
              onClick={() => {
                markInteracted();
                setShowComments((value) => !value);
              }}
            >
              <MessageSquare className="size-3.5" />
            </ToolButton>
            <ToolButton label="Re-run review on this file" onClick={rerun}>
              <Sparkles className={cn('size-3.5', scanning && 'animate-spin')} />
            </ToolButton>
            <ToolButton label="Reset demo" onClick={reset}>
              <RotateCcw className="size-3.5" />
            </ToolButton>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="hidden -space-x-1.5 sm:flex">
              {[
                ['AK', 'bg-sky-500', 'Aisha'],
                ['MS', 'bg-emerald-500', 'Maya'],
                ['JR', 'bg-violet-500', 'Jon'],
              ].map(([initials, color, name]) => (
                <span
                  key={initials}
                  title={`${name} is viewing`}
                  className={cn(
                    'flex size-6 items-center justify-center rounded-full border-2 border-card text-[9px] font-semibold text-white transition-transform hover:z-10 hover:-translate-y-0.5',
                    color,
                  )}
                >
                  {initials}
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={postReview}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium shadow-sm transition-all active:scale-95',
                postState === 'posted'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-primary text-primary-foreground hover:brightness-110',
              )}
            >
              {postState === 'posting' ? <Loader2 className="size-3.5 animate-spin" /> : null}
              {postState === 'posted' ? <Check className="animate-pop-in size-3.5" /> : null}
              {postState === 'posted'
                ? 'Posted to GitHub'
                : postState === 'posting'
                  ? 'Posting'
                  : 'Post review'}
            </button>
          </div>
        </div>

        {/* Mobile file picker */}
        <div className="flex gap-1.5 overflow-x-auto border-b p-2 lg:hidden">
          {SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              type="button"
              onClick={() => selectFile(scenario.id)}
              className={cn(
                'flex shrink-0 items-center gap-2 rounded-md px-2.5 py-1.5 text-xs transition-colors',
                scenario.id === activeId
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground',
              )}
            >
              <FileStatusIcon phase={phases[scenario.id]} severity={scenario.finding.severity} />
              {scenario.path.split('/').at(-1)}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-[220px_minmax(0,1fr)_250px]">
          {/* Files panel */}
          <aside className="hidden border-r lg:block">
            <div className="flex gap-4 border-b px-4 py-3 text-sm">
              {(['files', 'commits'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    markInteracted();
                    setTab(value);
                  }}
                  className={cn(
                    'relative capitalize transition-colors',
                    tab === value
                      ? 'font-medium text-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {value}
                  <span
                    className={cn(
                      'absolute -bottom-3 left-0 h-0.5 rounded-full bg-primary transition-all duration-300',
                      tab === value ? 'w-full' : 'w-0',
                    )}
                  />
                </button>
              ))}
            </div>

            {tab === 'files' ? (
              <div className="p-3">
                <div className="flex items-center justify-between px-2 pb-2">
                  <PanelLabel>Changed · {SCENARIOS.length}</PanelLabel>
                  <span className="font-mono text-[10px] text-muted-foreground">↑↓</span>
                </div>
                <div
                  role="listbox"
                  aria-label="Changed files"
                  className="space-y-0.5"
                  onKeyDown={onFileKeyDown}
                >
                  {SCENARIOS.map((scenario) => {
                    const selected = scenario.id === activeId;
                    return (
                      <button
                        key={scenario.id}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        onClick={() => selectFile(scenario.id)}
                        className={cn(
                          'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] transition-all duration-200',
                          selected
                            ? 'bg-accent text-accent-foreground'
                            : 'text-muted-foreground hover:translate-x-0.5 hover:bg-muted hover:text-foreground',
                        )}
                      >
                        <span
                          className={cn(
                            'font-mono text-[10px]',
                            scenario.status === 'A'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-amber-600 dark:text-amber-400',
                          )}
                        >
                          {scenario.status}
                        </span>
                        <span className="min-w-0 flex-1 truncate">
                          {scenario.path.split('/').at(-1)}
                        </span>
                        <FileStatusIcon
                          phase={phases[scenario.id]}
                          severity={scenario.finding.severity}
                        />
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 px-2">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Resolved</span>
                    <span className="font-mono tabular-nums">
                      {resolved}/{SCENARIOS.length}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-[width] duration-700 ease-out"
                      style={{ width: `${(resolved / SCENARIOS.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <ul className="animate-fade-in space-y-1 p-3">
                {COMMITS.map((commit) => (
                  <li
                    key={commit.sha}
                    className="rounded-md px-2 py-2 transition-colors hover:bg-muted"
                  >
                    <p className="truncate text-[13px]">{commit.message}</p>
                    <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                      {commit.sha} · {commit.time}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </aside>

          {/* Canvas */}
          <div
            ref={canvasRef}
            onPointerMove={onPointerMove}
            className="spotlight relative min-w-0 overflow-hidden"
          >
            <div className="relative hidden h-7 border-b sm:block" aria-hidden>
              <div className="absolute inset-x-0 bottom-0 h-1.5 bg-[repeating-linear-gradient(to_right,var(--border)_0_1px,transparent_1px_12px)]" />
              <div className="absolute inset-x-4 top-1 flex justify-between font-mono text-[10px] text-muted-foreground/70">
                {[0, 100, 200, 300, 400, 500].map((tick) => (
                  <span key={tick}>{tick}</span>
                ))}
              </div>
            </div>

            <div className="bg-dots relative min-h-[460px] px-4 pt-8 pb-12 sm:px-8">
              {/* Collaborator cursor */}
              <div
                aria-hidden
                className="animate-cursor-path pointer-events-none absolute inset-0 z-20 hidden sm:block"
              >
                <div className="flex items-start">
                  <svg viewBox="0 0 16 16" className="size-4 fill-emerald-500 drop-shadow">
                    <path d="M1 1l5.5 13 2-5.5L14 6.5z" />
                  </svg>
                  <span className="mt-3 -ml-1 rounded-full bg-emerald-500 px-1.5 py-0.5 text-[10px] font-medium text-white shadow">
                    Maya
                  </span>
                </div>
              </div>

              <div className="relative mx-auto max-w-[540px] overflow-hidden rounded-lg border bg-card shadow-sm">
                <div className="flex items-center justify-between gap-3 border-b bg-surface px-3 py-2">
                  <span className="truncate font-mono text-[11px] text-muted-foreground">
                    {active.path}
                  </span>
                  {scanning ? (
                    <span className="animate-fade-in inline-flex shrink-0 items-center gap-1.5 font-mono text-[11px] text-primary">
                      <Loader2 className="size-3 animate-spin" />
                      analyzing
                    </span>
                  ) : (
                    <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                      {active.delta}
                    </span>
                  )}
                </div>
                <div
                  key={`${active.id}-${activePhase === 'fixed' || activePhase === 'clean'}`}
                  className="relative overflow-x-auto py-2 font-mono text-[11.5px] leading-6"
                >
                  {rows.map((row, index) => (
                    <DiffLineRow
                      key={`${index}-${row.code}`}
                      row={row}
                      index={index}
                      scanning={scanning}
                      flagged={activePhase === 'found' && showComments && index === active.flagged}
                    />
                  ))}
                  {scanning ? (
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 h-12 -translate-y-1/2 bg-gradient-to-b from-transparent via-primary/20 to-transparent"
                      style={{ animation: `scan-sweep ${SCAN_MS}ms ease-in-out both` }}
                    >
                      <div className="absolute inset-x-0 top-1/2 h-px bg-primary/70 shadow-[0_0_12px_2px] shadow-primary/40" />
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="relative mx-auto mt-8 max-w-[540px]" aria-live="polite">
                {showComments && activePhase !== 'idle' && activePhase !== 'scanning' ? (
                  <FindingCard
                    key={`${active.id}-${activePhase}`}
                    scenario={active}
                    phase={activePhase}
                    onApply={applyFix}
                    onUndo={undoFix}
                  />
                ) : null}
                {scanning ? (
                  <div className="space-y-2 rounded-lg bg-card/80 p-4 shadow-sm">
                    <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-full animate-pulse rounded bg-muted" />
                    <div className="h-3 w-4/5 animate-pulse rounded bg-muted" />
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Inspector */}
          <aside className="hidden border-l lg:block">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <span className="flex items-center gap-2 text-sm font-medium">
                <Sparkles className="size-3.5 text-primary" />
                Review
              </span>
              <span className="font-mono text-[11px] text-muted-foreground">@reviewray</span>
            </div>

            <div className="space-y-5 p-4">
              <div className="space-y-2">
                <PanelLabel>Verdict</PanelLabel>
                <span
                  key={verdict.label}
                  className={cn(
                    'animate-pop-in inline-flex rounded-md px-2 py-1 text-xs font-medium',
                    verdict.className,
                  )}
                >
                  {verdict.label}
                </span>
              </div>

              <div className="space-y-2.5">
                <PanelLabel>Open findings</PanelLabel>
                {severityCounts.map(({ severity, count }) => (
                  <div key={severity} className="flex items-center gap-3 text-xs">
                    <span className="w-14 text-muted-foreground">{severity}</span>
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <span
                        className={cn(
                          'block h-full rounded-full transition-[width] duration-700 ease-out',
                          SEVERITY_STYLES[severity].bar,
                        )}
                        style={{ width: `${Math.min(100, count * 50)}%` }}
                      />
                    </span>
                    <span
                      key={count}
                      className="animate-pop-in w-3 text-right font-mono tabular-nums"
                    >
                      {count}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <PanelLabel>Codebase context</PanelLabel>
                {active.context.map((file, index) => (
                  <p
                    key={`${active.id}-${file}`}
                    className="animate-fade-in truncate font-mono text-[11px] text-muted-foreground"
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    {file}
                  </p>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  ['Tokens', active.tokens],
                  ['Time', `${active.seconds}s`],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-md bg-muted/70 px-2.5 py-2">
                    <p className="font-mono text-[10px] text-muted-foreground">{label}</p>
                    <p
                      key={`${active.id}-${label}`}
                      className="animate-fade-in mt-0.5 text-sm font-medium tabular-nums"
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
