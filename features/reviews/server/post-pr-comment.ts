import { getGithubApp } from '@/features/github/utils/github-app';

/** Hidden marker that identifies ReviewRay's comment on a pull request. */
const REVIEW_MARKER = '<!-- reviewray:review -->';

export function buildCommentBody(review: string): string {
  return `${REVIEW_MARKER}\n${review}\n\n---\n<sub>Reviewed by ReviewRay. Push a new commit to refresh this review.</sub>`;
}

/**
 * Posts the review on the pull request, or updates ReviewRay's previous
 * comment in place so new pushes do not flood the conversation.
 */
export async function upsertPrComment(
  installationId: number,
  repoFullName: string,
  prNumber: number,
  body: string,
) {
  const octokit = await getGithubApp().getInstallationOctokit(installationId);
  const [owner, repo] = repoFullName.split('/');

  const comments = await octokit.paginate(
    'GET /repos/{owner}/{repo}/issues/{issue_number}/comments',
    {
      owner,
      repo,
      issue_number: prNumber,
      per_page: 100,
    },
  );

  const existing = comments.find(
    (comment) => comment.user?.type === 'Bot' && comment.body?.startsWith(REVIEW_MARKER),
  );

  if (existing) {
    await octokit.request('PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}', {
      owner,
      repo,
      comment_id: existing.id,
      body,
    });
    return;
  }

  await octokit.request('POST /repos/{owner}/{repo}/issues/{issue_number}/comments', {
    owner,
    repo,
    issue_number: prNumber,
    body,
  });
}
