import { createChatCompletion, type AiTier } from '@/features/ai';
import type { PrFile } from '@/features/reviews/types/review';
import { buildDiffForReview } from '@/features/reviews/utils/diff-budget';
import { sanitizeReview, trimIncompleteTail } from '@/features/reviews/utils/sanitize-review';

/**
 * Kept deliberately compact: it is sent on every review, so every word costs
 * tokens. Structure and length limits are explicit so output size is stable
 * across very different models.
 */
const SYSTEM_PROMPT = `You are ReviewRay, a staff-level code reviewer. Review the pull request diff and reply in GitHub Markdown using exactly this structure:

## Summary
2 to 3 sentences: what the change does and its overall quality.

**Verdict:** one of \`Approve\`, \`Approve with suggestions\`, \`Request changes\`

## Issues
Numbered list, most severe first, at most 5. Each item:
1. **[Critical|High|Medium|Low] Short title** in \`path/to/file.ext\`
   One or two sentences: what is wrong and the concrete impact.
   A fenced code block, indented under the item, containing only the corrected code (no "before" version, max 15 lines, correct language tag).
If there are no real issues, write: No blocking issues found.

## Suggestions
At most 3 bullets for non-blocking improvements (readability, performance, tests). Add a short code block only when it makes the suggestion clearer. Omit the section if there are none.

## What works well
At most 3 bullets naming specific good decisions in this diff.

Rules:
- Report only real problems visible in the diff: bugs, security, data loss, race conditions, error handling, performance, types. No style nitpicks a formatter would fix.
- Be specific and terse. Reference files and identifiers. Do not repeat the diff back.
- Never invent code that is not in the diff. If context is missing, say what to verify.
- Never use emojis. Never use em dashes or en dashes; use commas, periods or hyphens.
- Whole review under 450 words, excluding code blocks.`;

/** Diff budget per tier, in characters (roughly 4 characters per token). */
const DIFF_BUDGET: Record<AiTier, number> = {
  free: 24_000,
  pro: 48_000,
};

const MAX_REPO_SNIPPETS = 4;
const MAX_SNIPPET_CHARS = 1_200;
const MAX_DESCRIPTION_CHARS = 600;

export type ReviewInput = {
  repoFullName: string;
  title: string;
  description: string;
  files: PrFile[];
  /** Related code from the repository's Pinecone index, when the repo is synced. */
  repoContextSnippets: string[];
  tier: AiTier;
};

export type ReviewOutput = {
  markdown: string;
  model: string;
  provider: string;
  totalTokens: number | null;
};

function buildRepoContext(snippets: string[], changedPaths: string[]): string {
  const relevant = snippets
    // A file already in the diff adds nothing new as "context".
    .filter((snippet) => !changedPaths.some((path) => snippet.startsWith(`File: ${path}\n`)))
    .slice(0, MAX_REPO_SNIPPETS)
    .map((snippet) => snippet.slice(0, MAX_SNIPPET_CHARS).trim());

  if (relevant.length === 0) return '';
  return `\n\nRelated code from the repository (reference only, not part of this change):\n\n${relevant.join('\n\n---\n\n')}`;
}

function buildUserPrompt(input: ReviewInput) {
  const diff = buildDiffForReview(input.files, DIFF_BUDGET[input.tier]);
  const description = input.description.trim().slice(0, MAX_DESCRIPTION_CHARS);

  const lines = [`Repository: ${input.repoFullName}`, `Pull request: ${input.title}`];
  if (description) lines.push(`Description: ${description}`);
  if (diff.omittedPaths.length > 0) {
    lines.push(
      `Not shown (generated, binary, deleted or over budget): ${diff.omittedPaths.slice(0, 20).join(', ')}`,
    );
  }

  const prompt = `${lines.join('\n')}\n\nDiff:\n\n${diff.text}${buildRepoContext(input.repoContextSnippets, diff.includedPaths)}`;
  return { prompt, hasReviewableCode: diff.includedPaths.length > 0 };
}

/** Returns `null` when the PR contains nothing worth reviewing. */
export async function generateReview(input: ReviewInput): Promise<ReviewOutput | null> {
  const { prompt, hasReviewableCode } = buildUserPrompt(input);
  if (!hasReviewableCode) return null;

  const completion = await createChatCompletion({
    tier: input.tier,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ],
    temperature: 0.2,
    maxTokens: 1500,
  });

  if (completion.truncated) {
    console.warn(
      `[review] ${completion.model} hit the output limit; trimming the unfinished tail.`,
    );
  }

  const text = completion.truncated ? trimIncompleteTail(completion.text) : completion.text;
  const markdown = sanitizeReview(text);
  if (!markdown) {
    throw new Error('The model returned an empty review after sanitization.');
  }

  return {
    markdown,
    model: completion.model,
    provider: completion.provider,
    totalTokens: completion.usage?.totalTokens ?? null,
  };
}
