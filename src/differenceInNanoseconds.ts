import { Temporal } from '@js-temporal/polyfill';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';

/**
 * Returns the number of nanoseconds between two datetimes.
 * The result is positive if laterDate is after earlierDate, negative if before.
 *
 * @param laterDate - The later datetime (Instant or ZonedDateTime)
 * @param earlierDate - The earlier datetime (Instant or ZonedDateTime)
 * @returns The number of nanoseconds between the dates as a BigInt
 *
 * @example
 * ```ts
 * const later = Temporal.Instant.from('2025-01-20T12:30:20.000000500Z');
 * const earlier = Temporal.Instant.from('2025-01-20T12:30:20.000000000Z');
 *
 * differenceInNanoseconds(later, earlier); // 500n
 * ```
 *
 * @example
 * ```ts
 * // Works with ZonedDateTime
 * const later = Temporal.ZonedDateTime.from('2025-01-20T15:00:00.000000001-05:00[America/New_York]');
 * const earlier = Temporal.ZonedDateTime.from('2025-01-20T15:00:00.000000000-05:00[America/New_York]');
 *
 * differenceInNanoseconds(later, earlier); // 1n
 * ```
 *
 * @example
 * ```ts
 * // Handles different timezones - compares by instant
 * const tokyo = Temporal.ZonedDateTime.from('2025-01-21T00:00:00+09:00[Asia/Tokyo]');
 * const ny = Temporal.ZonedDateTime.from('2025-01-20T10:00:00-05:00[America/New_York]');
 *
 * differenceInNanoseconds(tokyo, ny); // 0n (same instant)
 * ```
 */
export function differenceInNanoseconds(
  laterDate: Temporal.Instant | Temporal.ZonedDateTime,
  earlierDate: Temporal.Instant | Temporal.ZonedDateTime
): bigint {
  const zoned1 = normalizeTemporalInput(laterDate);
  const zoned2 = normalizeTemporalInput(earlierDate);

  return zoned1.epochNanoseconds - zoned2.epochNanoseconds;
}
