import { Temporal } from '@js-temporal/polyfill';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';

/**
 * Returns the number of months between two datetimes.
 * The result is positive if laterDate is after earlierDate, negative if before.
 *
 * This function uses calendar-aware calculation, which means it properly handles
 * months with different numbers of days (28, 29, 30, or 31).
 *
 * Instant inputs are converted to UTC for calendar calculations.
 * For ZonedDateTime inputs, their timezone is preserved.
 *
 * @param laterDate - The later datetime (Instant or ZonedDateTime)
 * @param earlierDate - The earlier datetime (Instant or ZonedDateTime)
 * @returns The number of months between the dates
 *
 * @example
 * ```ts
 * const later = Temporal.Instant.from('2025-04-20T12:00:00Z');
 * const earlier = Temporal.Instant.from('2025-01-20T12:00:00Z');
 *
 * differenceInMonths(later, earlier); // 3
 * ```
 *
 * @example
 * ```ts
 * // Works with ZonedDateTime
 * const later = Temporal.ZonedDateTime.from('2025-06-15T15:00:00-05:00[America/New_York]');
 * const earlier = Temporal.ZonedDateTime.from('2025-01-15T15:00:00-05:00[America/New_York]');
 *
 * differenceInMonths(later, earlier); // 5
 * ```
 *
 * @example
 * ```ts
 * // Returns fractional months for partial month differences
 * const later = Temporal.Instant.from('2025-02-05T12:00:00Z');
 * const earlier = Temporal.Instant.from('2025-01-20T12:00:00Z');
 *
 * differenceInMonths(later, earlier); // ~0.5 (approximately half a month)
 * ```
 */
export function differenceInMonths(
  laterDate: Temporal.Instant | Temporal.ZonedDateTime,
  earlierDate: Temporal.Instant | Temporal.ZonedDateTime
): number {
  const zoned1 = normalizeTemporalInput(laterDate);
  const zoned2 = normalizeTemporalInput(earlierDate);

  const duration = zoned2.until(zoned1, { largestUnit: 'hours' });
  return duration.total({ unit: 'months', relativeTo: zoned2 });
}
