import type { Temporal } from '@js-temporal/polyfill';
import { getEndOfDay } from './shared/endOfDay';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';

/**
 * Returns a ZonedDateTime representing the last moment of the year (last day at 23:59:59.999999999).
 *
 * @param input - A Temporal.Instant (UTC) or Temporal.ZonedDateTime
 * @returns ZonedDateTime at the last day of the year at 23:59:59.999999999
 *
 * @example
 * ```ts
 * // From Instant (always UTC)
 * const instant = Temporal.Instant.from('2025-06-15T12:00:00Z');
 * const end = endOfYear(instant);
 * // 2025-12-31T23:59:59.999999999Z[UTC]
 * ```
 *
 * @example
 * ```ts
 * // From ZonedDateTime (uses its timezone)
 * const zoned = Temporal.ZonedDateTime.from('2025-06-15T15:30:00-05:00[America/New_York]');
 * const end = endOfYear(zoned);
 * // 2025-12-31T23:59:59.999999999-05:00[America/New_York]
 * ```
 *
 * @example
 * ```ts
 * // Need a different timezone? Convert first
 * const instant = Temporal.Instant.from('2025-06-15T12:00:00Z');
 * const nyTime = instant.toZonedDateTimeISO('America/New_York');
 * const end = endOfYear(nyTime);
 * // 2025-12-31T23:59:59.999999999-05:00[America/New_York]
 * ```
 */
export function endOfYear(
  input: Temporal.Instant | Temporal.ZonedDateTime
): Temporal.ZonedDateTime {
  const zonedDateTime = normalizeTemporalInput(input);

  // Get the number of months in this year
  const monthsInYear = zonedDateTime.monthsInYear;

  // Set to last month, then get last day of that month
  const lastMonth = zonedDateTime.with({ month: monthsInYear });
  const lastDay = lastMonth.with({ day: lastMonth.daysInMonth });

  return getEndOfDay(lastDay);
}
