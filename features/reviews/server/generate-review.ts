import { createChatCompletion } from '@/features/ai';

/**
 * System prompt engineered for high precision, low token consumption,
 * strict emoji/em-dash prohibition, and actionable code fixes.
 */
const SYSTEM_PROMPT = `You are an elite Staff Software Engineer and Senior Code Reviewer.
Your task is to review pull request code changes and deliver a high-signal, professional code review.

CRITICAL FORMATTING RULES:
1. NEVER use any emojis anywhere in your response. Strictly zero emojis.
2. NEVER use em dashes ('—') or en dashes ('–'). Use standard hyphens ('-'), commas, or periods instead.
3. Keep the review balanced and decently sized: not overly verbose, not trivially short. Focus strictly on real engineering value.
4. For every issue or mistake you identify, ALWAYS provide a concrete "Better Code Snippet" showing the improved replacement implementation.
5. Highlight what is good and what needs improvement with exact technical reasons.

EVALUATION CRITERIA:
- Correctness and Logic: Bugs, edge cases, null/undefined handling, race conditions, async flow.
- Security: Injection, authorization checks, credential exposure, data leaks, input validation.
- Performance: N+1 queries, memory leaks, blocking operations, redundant computation.
- Maintainability: Typing precision, clean error handling, boundary validation.

Do not comment on personal style preferences or subjective formatting unless it poses a real maintenance hazard.

OUTPUT STRUCTURE:

# Pull Request Review

## Summary
A concise 2 to 3 sentence evaluation of the overall change quality and intent.

## Critical and High Priority Issues
(If no critical or high severity issues are found, state: "None detected.")
For each issue found:
### [Severity] Title
- Location: file path and function/line context
- Mistake: exact explanation of what is wrong or unsafe
- Impact: realistic production failure mode or security risk
- Better Code Snippet:
\`\`\`language
// Improved implementation
\`\`\`

## Suggestions and Improvements
(If no suggestions are found, state: "None detected.")
For each suggestion:
- Title and location
- Mistake: current limitation or code smell
- Recommendation: explanation of the better approach
- Better Code Snippet:
\`\`\`language
// Recommended implementation
\`\`\`

## Positive Aspects
- Point out 2 to 3 specific good engineering practices observed in the diff (clean types, good test coverage, sound architecture, proper validation).

## Verdict
[APPROVE | APPROVE WITH SUGGESTIONS | REQUEST CHANGES]
Single sentence technical justification for the verdict.`;

type ReviewInput = {
  repoFullName: string;
  title: string;
  /** Chunks retrieved from the PR's Pinecone namespace */
  contextSnippets: string[];
  /** Optional chunks from repo-sync namespace (full codebase context) */
  repoContextSnippets: string[];
};

/**
 * Strips all emojis and replaces em/en dashes from review text to guarantee
 * 100% adherence to formatting requirements.
 */
export function sanitizeReviewOutput(text: string): string {
  return text
    // Strip emojis across standard Unicode ranges
    .replace(
      /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{200D}\u{FE0F}]/gu,
      '',
    )
    // Replace em dashes and en dashes
    .replace(/—/g, ' - ')
    .replace(/–/g, '-')
    // Clean up any double spaces created by emoji removals
    .replace(/[ \t]{2,}/g, ' ')
    // Normalize excessive consecutive newlines
    .replace(/\n{4,}/g, '\n\n\n')
    .trim();
}

/**
 * Trims and filters diff content to minimize token consumption while preserving
 * code semantics and patch context.
 */
function compressSnippets(snippets: string[], maxSnippets = 8): string {
  return snippets
    .slice(0, maxSnippets)
    .map((s) => s.trim())
    .filter(Boolean)
    .join('\n\n---\n\n');
}

function buildRepoContextSection(repoContextSnippets: string[]): string {
  if (repoContextSnippets.length === 0) {
    return '';
  }

  const compressed = compressSnippets(repoContextSnippets, 4);
  if (!compressed) return '';

  return `\n\nRelated codebase context for reference only:\n\n${compressed}`;
}

export async function generateReview(input: ReviewInput): Promise<string> {
  const context = compressSnippets(input.contextSnippets, 10);
  const repoContextSection = buildRepoContextSection(input.repoContextSnippets);

  const prompt = `Repository: ${input.repoFullName}
Pull Request: ${input.title}

Code Changes:
${context || 'No diff snippets available.'}${repoContextSection}`;

  const { text } = await createChatCompletion({
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ],
    temperature: 0.2,
    maxTokens: 1600,
  });

  return sanitizeReviewOutput(text);
}
