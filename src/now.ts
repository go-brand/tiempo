import { Temporal } from '@js-temporal/polyfill';

/**
 * Get the current date and time in the system's local timezone or a specified timezone.
 *
 * @param timezone - Optional IANA timezone identifier (e.g., "America/Asuncion", "Europe/Madrid") or "UTC"
 * @returns A Temporal.ZonedDateTime representing the current date and time
 *
 * @example
 * ```typescript
 * // Get now in local timezone
 * const current = now();
 *
 * // Get now in Madrid
 * const nowInMadrid = now("Europe/Madrid");
 *
 * // Get now in UTC
 * const nowUtc = now("UTC");
 * ```
 */
export function now(timezone?: 'UTC' | string): Temporal.ZonedDateTime {
  if (timezone) {
    return Temporal.Now.zonedDateTimeISO(timezone);
  }
  return Temporal.Now.zonedDateTimeISO();
}
