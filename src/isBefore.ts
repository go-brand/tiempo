import { Temporal } from '@js-temporal/polyfill';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';
import { isBefore as isBeforeInternal } from './shared/isBefore';

/**
 * Returns true if the first datetime is before the second datetime.
 * Compares by the underlying instant (epoch time), not by calendar date/time.
 *
 * @param date1 - First datetime (Instant or ZonedDateTime)
 * @param date2 - Second datetime (Instant or ZonedDateTime)
 * @returns true if date1 is before date2, false otherwise
 *
 * @example
 * ```ts
 * const earlier = Temporal.ZonedDateTime.from('2025-01-20T10:00:00-05:00[America/New_York]');
 * const later = Temporal.ZonedDateTime.from('2025-01-20T16:00:00-05:00[America/New_York]');
 *
 * isBefore(earlier, later); // true
 * isBefore(later, earlier); // false
 * isBefore(earlier, earlier); // false
 * ```
 *
 * @example
 * ```ts
 * // Works with Instant too
 * const instant1 = Temporal.Instant.from('2025-01-20T15:00:00Z');
 * const instant2 = Temporal.Instant.from('2025-01-20T16:00:00Z');
 *
 * isBefore(instant1, instant2); // true
 * ```
 *
 * @example
 * ```ts
 * // Different timezones - compares by instant
 * const ny = Temporal.ZonedDateTime.from('2025-01-20T10:00:00-05:00[America/New_York]');
 * const tokyo = Temporal.ZonedDateTime.from('2025-01-21T00:00:00+09:00[Asia/Tokyo]');
 *
 * isBefore(ny, tokyo); // true
 * // NY 10:00 is 15:00 UTC, Tokyo 00:00 is 15:00 UTC the previous day
 * ```
 */
export function isBefore(
  date1: Temporal.Instant | Temporal.ZonedDateTime,
  date2: Temporal.Instant | Temporal.ZonedDateTime
): boolean {
  const zoned1 = normalizeTemporalInput(date1);
  const zoned2 = normalizeTemporalInput(date2);

  return isBeforeInternal(zoned1, zoned2);
}
