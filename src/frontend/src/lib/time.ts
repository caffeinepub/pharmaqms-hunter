import type { Time } from '@/backend';

export function isJobFromLast24Hours(postedTime: Time): boolean {
  try {
    const jobDate = new Date(Number(postedTime) / 1_000_000); // Convert nanoseconds to milliseconds
    const now = new Date();
    const diffMs = now.getTime() - jobDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours <= 24;
  } catch {
    return false;
  }
}
