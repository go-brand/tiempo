import { Temporal } from '@js-temporal/polyfill';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';
import { differenceInMilliseconds as differenceInMillisecondsInternal } from './shared/differenceInMilliseconds';

/**
 * Returns the number of milliseconds between two datetimes.
 * The result is positive if laterDate is after earlierDate, negative if before.
 *
 * @param laterDate - The later datetime (Instant or ZonedDateTime)
 * @param earlierDate - The earlier datetime (Instant or ZonedDateTime)
 * @returns The number of milliseconds between the dates
 *
 * @example
 * ```ts
 * const later = Temporal.Instant.from('2025-01-20T12:30:21.700Z');
 * const earlier = Temporal.Instant.from('2025-01-20T12:30:20.600Z');
 *
 * differenceInMilliseconds(later, earlier); // 1100
 * ```
 *
 * @example
 * ```ts
 * // Works with ZonedDateTime
 * const later = Temporal.ZonedDateTime.from('2025-01-20T15:00:00-05:00[America/New_York]');
 * const earlier = Temporal.ZonedDateTime.from('2025-01-20T14:00:00-05:00[America/New_York]');
 *
 * differenceInMilliseconds(later, earlier); // 3600000
 * ```
 *
 * @example
 * ```ts
 * // Handles different timezones - compares by instant
 * const tokyo = Temporal.ZonedDateTime.from('2025-01-21T00:00:00+09:00[Asia/Tokyo]');
 * const ny = Temporal.ZonedDateTime.from('2025-01-20T10:00:00-05:00[America/New_York]');
 *
 * differenceInMilliseconds(tokyo, ny); // 0 (same instant)
 * ```
 */
export function differenceInMilliseconds(
  laterDate: Temporal.Instant | Temporal.ZonedDateTime,
  earlierDate: Temporal.Instant | Temporal.ZonedDateTime
): number {
  const zoned1 = normalizeTemporalInput(laterDate);
  const zoned2 = normalizeTemporalInput(earlierDate);

  return differenceInMillisecondsInternal(zoned1, zoned2);
}
