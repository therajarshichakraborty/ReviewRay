import { inngest } from "@/features/inngest/client";
import { reviewPullRequest } from "@/features/reviews/server/inngest-review-pr-function";
import { serve } from "inngest/next";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [reviewPullRequest],
});