import type { PullRequestStatus } from '@/features/pull-requests/types/pull-request';
import type { StatusTone } from '@/features/dashboard/lib/status-styles';

export const PR_STATUS_LABELS: Record<PullRequestStatus, string> = {
  pending: 'Queued',
  processing: 'Reviewing',
  reviewed: 'Reviewed',
  rate_limited: 'Limit reached',
  failed: 'Failed',
  skipped: 'Nothing to review',
};

const PR_STATUS_TONES: Record<PullRequestStatus, StatusTone> = {
  pending: 'neutral',
  processing: 'info',
  reviewed: 'success',
  rate_limited: 'warning',
  failed: 'danger',
  skipped: 'neutral',
};

export function getPrStatusTone(status: PullRequestStatus): StatusTone {
  return PR_STATUS_TONES[status];
}

export function isReviewInFlight(status: PullRequestStatus) {
  return status === 'pending' || status === 'processing';
}
