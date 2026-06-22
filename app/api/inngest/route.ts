import { inngest } from "@/features/inngest/client";
import { syncRepoCodebaseFunction } from "@/features/repo-sync/server/repo-sync-function";
import { reviewPullRequest } from "@/features/reviews/server/inngest-review-pr-function";
import { serve } from "inngest/next";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [reviewPullRequest, syncRepoCodebaseFunction],
});