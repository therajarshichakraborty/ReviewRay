import { canInstallationReview, FREE_MONTHLY_LIMIT } from '@/features/billing/server/usage';
import { inngest } from '@/features/inngest/client';
import { savePullRequest } from '@/features/reviews/server/save-pull-requests';
import { prisma } from '@/lib/db.config';
import type { InstallationWebhookPayload, PullRequestWebhookPayload } from '../types/webhook';
import { getGithubApp } from '../utils/github-app';

const REVIEWABLE_ACTIONS = new Set(['opened', 'synchronize', 'reopened', 'ready_for_review']);
/** Actions where a "limit reached" notice is helpful. Pushes stay silent. */
const NOTIFY_ACTIONS = new Set(['opened', 'reopened', 'ready_for_review']);

async function isSignatureValid(payload: string, signature: string | null) {
  if (!signature) return false;
  try {
    // Octokit wraps GitHub's HMAC verification and rejects forged payloads.
    return await getGithubApp().webhooks.verify(payload, signature);
  } catch {
    return false;
  }
}

function appUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? process.env.BETTER_AUTH_URL ?? '';
  return `${base.replace(/\/$/, '')}${path}`;
}

async function postLimitReachedNotice(event: PullRequestWebhookPayload) {
  const octokit = await getGithubApp().getInstallationOctokit(event.installation.id);
  const [owner, repo] = event.repository.full_name.split('/');

  await octokit.request('POST /repos/{owner}/{repo}/issues/{issue_number}/comments', {
    owner,
    repo,
    issue_number: event.pull_request.number,
    body: `ReviewRay skipped this pull request: the free plan includes ${FREE_MONTHLY_LIMIT} AI reviews per month and they have all been used.\n\n[Upgrade to Pro](${appUrl('/pricing')}) for unlimited reviews, or wait for the limit to reset at the start of next month.`,
  });
}

async function handleInstallationEvent(event: InstallationWebhookPayload) {
  if (event.action === 'deleted') {
    // The app was uninstalled on GitHub; drop the stale link.
    await prisma.githubInstallation.deleteMany({
      where: { installationId: event.installation.id },
    });
  }
}

async function handlePullRequestEvent(event: PullRequestWebhookPayload) {
  if (!REVIEWABLE_ACTIONS.has(event.action) || event.pull_request.draft) {
    return Response.json({ received: true, skipped: true });
  }

  const pullRequest = await savePullRequest(event);
  const allowed = await canInstallationReview(event.installation.id, pullRequest.id);

  if (!allowed) {
    await prisma.pullRequest.update({
      where: { id: pullRequest.id },
      data: { status: 'rate_limited' },
    });

    if (NOTIFY_ACTIONS.has(event.action)) {
      await postLimitReachedNotice(event).catch((error) =>
        console.warn('[webhook] could not post limit notice:', error),
      );
    }

    return Response.json({ received: true, rateLimited: true });
  }

  await inngest.send({
    name: 'github/pr.received',
    data: { pullRequestId: pullRequest.id },
  });

  return Response.json({ received: true });
}

export async function handleGithubWebhook(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get('x-hub-signature-256');
  const eventName = request.headers.get('x-github-event');

  if (!(await isSignatureValid(payload, signature))) {
    return Response.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = JSON.parse(payload);
  } catch {
    return Response.json({ error: 'Invalid payload' }, { status: 400 });
  }

  if (eventName === 'installation') {
    await handleInstallationEvent(body as InstallationWebhookPayload);
    return Response.json({ received: true });
  }

  if (eventName === 'pull_request') {
    return handlePullRequestEvent(body as PullRequestWebhookPayload);
  }

  return Response.json({ received: true });
}
