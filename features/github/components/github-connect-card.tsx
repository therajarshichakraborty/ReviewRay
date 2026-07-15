// Server component — no directive needed

import { disconnectGithubApp } from '@/features/github/actions';
import { getGithubInstallUrl } from '@/features/github/utils/github-app';
import { statusBadge } from '@/features/dashboard/lib/status-styles';
import { GithubLogo, ArrowSquareOut, Plugs } from '@phosphor-icons/react/dist/ssr';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

type GithubConnectCardProps = {
  userId: string;
  installation: {
    connected: boolean;
    accountLogin: string | null;
  };
};

function ConnectedDetails({ accountLogin }: { accountLogin: string | null }) {
  return (
    <div className="rounded-xl border border-blue-200/50 dark:border-blue-900/40 bg-blue-50/40 dark:bg-blue-950/20 p-4">
      <div className="flex items-start gap-3">
        <div className="mt-1.5 size-2 rounded-full bg-emerald-500 shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          Currently installed for{' '}
          <span className="font-semibold text-foreground">@{accountLogin}</span>. ReviewRay has
          active permissions to read repository metadata and post review comments on pull requests.
        </p>
      </div>
    </div>
  );
}

function DisconnectedDetails() {
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground font-light">
        By connecting the GitHub App, ReviewRay will be authorized to:
      </p>
      <ul className="space-y-2.5 text-xs text-muted-foreground font-light">
        <li className="flex items-center gap-2.5">
          <span className="flex size-1.5 rounded-full bg-blue-400" />
          Access public and private repositories you explicitly select
        </li>
        <li className="flex items-center gap-2.5">
          <span className="flex size-1.5 rounded-full bg-blue-400" />
          Receive automated webhooks for pull request lifecycle events
        </li>
        <li className="flex items-center gap-2.5">
          <span className="flex size-1.5 rounded-full bg-blue-400" />
          Post AI-generated codebase-aware review comments on PRs
        </li>
      </ul>
    </div>
  );
}

function ConnectedActions() {
  return (
    <form action={disconnectGithubApp}>
      <Button
        type="submit"
        variant="outline"
        size="sm"
        className="rounded-lg border-border/60 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950/20 dark:hover:text-red-400 dark:hover:border-red-900/40 transition-colors"
      >
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

export function GithubConnectCard({ userId, installation }: GithubConnectCardProps) {
  const { connected, accountLogin } = installation;
  const installUrl = getGithubInstallUrl(userId);

  const cardBorderClass = connected
    ? 'border-blue-300/50 dark:border-blue-800/50'
    : 'border-border/60';

  const iconWrapperClass = connected
    ? 'border-blue-300/60 dark:border-blue-800/60 bg-blue-100/60 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400'
    : 'border-border/60 bg-muted text-muted-foreground';

  const statusTone = connected ? ('success' as const) : ('neutral' as const);
  const statusLabel = connected ? 'Connected' : 'Not connected';

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 max-w-3xl">
      <Card
        className={cn(
          'transition-all duration-200 rounded-xl shadow-sm bg-card/60 backdrop-blur-sm overflow-hidden',
          cardBorderClass,
        )}
      >
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
                <CardTitle className="text-base font-semibold tracking-tight">
                  GitHub App Integration
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground font-light max-w-xl">
                  Install the ReviewRay app on your GitHub user account or organization to enable
                  codebase-aware AI code reviews.
                </CardDescription>
              </div>
            </div>
            <span className={statusBadge(statusTone, 'text-[10px] font-medium shrink-0')}>
              {statusLabel}
            </span>
          </div>
        </CardHeader>

        <CardContent className="py-5">
          {connected ? (
            <ConnectedDetails accountLogin={accountLogin} />
          ) : (
            <DisconnectedDetails />
          )}
        </CardContent>

        <CardFooter className="flex flex-wrap gap-2 border-t border-border/40 pt-4 bg-blue-50/20 dark:bg-blue-950/10">
          {connected ? (
            <ConnectedActions />
          ) : (
            <DisconnectedActions installUrl={installUrl} />
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
