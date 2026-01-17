import { Temporal } from '@js-temporal/polyfill';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';

/**
 * Returns the number of years between two datetimes.
 * The result is positive if laterDate is after earlierDate, negative if before.
 *
 * This function uses calendar-aware calculation, which means it properly handles
 * leap years (366 days) and regular years (365 days).
 *
 * Instant inputs are converted to UTC for calendar calculations.
 * For ZonedDateTime inputs, their timezone is preserved.
 *
 * @param laterDate - The later datetime (Instant or ZonedDateTime)
 * @param earlierDate - The earlier datetime (Instant or ZonedDateTime)
 * @returns The number of years between the dates
 *
 * @example
 * ```ts
 * const later = Temporal.Instant.from('2028-01-20T12:00:00Z');
 * const earlier = Temporal.Instant.from('2025-01-20T12:00:00Z');
 *
 * differenceInYears(later, earlier); // 3
 * ```
 *
 * @example
 * ```ts
 * // Works with ZonedDateTime
 * const later = Temporal.ZonedDateTime.from('2030-06-15T15:00:00-05:00[America/New_York]');
 * const earlier = Temporal.ZonedDateTime.from('2025-06-15T15:00:00-05:00[America/New_York]');
 *
 * differenceInYears(later, earlier); // 5
 * ```
 *
 * @example
 * ```ts
 * // Returns fractional years for partial year differences
 * const later = Temporal.Instant.from('2025-07-20T12:00:00Z');
 * const earlier = Temporal.Instant.from('2025-01-20T12:00:00Z');
 *
 * differenceInYears(later, earlier); // ~0.5 (approximately half a year)
 * ```
 */
export function differenceInYears(
  laterDate: Temporal.Instant | Temporal.ZonedDateTime,
  earlierDate: Temporal.Instant | Temporal.ZonedDateTime
): number {
  const zoned1 = normalizeTemporalInput(laterDate);
  const zoned2 = normalizeTemporalInput(earlierDate);

  const duration = zoned2.until(zoned1, { largestUnit: 'hours' });
  return duration.total({ unit: 'years', relativeTo: zoned2 });
}
