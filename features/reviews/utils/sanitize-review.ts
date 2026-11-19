/**
 * Enforces ReviewRay's output style regardless of which model wrote the review:
 * no emojis, no em or en dashes in prose, no leaked reasoning, tidy spacing.
 *
 * Fenced code blocks are left untouched so suggested fixes stay copy-paste exact.
 */

const EMOJI_PATTERN =
  /(?:\p{Extended_Pictographic}|\p{Regional_Indicator}|[\u{1F3FB}-\u{1F3FF}]|‍|️|⃣)/gu;

const THINK_BLOCK_PATTERN = /<(think|thinking|reasoning)>[\s\S]*?<\/\1>/gi;

function sanitizeProse(text: string): string {
  return (
    text
      .replace(EMOJI_PATTERN, '')
      // Em dashes and spaced en dashes separate clauses; a comma reads naturally there.
      .replace(/ ?— ?/g, ', ')
      .replace(/ – /g, ', ')
      // Remaining en dashes are ranges such as 2-3.
      .replace(/–/g, '-')
      .replace(/[‘’]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/…/g, '...')
      .replace(/[‐-‒−]/g, '-')
      // Spaces left behind by removed emojis, without touching indentation.
      .replace(/(\S)[ \t]{2,}/g, '$1 ')
      .replace(/(\S) +([.,;:!?])(?=\s|$)/g, '$1$2')
      // Trailing spaces, but only before a newline: the last line of a chunk may
      // be the indentation of a code fence nested in a list item.
      .replace(/[ \t]+(?=\n)/g, '')
  );
}

/** Some models wrap the whole answer in a ```markdown fence; unwrap it. */
function unwrapMarkdownFence(text: string): string {
  if (!text.endsWith('```')) return text;

  const firstNewline = text.indexOf('\n');
  if (firstNewline === -1) return text;

  const opening = text.slice(0, firstNewline).trim().toLowerCase();
  const inner = text.slice(firstNewline + 1, -3);

  // An explicit markdown fence always wraps the whole answer, even when the
  // review inside contains its own code blocks.
  if (opening === '```markdown' || opening === '```md') return inner.trim();

  // A bare fence is only a wrapper when nothing else inside is fenced.
  if (opening === '```' && !inner.includes('```')) return inner.trim();

  return text;
}

/**
 * For output that hit the token limit: drop the unfinished trailing block so the
 * review ends cleanly instead of mid-sentence or inside an open code fence.
 */
export function trimIncompleteTail(text: string): string {
  let trimmed = text.trimEnd();
  const lastBreak = trimmed.lastIndexOf('\n\n');
  if (lastBreak > trimmed.length / 2) trimmed = trimmed.slice(0, lastBreak);

  const fenceCount = trimmed.match(/```/g)?.length ?? 0;
  if (fenceCount % 2 === 1) trimmed = trimmed.slice(0, trimmed.lastIndexOf('```')).trimEnd();

  return trimmed;
}

export function sanitizeReview(raw: string): string {
  const text = unwrapMarkdownFence(raw.replace(THINK_BLOCK_PATTERN, '').trim());

  // Split on fenced code blocks; odd indexes are code and stay verbatim.
  const parts = text.split(/(```[\s\S]*?```)/g);
  const cleaned = parts
    .map((part, index) => (index % 2 === 1 ? part : sanitizeProse(part)))
    .join('');

  return cleaned.replace(/\n{3,}/g, '\n\n').trim();
}
