import { Temporal } from '@js-temporal/polyfill';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';

/**
 * Returns the number of weeks between two datetimes.
 * The result is positive if laterDate is after earlierDate, negative if before.
 *
 * This function uses calendar-aware calculation, which means it properly handles
 * DST transitions and calendar weeks.
 *
 * Instant inputs are converted to UTC for calendar calculations.
 * For ZonedDateTime inputs, their timezone is preserved.
 *
 * @param laterDate - The later datetime (Instant or ZonedDateTime)
 * @param earlierDate - The earlier datetime (Instant or ZonedDateTime)
 * @returns The number of weeks between the dates
 *
 * @example
 * ```ts
 * const later = Temporal.Instant.from('2025-02-10T12:00:00Z');
 * const earlier = Temporal.Instant.from('2025-01-20T12:00:00Z');
 *
 * differenceInWeeks(later, earlier); // 3
 * ```
 *
 * @example
 * ```ts
 * // Works with ZonedDateTime
 * const later = Temporal.ZonedDateTime.from('2025-02-10T15:00:00-05:00[America/New_York]');
 * const earlier = Temporal.ZonedDateTime.from('2025-01-20T15:00:00-05:00[America/New_York]');
 *
 * differenceInWeeks(later, earlier); // 3
 * ```
 *
 * @example
 * ```ts
 * // Returns fractional weeks for partial week differences
 * const later = Temporal.Instant.from('2025-01-27T12:00:00Z');
 * const earlier = Temporal.Instant.from('2025-01-20T12:00:00Z');
 *
 * differenceInWeeks(later, earlier); // 1
 * ```
 */
export function differenceInWeeks(
  laterDate: Temporal.Instant | Temporal.ZonedDateTime,
  earlierDate: Temporal.Instant | Temporal.ZonedDateTime
): number {
  const zoned1 = normalizeTemporalInput(laterDate);
  const zoned2 = normalizeTemporalInput(earlierDate);

  const duration = zoned2.until(zoned1, { largestUnit: 'hours' });
  return duration.total({ unit: 'weeks', relativeTo: zoned2 });
}
