import { inngest } from "@/features/inngest/client";
import { prisma } from "@/lib/db.config";
import { getPullRequestFiles } from "./pr-files";
import { generateReview } from "./generate-review";
import { postPrComment } from "./post-pr-comment";
import { chunkPrFiles } from "../utils/chunk-code";
import { buildPrNamespace, saveChunksToPinecone, searchPrContext } from "./vector";
import { buildRepoNamespace } from "@/features/repo-sync/server/repo-sync";
import type { CodeChunk } from "@/features/reviews/types/review";

export const reviewPullRequest = inngest.createFunction(
  {
    id: "review-pull-request",
    triggers: { event: "github/pr.received" },
  },
  async ({ event, step }) => {
    const pullRequestId = event.data.pullRequestId as string;

    // Step 1: Mark the PR as processing
    const pullRequest = await step.run("mark-processing", async () => {
      return prisma.pullRequest.update({
        where: { id: pullRequestId },
        data: { status: "processing" },
      });
    });

    // Step 2: Fetch PR files and break into chunks for embedding
    const chunks = await step.run("breakdown-code", async (): Promise<CodeChunk[]> => {
      const files = await getPullRequestFiles(
        pullRequest.installationId,
        pullRequest.repoFullName,
        pullRequest.prNumber
      );

      // Turn unified diffs into fixed-size chunks for embedding
      return chunkPrFiles(pullRequest.prNumber, files);
    });

    // Early exit if the PR has no reviewable code
    if (chunks.length === 0) {
      await step.run("mark-reviewed-no-code", async () => {
        await prisma.pullRequest.update({
          where: { id: pullRequestId },
          data: { status: "reviewed" },
        });
      });

      return { pullRequestId, status: "reviewed", reason: "no code to review" };
    }

    // PR namespace isolates this diff from other PRs and from repo-wide sync data
    const namespace = buildPrNamespace(
      pullRequest.repoFullName,
      pullRequest.prNumber
    );

    // Step 3: Embed and save PR chunks to Pinecone
    await step.run("save-vectors-to-pinecone", async () => {
      await saveChunksToPinecone(namespace, chunks as CodeChunk[]);
    });

    // Step 4: Pinecone needs a short delay before new vectors appear in search results
    await step.sleep("wait-for-vectors-to-index", "10s");

    // Step 5: Fetch extra context from the on-demand codebase sync, when the repo was synced
    const repoContextSnippets = await step.run("search-repo-context", async (): Promise<string[]> => {
      const repoSync = await prisma.repoSync.findUnique({
        where: { repoFullName: pullRequest.repoFullName },
      });

      if (!repoSync || repoSync.status !== "synced") {
        return [];
      }

      const repoNamespace = buildRepoNamespace(pullRequest.repoFullName);
      return searchPrContext(repoNamespace, pullRequest.title);
    });

    // Step 6: Generate the AI review using PR chunks + optional repo context
    const review = await step.run("generate-ai-review", async (): Promise<string> => {
      // Search within this PR's namespace for chunks related to the PR title
      const contextSnippets = await searchPrContext(namespace, pullRequest.title);

      return generateReview({
        repoFullName: pullRequest.repoFullName,
        title: pullRequest.title,
        contextSnippets,
        repoContextSnippets: repoContextSnippets as string[],
      });
    });

    // Step 7: Post the review as a PR comment on GitHub
    await step.run("post-pr-comment", async () => {
      await postPrComment(
        pullRequest.installationId,
        pullRequest.repoFullName,
        pullRequest.prNumber,
        review as string
      );
    });

    // Step 8: Mark the PR as reviewed in the database
    await step.run("mark-reviewed", async () => {
      await prisma.pullRequest.update({
        where: { id: pullRequestId },
        data: {
          status: "reviewed",
          reviewComment: review as string,
          reviewedAt: new Date(),
        },
      });
    });

    return { pullRequestId, status: "reviewed" };
  },
);