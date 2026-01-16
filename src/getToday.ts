import { Temporal } from '@js-temporal/polyfill';

/**
 * Get today's date in the system's local timezone or a specified timezone.
 *
 * @param timezone - Optional IANA timezone identifier (e.g., "America/Asuncion", "Europe/Madrid") or "UTC"
 * @returns A Temporal.PlainDate representing today's date
 *
 * @example
 * ```typescript
 * // Get today in local timezone
 * const today = getToday();
 *
 * // Get today in Madrid
 * const todayInMadrid = getToday("Europe/Madrid");
 *
 * // Get today in UTC
 * const todayUtc = getToday("UTC");
 * ```
 */
export function getToday(timezone?: "UTC" | string): Temporal.PlainDate {
  if (timezone) {
    return Temporal.Now.zonedDateTimeISO(timezone).toPlainDate();
  }
  return Temporal.Now.plainDateISO();
}
