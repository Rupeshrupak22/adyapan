const FAILURE_DELAYS_MS = [1000, 4000, 10000];

export function getProgressiveDelayMs(failedAttempts: number) {
  if (failedAttempts <= 0) return 0;
  return FAILURE_DELAYS_MS[Math.min(failedAttempts, FAILURE_DELAYS_MS.length) - 1];
}

export async function applyProgressiveDelay(failedAttempts: number) {
  const delay = getProgressiveDelayMs(failedAttempts);
  if (delay > 0) {
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}
