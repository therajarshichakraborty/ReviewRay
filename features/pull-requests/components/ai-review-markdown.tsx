'use client';

/**
 * Renders an AI review as Markdown with code blocks highlighted in GitHub's own
 * themes (GitHub Light / GitHub Dark), switching with the site theme.
 *
 * Reviews are sanitized again at display time, so reviews stored before the
 * current pipeline (which could contain emojis or em dashes) render cleanly too.
 */

import { createCodePlugin } from '@streamdown/code';
import { useMemo } from 'react';
import { Streamdown } from 'streamdown';
import 'streamdown/styles.css';

import { sanitizeReview } from '@/features/reviews/utils/sanitize-review';

/** The exact palettes github.com uses for code: light-default and dark-default. */
const githubCode = createCodePlugin({ themes: ['github-light-default', 'github-dark-default'] });
const PLUGINS = { code: githubCode };

export function AiReviewMarkdown({ review }: { review: string }) {
  const clean = useMemo(() => sanitizeReview(review), [review]);

  return (
    <div className="ai-review-content text-sm leading-relaxed text-foreground">
      <Streamdown plugins={PLUGINS}>{clean}</Streamdown>
    </div>
  );
}
