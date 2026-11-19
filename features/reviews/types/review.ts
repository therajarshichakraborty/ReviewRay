export type PrFileStatus =
  | 'added'
  | 'removed'
  | 'modified'
  | 'renamed'
  | 'copied'
  | 'changed'
  | 'unchanged';

/** One changed file in a pull request, as returned by the GitHub API. */
export type PrFile = {
  filePath: string;
  status: PrFileStatus;
  additions: number;
  deletions: number;
  /** Unified diff hunk. Missing for binary or very large files. */
  patch: string | null;
};

/** PR metadata plus changed files, fetched once per review run. */
export type PrSnapshot = {
  description: string;
  files: PrFile[];
};

export type CodeChunk = {
  /** Unique id used as the Pinecone record id, e.g. `repo--src/foo.ts--part-0` */
  id: string;
  /** Source file path this chunk came from */
  filePath: string;
  /** Raw text stored in Pinecone and searched at review time */
  text: string;
};
