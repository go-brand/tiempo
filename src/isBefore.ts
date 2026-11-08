import type { Temporal } from './shared/temporal';
import { compare, type Comparable } from './shared/compare';

/**
 * Returns true if the first datetime is before the second datetime.
 * Timeline values compare by their instant. PlainDate pairs compare dates;
 * PlainTime pairs compare wall-clock times without wrapping at midnight.
 *
 * @param date1 - First value in a matching date, time, or timeline pair
 * @param date2 - Second value in the same comparison domain
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
 * isBefore(ny, tokyo); // false
 * // NY 10:00 is 15:00 UTC, Tokyo 00:00 is 15:00 UTC on January 20
 * ```
 */
export function isBefore(date1: Temporal.PlainDate, date2: Temporal.PlainDate): boolean;
export function isBefore(date1: Temporal.PlainTime, date2: Temporal.PlainTime): boolean;
export function isBefore(
  date1: Temporal.Instant | Temporal.ZonedDateTime,
  date2: Temporal.Instant | Temporal.ZonedDateTime
): boolean;
export function isBefore(date1: Comparable, date2: Comparable): boolean {
  return compare(date1, date2) < 0;
}
