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
 * const date = today();
 *
 * // Get today in Madrid
 * const todayInMadrid = today("Europe/Madrid");
 *
 * // Get today in UTC
 * const todayUtc = today("UTC");
 * ```
 */
export function today(timezone?: "UTC" | string): Temporal.PlainDate {
  if (timezone) {
    return Temporal.Now.zonedDateTimeISO(timezone).toPlainDate();
  }
  return Temporal.Now.plainDateISO();
}
