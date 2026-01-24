import { Temporal } from '@js-temporal/polyfill';
import type { Timezone } from './types';

/**
 * Get today's date in the specified timezone.
 *
 * @param timezone - IANA timezone identifier (e.g., "America/New_York", "Europe/London") or "UTC"
 * @returns A Temporal.PlainDate representing today's date
 *
 * @example
 * ```typescript
 * import { today, browserTimezone } from '@gobrand/tiempo';
 *
 * // Server-side: Get today in UTC
 * const todayUtc = today("UTC");
 *
 * // Server-side: Get today in user's timezone (from DB/preferences)
 * const todayUser = today(user.timezone);
 *
 * // Client-side: Get today in browser's timezone
 * const todayLocal = today(browserTimezone());
 *
 * // Get today in a specific timezone
 * const todayInMadrid = today("Europe/Madrid");
 * ```
 */
export function today(timezone: Timezone): Temporal.PlainDate {
  return Temporal.Now.zonedDateTimeISO(timezone).toPlainDate();
}
