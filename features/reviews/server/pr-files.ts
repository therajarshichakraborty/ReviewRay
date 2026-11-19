import { getGithubApp } from '@/features/github/utils/github-app';
import type { PrFile, PrFileStatus, PrSnapshot } from '../types/review';

const FILES_PER_PAGE = 100;
/** GitHub caps the files endpoint at 3000 files; 300 is plenty for a review. */
const MAX_PAGES = 3;

function splitRepo(repoFullName: string) {
  const [owner, repo] = repoFullName.split('/');
  return { owner, repo };
}

/** Fetches the PR description and every changed file in one place. */
export async function getPullRequestSnapshot(
  installationId: number,
  repoFullName: string,
  prNumber: number,
): Promise<PrSnapshot> {
  const octokit = await getGithubApp().getInstallationOctokit(installationId);
  const { owner, repo } = splitRepo(repoFullName);

  const { data: pullRequest } = await octokit.request(
    'GET /repos/{owner}/{repo}/pulls/{pull_number}',
    {
      owner,
      repo,
      pull_number: prNumber,
    },
  );

  const files: PrFile[] = [];

  for (let page = 1; page <= MAX_PAGES; page++) {
    const { data } = await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}/files', {
      owner,
      repo,
      pull_number: prNumber,
      per_page: FILES_PER_PAGE,
      page,
    });

    for (const file of data) {
      files.push({
        filePath: file.filename,
        status: file.status as PrFileStatus,
        additions: file.additions,
        deletions: file.deletions,
        patch: file.patch ?? null,
      });
    }

    if (data.length < FILES_PER_PAGE) break;
  }

  return { description: pullRequest.body ?? '', files };
}
