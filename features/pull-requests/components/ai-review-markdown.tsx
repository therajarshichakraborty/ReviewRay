'use client';

/**
 * Renders an AI review as Markdown with highlighted code blocks.
 *
 * Reviews are sanitized again at display time, so reviews stored before the
 * current pipeline (which could contain emojis or em dashes) render cleanly too.
 */

import { code } from '@streamdown/code';
import { useMemo } from 'react';
import { Streamdown } from 'streamdown';
import 'streamdown/styles.css';

import { sanitizeReview } from '@/features/reviews/utils/sanitize-review';

export function AiReviewMarkdown({ review }: { review: string }) {
  const clean = useMemo(() => sanitizeReview(review), [review]);

  return (
    <div className="ai-review-content text-sm leading-relaxed text-foreground">
      <Streamdown plugins={{ code }}>{clean}</Streamdown>
    </div>
  );
}
