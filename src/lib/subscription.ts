export const TRIAL_DURATION_DAYS = 30;

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function getTrialDaysRemaining(trialStartDate?: string | null): number {
  if (!trialStartDate) return 0;

  const startTime = new Date(trialStartDate).getTime();
  if (!Number.isFinite(startTime)) return 0;

  const endTime = startTime + TRIAL_DURATION_DAYS * DAY_IN_MS;
  return Math.max(0, Math.ceil((endTime - Date.now()) / DAY_IN_MS));
}

export function hasValidSubscriptionAccess(input: {
  status?: string | null;
  trialStartDate?: string | null;
  subscriptionEndDate?: string | null;
}): boolean {
  if (input.status === 'trial') {
    return getTrialDaysRemaining(input.trialStartDate) > 0;
  }

  if (input.status === 'active') {
    if (!input.subscriptionEndDate) return false;
    const endTime = new Date(input.subscriptionEndDate).getTime();
    return Number.isFinite(endTime) && endTime > Date.now();
  }

  return false;
}
