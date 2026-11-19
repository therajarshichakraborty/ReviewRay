'use client';

/**
 * Renders AI-generated review text as formatted Markdown.
 *
 * Uses Streamdown for streaming-friendly Markdown with syntax highlighting
 * via the `@streamdown/code` plugin.
 */

import { Streamdown } from 'streamdown';
import { code } from '@streamdown/code';
import 'streamdown/styles.css';

/**
 * Displays an AI review comment with Markdown formatting and code blocks.
 *
 * @param review - Raw Markdown string stored in `pullRequest.reviewComment`.
 * @returns A styled Markdown container.
 */
export function AiReviewMarkdown({ review }: { review: string }) {
  return (
    <div className="ai-review-content text-sm leading-relaxed text-foreground">
      <Streamdown plugins={{ code }}>{review}</Streamdown>
    </div>
  );
}
