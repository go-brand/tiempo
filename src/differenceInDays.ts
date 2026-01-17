import { Temporal } from '@js-temporal/polyfill';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';

/**
 * Returns the number of days between two datetimes.
 * The result is positive if laterDate is after earlierDate, negative if before.
 *
 * This function uses calendar-aware calculation, which means it properly handles
 * DST transitions where days can be 23, 24, or 25 hours long.
 *
 * Instant inputs are converted to UTC for calendar calculations.
 * For ZonedDateTime inputs, their timezone is preserved.
 *
 * @param laterDate - The later datetime (Instant or ZonedDateTime)
 * @param earlierDate - The earlier datetime (Instant or ZonedDateTime)
 * @returns The number of days between the dates
 *
 * @example
 * ```ts
 * const later = Temporal.Instant.from('2025-01-25T12:00:00Z');
 * const earlier = Temporal.Instant.from('2025-01-20T12:00:00Z');
 *
 * differenceInDays(later, earlier); // 5
 * ```
 *
 * @example
 * ```ts
 * // Works with ZonedDateTime
 * const later = Temporal.ZonedDateTime.from('2025-01-25T15:00:00-05:00[America/New_York]');
 * const earlier = Temporal.ZonedDateTime.from('2025-01-20T15:00:00-05:00[America/New_York]');
 *
 * differenceInDays(later, earlier); // 5
 * ```
 *
 * @example
 * ```ts
 * // Handles DST transitions correctly
 * const afterDst = Temporal.ZonedDateTime.from('2025-03-10T12:00:00-04:00[America/New_York]');
 * const beforeDst = Temporal.ZonedDateTime.from('2025-03-08T12:00:00-05:00[America/New_York]');
 *
 * differenceInDays(afterDst, beforeDst); // 2 (calendar days, not 48 hours)
 * ```
 */
export function differenceInDays(
  laterDate: Temporal.Instant | Temporal.ZonedDateTime,
  earlierDate: Temporal.Instant | Temporal.ZonedDateTime
): number {
  const zoned1 = normalizeTemporalInput(laterDate);
  const zoned2 = normalizeTemporalInput(earlierDate);

  const duration = zoned2.until(zoned1, { largestUnit: 'hours' });
  return duration.total({ unit: 'days', relativeTo: zoned2 });
}
