import { Temporal } from '@js-temporal/polyfill';
import type { Timezone } from './types';

/**
 * Get the current date and time in the specified timezone.
 *
 * @param timezone - IANA timezone identifier (e.g., "America/New_York", "Europe/London") or "UTC"
 * @returns A Temporal.ZonedDateTime representing the current date and time
 *
 * @example
 * ```typescript
 * import { now, browserTimezone } from '@gobrand/tiempo';
 *
 * // Server-side: Get now in UTC
 * const nowUtc = now("UTC");
 *
 * // Server-side: Get now in user's timezone (from DB/preferences)
 * const nowUser = now(user.timezone);
 *
 * // Client-side: Get now in browser's timezone
 * const nowLocal = now(browserTimezone());
 *
 * // Get now in a specific timezone
 * const nowInMadrid = now("Europe/Madrid");
 * ```
 */
export function now(timezone: Timezone): Temporal.ZonedDateTime {
  return Temporal.Now.zonedDateTimeISO(timezone);
}
