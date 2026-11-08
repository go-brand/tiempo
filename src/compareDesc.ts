import type { Temporal } from './shared/temporal';
import { compare, type Comparable } from './shared/compare';

/**
 * Compares two values for descending order: -1 if the first is later,
 * 1 if it is earlier, 0 if they are equal. Pass it to `Array#sort`.
 *
 * Timeline values compare by exact instant, PlainDates by date, and
 * PlainTimes by wall-clock time. Mixed domains throw a TypeError.
 *
 * @param date1 - First value in a matching date, time, or timeline pair
 * @param date2 - Second value in the same comparison domain
 * @returns -1, 0, or 1
 *
 * @example
 * ```ts
 * const dates = [
 *   Temporal.PlainDate.from('2025-01-01'),
 *   Temporal.PlainDate.from('2025-03-01'),
 *   Temporal.PlainDate.from('2025-02-01'),
 * ];
 *
 * dates.sort(compareDesc);
 * // [2025-03-01, 2025-02-01, 2025-01-01]
 * ```
 */
export function compareDesc(date1: Temporal.PlainDate, date2: Temporal.PlainDate): -1 | 0 | 1;
export function compareDesc(date1: Temporal.PlainTime, date2: Temporal.PlainTime): -1 | 0 | 1;
export function compareDesc(
  date1: Temporal.Instant | Temporal.ZonedDateTime,
  date2: Temporal.Instant | Temporal.ZonedDateTime
): -1 | 0 | 1;
export function compareDesc(date1: Comparable, date2: Comparable): -1 | 0 | 1 {
  return compare(date2, date1);
}
