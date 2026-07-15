'use client';

import { ArrowSquareOut, GithubLogo, Plugs } from '@phosphor-icons/react';

import type { GithubInstallationStatus } from '@/features/dashboard/lib/types';
import { statusBadge, statusButtonClass } from '@/features/dashboard/lib/status-style';
import { getGithubInstallUrl } from '@/features/github/utils/github-app';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { disconnectGithubApp } from '../actions';

type GithubConnectCardProps = {
  userId: string;
  installation: GithubInstallationStatus;
};

function ConnectedDetails({ accountLogin }: { accountLogin: string | null }) {
  return (
    <div className="rounded-lg border border-border/50 bg-neutral-900/5 dark:bg-neutral-950/20 p-4">
      <p className="text-xs text-muted-foreground leading-relaxed">
        Currently installed for{' '}
        <span className="font-semibold text-foreground">@{accountLogin}</span>. ReviewRay has active permissions to read repository metadata and post review comments on pull requests.
      </p>
    </div>
  );
}

function DisconnectedDetails() {
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground font-light">By connecting the GitHub App, ReviewRay will be authorized to:</p>
      <ul className="space-y-2 text-xs text-muted-foreground font-light">
        <li className="flex items-center gap-2">
          <span className="flex size-1.5 rounded-full bg-neutral-400" />
          Access public and private repositories you explicitly select
        </li>
        <li className="flex items-center gap-2">
          <span className="flex size-1.5 rounded-full bg-neutral-400" />
          Receive automated webhooks for pull request lifecycle events
        </li>
        <li className="flex items-center gap-2">
          <span className="flex size-1.5 rounded-full bg-neutral-400" />
          Post AI-generated codebase-aware review comments on PRs
        </li>
      </ul>
    </div>
  );
}

function ConnectedActions() {
  return (
    <form action={disconnectGithubApp}>
      <Button type="submit" variant="outline" size="sm" className="rounded-lg border-border/60 hover:bg-neutral-100 hover:text-red-600 dark:hover:bg-neutral-900 dark:hover:text-red-400">
        <Plugs className="size-4 mr-1.5" />
        Disconnect GitHub App
      </Button>
    </form>
  );
}

function DisconnectedActions({ installUrl }: { installUrl: string }) {
  return (
    <Button asChild size="sm" className="rounded-lg">
      <a href={installUrl}>
        <GithubLogo className="size-4 mr-1.5" />
        Install GitHub App
        <ArrowSquareOut className="size-3.5 ml-1.5 opacity-80" />
      </a>
    </Button>
  );
}

function ConnectionDetails({
  connected,
  accountLogin,
}: {
  connected: boolean;
  accountLogin: string | null;
}) {
  if (connected) {
    return <ConnectedDetails accountLogin={accountLogin} />;
  }

  return <DisconnectedDetails />;
}

function ConnectionActions({ connected, installUrl }: { connected: boolean; installUrl: string }) {
  if (connected) {
    return <ConnectedActions />;
  }

  return <DisconnectedActions installUrl={installUrl} />;
}

export function GithubConnectCard({ userId, installation }: GithubConnectCardProps) {
  const { connected, accountLogin } = installation;
  const installUrl = getGithubInstallUrl(userId);

  // Clean, high-end grayscale styling
  let cardBorderClass = 'border-border/60';
  let iconWrapperClass = 'border-border/60 bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200';
  let statusTone: 'success' | 'neutral' = 'neutral';
  let statusLabel = 'Not connected';

  if (connected) {
    cardBorderClass = 'border-neutral-300 dark:border-neutral-800';
    iconWrapperClass = 'border-neutral-300 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100';
    statusTone = 'success';
    statusLabel = 'Connected';
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 max-w-3xl">
      <Card className={cn('transition-colors rounded-xl shadow-sm bg-card/30 backdrop-blur-sm', cardBorderClass)}>
        <CardHeader className="border-b border-border/40 pb-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <span
                className={cn(
                  'flex size-12 items-center justify-center rounded-xl border',
                  iconWrapperClass,
                )}
              >
                <GithubLogo className="size-6" />
              </span>
              <div className="space-y-1">
                <CardTitle className="text-base font-semibold tracking-tight">GitHub App Integration</CardTitle>
                <CardDescription className="text-xs text-muted-foreground font-light max-w-xl">
                  Install the ReviewRay app on your GitHub user account or organization to enable codebase-aware AI code reviews.
                </CardDescription>
              </div>
            </div>
            <span className={statusBadge(statusTone, 'text-[10px] font-medium')}>{statusLabel}</span>
          </div>
        </CardHeader>
        <CardContent className="py-5">
          <ConnectionDetails connected={connected} accountLogin={accountLogin} />
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 border-t border-border/40 pt-4 bg-muted/10">
          <ConnectionActions connected={connected} installUrl={installUrl} />
        </CardFooter>
      </Card>
    </div>
  );
}
