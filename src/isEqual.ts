import type { Temporal } from "./shared/temporal";
import { compare, type Comparable } from "./shared/compare";

/**
 * Returns true if both values are the same point in their domain.
 * Timeline values are equal when they are the same exact instant, even in
 * different timezones. PlainDate pairs compare dates; PlainTime pairs compare
 * wall-clock times.
 *
 * Use `isSameNanosecond` to compare wall-clock fields instead, or
 * `ZonedDateTime#equals` to also require the same timezone and calendar.
 *
 * @param date1 - First value in a matching date, time, or timeline pair
 * @param date2 - Second value in the same comparison domain
 * @returns true if date1 and date2 are equal, false otherwise
 *
 * @example
 * ```ts
 * const ny = Temporal.ZonedDateTime.from('2025-01-20T10:00:00-05:00[America/New_York]');
 * const utc = Temporal.Instant.from('2025-01-20T15:00:00Z');
 *
 * isEqual(ny, utc); // true (same instant)
 * isEqual(Temporal.PlainDate.from('2025-01-20'), Temporal.PlainDate.from('2025-01-21')); // false
 * ```
 */
export function isEqual(date1: Temporal.PlainDate, date2: Temporal.PlainDate): boolean;
export function isEqual(date1: Temporal.PlainTime, date2: Temporal.PlainTime): boolean;
export function isEqual(
  date1: Temporal.Instant | Temporal.ZonedDateTime,
  date2: Temporal.Instant | Temporal.ZonedDateTime,
): boolean;
export function isEqual(date1: Comparable, date2: Comparable): boolean {
  return compare(date1, date2) === 0;
}
