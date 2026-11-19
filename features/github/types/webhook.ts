/** Subset of the GitHub `pull_request` webhook payload ReviewRay uses. */
export type PullRequestWebhookPayload = {
  /** Webhook action, e.g. `opened`, `synchronize`, `reopened` */
  action: string;
  /** GitHub App installation that received the event */
  installation: { id: number };
  repository: { full_name: string };
  pull_request: {
    number: number;
    title: string;
    draft?: boolean;
    user: { login: string } | null;
    head: { sha: string };
    base: { ref: string };
  };
};

/** Subset of the GitHub `installation` webhook payload. */
export type InstallationWebhookPayload = {
  action: string;
  installation: { id: number };
};
