/**
 * Builds a compact, token-budgeted view of a pull request diff.
 *
 * Sending the real diff (instead of semantically retrieved fragments) gives the
 * model complete, ordered context for every change, while the budget keeps the
 * prompt small: noise files are dropped, patches are normalized, and the most
 * relevant source files are kept first when the diff is larger than the budget.
 */

import type { PrFile } from '@/features/reviews/types/review';

/** Files that never benefit from an AI code review. */
const IGNORED_FILE_NAMES = new Set([
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  'bun.lock',
  'bun.lockb',
  'Cargo.lock',
  'poetry.lock',
  'composer.lock',
  'Gemfile.lock',
  'Pipfile.lock',
  'go.sum',
]);

const IGNORED_DIRECTORIES = new Set([
  'node_modules',
  'dist',
  'build',
  'out',
  'coverage',
  'vendor',
  '.next',
  'generated',
  '__generated__',
  '__snapshots__',
]);

const IGNORED_EXTENSIONS = [
  '.min.js',
  '.min.css',
  '.map',
  '.snap',
  '.lock',
  '.svg',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.ico',
  '.pdf',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
  '.mp4',
  '.zip',
];

const TEST_DIRECTORIES = new Set(['__tests__', 'test', 'tests', 'spec']);
const TEST_FILE_PATTERN = /\.(test|spec)\.[a-z]+$/i;
const DOC_EXTENSIONS = ['.md', '.mdx', '.txt', '.rst'];
const NO_NEWLINE_MARKER = String.raw`\ No newline at end of file`;

/** Single-file cap so one huge file cannot crowd out the rest of the PR. */
const MAX_FILE_CHARS = 6_000;
/** A partial file is only worth including if this much of it fits. */
const MIN_PARTIAL_CHARS = 1_200;
/** Room for the file header, fences and truncation note. */
const SECTION_OVERHEAD = 200;

export type DiffBudgetResult = {
  /** Diff text ready for the prompt. */
  text: string;
  /** Paths included in `text`, in prompt order. */
  includedPaths: string[];
  /** Paths left out because of the budget or because they are noise. */
  omittedPaths: string[];
};

function pathSegments(path: string) {
  const segments = path.split('/');
  return { directories: segments.slice(0, -1), fileName: segments.at(-1) ?? path };
}

function isIgnored(path: string): boolean {
  const { directories, fileName } = pathSegments(path);
  const lowerName = fileName.toLowerCase();

  return (
    IGNORED_FILE_NAMES.has(fileName) ||
    directories.some((directory) => IGNORED_DIRECTORIES.has(directory)) ||
    IGNORED_EXTENSIONS.some((extension) => lowerName.endsWith(extension))
  );
}

function isTestFile(path: string): boolean {
  const { directories, fileName } = pathSegments(path);
  return (
    directories.some((directory) => TEST_DIRECTORIES.has(directory)) ||
    TEST_FILE_PATTERN.test(fileName)
  );
}

/** Source code first, then tests, then docs; larger changes first within a group. */
function priority(file: PrFile): number {
  const lowerPath = file.filePath.toLowerCase();
  if (DOC_EXTENSIONS.some((extension) => lowerPath.endsWith(extension))) return 2;
  if (isTestFile(file.filePath)) return 1;
  return 0;
}

function normalizePatch(patch: string): string {
  return patch
    .split('\n')
    .filter((line) => !line.startsWith(NO_NEWLINE_MARKER))
    .map((line) => line.trimEnd())
    .join('\n');
}

function truncatePatch(patch: string, limit: number): string {
  if (patch.length <= limit) return patch;
  const cut = patch.lastIndexOf('\n', limit);
  return `${patch.slice(0, cut > 0 ? cut : limit)}\n... (diff truncated)`;
}

function formatFile(file: PrFile, patch: string): string {
  const header = `### ${file.filePath} (${file.status}, +${file.additions} -${file.deletions})`;
  return `${header}\n\`\`\`diff\n${patch}\n\`\`\``;
}

export function buildDiffForReview(files: PrFile[], maxChars: number): DiffBudgetResult {
  const omittedPaths: string[] = [];
  const includedPaths: string[] = [];
  const sections: string[] = [];
  let used = 0;

  const candidates = files
    .filter((file) => {
      const reviewable = file.patch && file.status !== 'removed' && !isIgnored(file.filePath);
      if (!reviewable) omittedPaths.push(file.filePath);
      return reviewable;
    })
    .sort(
      (a, b) =>
        priority(a) - priority(b) || b.additions + b.deletions - (a.additions + a.deletions),
    );

  for (const file of candidates) {
    const patch = truncatePatch(normalizePatch(file.patch ?? ''), MAX_FILE_CHARS);
    let section = formatFile(file, patch);

    if (used + section.length > maxChars) {
      // Keep the start of an important file rather than dropping it entirely.
      const room = maxChars - used - SECTION_OVERHEAD;
      if (room < MIN_PARTIAL_CHARS) {
        omittedPaths.push(file.filePath);
        continue;
      }
      section = formatFile(file, truncatePatch(patch, room));
    }

    sections.push(section);
    includedPaths.push(file.filePath);
    used += section.length;
  }

  return { text: sections.join('\n\n'), includedPaths, omittedPaths };
}
