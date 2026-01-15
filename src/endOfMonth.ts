import type { Temporal } from '@js-temporal/polyfill';
import { getEndOfDay } from './shared/endOfDay';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';

/**
 * Returns a ZonedDateTime representing the last moment of the month (last day at 23:59:59.999999999).
 *
 * @param input - A Temporal.Instant (UTC) or Temporal.ZonedDateTime
 * @returns ZonedDateTime at the last day of the month at 23:59:59.999999999
 *
 * @example
 * ```ts
 * // From Instant (always UTC)
 * const instant = Temporal.Instant.from('2025-01-15T12:00:00Z');
 * const end = endOfMonth(instant);
 * // 2025-01-31T23:59:59.999999999Z[UTC]
 * ```
 *
 * @example
 * ```ts
 * // From ZonedDateTime (uses its timezone)
 * const zoned = Temporal.ZonedDateTime.from('2025-02-15T15:30:00-05:00[America/New_York]');
 * const end = endOfMonth(zoned);
 * // 2025-02-28T23:59:59.999999999-05:00[America/New_York]
 * ```
 *
 * @example
 * ```ts
 * // Need a different timezone? Convert first
 * const instant = Temporal.Instant.from('2025-01-15T12:00:00Z');
 * const nyTime = instant.toZonedDateTimeISO('America/New_York');
 * const end = endOfMonth(nyTime);
 * // 2025-01-31T23:59:59.999999999-05:00[America/New_York]
 * ```
 */
export function endOfMonth(
  input: Temporal.Instant | Temporal.ZonedDateTime
): Temporal.ZonedDateTime {
  const zonedDateTime = normalizeTemporalInput(input);

  // Get the number of days in this month
  const daysInMonth = zonedDateTime.daysInMonth;

  // Set day to last day of month, then get end of that day
  const lastDay = zonedDateTime.with({ day: daysInMonth });

  return getEndOfDay(lastDay);
}
