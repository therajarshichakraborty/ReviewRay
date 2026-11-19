import { format } from 'date-fns';
import { AlertTriangle, ArrowUpRight, Check, CheckCircle2, Unplug } from 'lucide-react';

import { GitHubIcon } from '@/components/landing/icons';
import { Button } from '@/components/ui/button';
import type { GithubInstallationStatus } from '@/features/dashboard/lib/types';
import { statusBadge, statusDotClass } from '@/features/dashboard/lib/status-styles';
import { disconnectGithubApp } from '@/features/github/actions';
import { getGithubInstallUrl } from '@/features/github/utils/github-app';
import { cn } from '@/lib/utils';

type GithubConnectCardProps = {
  userId: string;
  installation: GithubInstallationStatus;
  callbackStatus?: 'connected' | 'error';
};

const PERMISSIONS = [
  { title: 'Pull requests', detail: 'Read diffs and post one review comment per pull request' },
  { title: 'Contents', detail: 'Read files when you sync a repository for codebase context' },
  { title: 'Metadata', detail: 'List the repositories you granted access to' },
];

function CallbackNotice({ status }: { status: 'connected' | 'error' }) {
  const ok = status === 'connected';
  const Icon = ok ? CheckCircle2 : AlertTriangle;

  return (
    <div
      role="status"
      className={cn(
        'animate-pop-in flex items-start gap-3 rounded-2xl p-4 text-sm',
        ok
          ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
          : 'bg-amber-500/10 text-amber-800 dark:text-amber-300',
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" />
      {ok
        ? 'GitHub App connected. New pull requests on the selected repositories will be reviewed automatically.'
        : 'That installation could not be linked to your account. Install the app from your own GitHub account or an organization you belong to.'}
    </div>
  );
}

export function GithubConnectCard({
  userId,
  installation,
  callbackStatus,
}: GithubConnectCardProps) {
  const { connected, accountLogin, installedAt } = installation;
  const tone = connected ? 'success' : 'neutral';

  return (
    <div className="flex flex-col gap-5">
      {callbackStatus ? <CallbackNotice status={callbackStatus} /> : null}

      <section className="animate-fade-up overflow-hidden rounded-2xl bg-surface">
        <div className="flex flex-wrap items-start justify-between gap-4 p-6">
          <div className="flex items-start gap-4">
            <span className="animate-float flex size-12 shrink-0 items-center justify-center rounded-xl bg-foreground text-background">
              <GitHubIcon className="size-6" />
            </span>
            <div>
              <h3 className="text-lg font-medium">ReviewRay GitHub App</h3>
              <p className="mt-1 max-w-lg text-[15px] text-muted-foreground">
                {connected
                  ? `Installed on @${accountLogin ?? 'your account'}${installedAt ? ` since ${format(new Date(installedAt), 'MMM d, yyyy')}` : ''}.`
                  : 'Install the app on your account or organization so ReviewRay can review pull requests.'}
              </p>
            </div>
          </div>
          <span className={statusBadge(tone)}>
            <span className={cn('size-1.5 rounded-full', statusDotClass[tone])} />
            {connected ? 'Connected' : 'Not connected'}
          </span>
        </div>

        <div className="px-6 pb-5">
          <p className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
            Permissions
          </p>
          <ul className="mt-3 grid gap-3 sm:grid-cols-3">
            {PERMISSIONS.map((permission) => (
              <li
                key={permission.title}
                className="rounded-xl bg-background p-3.5 transition-transform duration-300 hover:-translate-y-0.5"
              >
                <p className="flex items-center gap-1.5 text-sm font-medium">
                  <Check className="size-3.5 text-primary" strokeWidth={3} />
                  {permission.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {permission.detail}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap items-center gap-2 bg-background/50 px-6 py-4">
          {connected ? (
            <>
              <Button asChild variant="secondary" className="group bg-background">
                <a
                  href="https://github.com/settings/installations"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Choose repositories
                  <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </Button>
              <form action={disconnectGithubApp}>
                <Button
                  type="submit"
                  variant="ghost"
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Unplug className="size-4" />
                  Disconnect
                </Button>
              </form>
            </>
          ) : (
            <Button asChild className="shadow-sm shadow-primary/25">
              <a href={getGithubInstallUrl(userId)}>
                <GitHubIcon className="size-4" />
                Install GitHub App
              </a>
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
