import { inngest } from '@/features/inngest/client';
import { savePullRequest } from '@/features/reviews/server/save-pull-requests';
import { getGithubApp } from '../utils/github-app';
import { getUserIdByInstallationId } from './installation';
import { canUserReview } from '@/features/billing/server/usage';
import { prisma } from '@/lib/db.config';

const REVIEWABLE_ACTIONS = ['opened', 'synchronize', 'reopened'];

export type PullRequestWebhookPayload = {
  /** Webhook action, e.g. `opened`, `synchronize`, `reopened` */
  action: string;
  /** GitHub App installation that received the event */
  installation: { id: number };
  repository: { full_name: string };
  pull_request: {
    number: number;
    title: string;
    user: { login: string } | null;
    head: { sha: string };
    base: { ref: string };
  };
};

async function isSignatureValid(payload: string, signature: string | null) {
  if (!signature) {
    return false;
  }

  const app = getGithubApp();
  // Octokit wraps GitHub's webhook crypto — rejects forged payloads.
  return app.webhooks.verify(payload, signature);
}

export async function handleGithubWebhook(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get('x-hub-signature-256');
  const eventName = request.headers.get('x-github-event');

  const isValid = await isSignatureValid(payload, signature);

  if (!isValid) {
    return Response.json({ error: 'Invalid signature' }, { status: 401 });
  }

  if (eventName !== 'pull_request') {
    return Response.json({ received: true });
  }

  const event = JSON.parse(payload) as PullRequestWebhookPayload;

  console.log('event', event);

  if (!REVIEWABLE_ACTIONS.includes(event.action)) {
    return Response.json({ received: true });
  }

  const pullRequest = await savePullRequest(event);

  const userId = await getUserIdByInstallationId(event.installation.id);

  if (userId) {
    const allowed = await canUserReview(userId);
    if (!allowed) {
      await prisma.pullRequest.update({
        where: {
          id: pullRequest.id,
        },
        data: {
          status: 'rate_limited',
        },
      });
      return Response.json({ received: true, rateLimited: true });
    }
  }

  await inngest.send({
    name: 'github/pr.received',
    data: { pullRequestId: pullRequest.id },
  });

  return Response.json({ received: true });
}
