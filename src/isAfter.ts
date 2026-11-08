import { Temporal, isPlainDate, isPlainTime } from './shared/temporal';
import { isPlainDateAfter } from './isPlainDateAfter';
import { isPlainTimeAfter } from './isPlainTimeAfter';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';
import { isAfter as isAfterInternal } from './shared/isAfter';

/**
 * Returns true if the first datetime is after the second datetime.
 * Timeline values compare by their instant. PlainDate pairs compare dates;
 * PlainTime pairs compare wall-clock times without wrapping at midnight.
 *
 * @param date1 - First value in a matching date, time, or timeline pair
 * @param date2 - Second value in the same comparison domain
 * @returns true if date1 is after date2, false otherwise
 *
 * @example
 * ```ts
 * const earlier = Temporal.ZonedDateTime.from('2025-01-20T10:00:00-05:00[America/New_York]');
 * const later = Temporal.ZonedDateTime.from('2025-01-20T16:00:00-05:00[America/New_York]');
 *
 * isAfter(later, earlier); // true
 * isAfter(earlier, later); // false
 * isAfter(earlier, earlier); // false
 * ```
 *
 * @example
 * ```ts
 * // Works with Instant too
 * const instant1 = Temporal.Instant.from('2025-01-20T15:00:00Z');
 * const instant2 = Temporal.Instant.from('2025-01-20T16:00:00Z');
 *
 * isAfter(instant2, instant1); // true
 * ```
 *
 * @example
 * ```ts
 * // Different timezones - compares by instant
 * const ny = Temporal.ZonedDateTime.from('2025-01-20T10:00:00-05:00[America/New_York]');
 * const tokyo = Temporal.ZonedDateTime.from('2025-01-21T00:00:00+09:00[Asia/Tokyo]');
 *
 * isAfter(tokyo, ny); // false
 * // NY 10:00 is 15:00 UTC, Tokyo 00:00 is 15:00 UTC on January 20 (same instant)
 * ```
 */
export function isAfter(date1: Temporal.PlainDate, date2: Temporal.PlainDate): boolean;
export function isAfter(date1: Temporal.PlainTime, date2: Temporal.PlainTime): boolean;
export function isAfter(
  date1: Temporal.Instant | Temporal.ZonedDateTime,
  date2: Temporal.Instant | Temporal.ZonedDateTime
): boolean;
export function isAfter(
  date1: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate | Temporal.PlainTime,
  date2: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate | Temporal.PlainTime
): boolean {
  if (isPlainDate(date1) || isPlainDate(date2)) {
    if (!isPlainDate(date1) || !isPlainDate(date2)) {
      throw new TypeError('PlainDate comparisons require two PlainDate values');
    }
    return isPlainDateAfter(date1, date2);
  }
  if (isPlainTime(date1) || isPlainTime(date2)) {
    if (!isPlainTime(date1) || !isPlainTime(date2)) {
      throw new TypeError('PlainTime comparisons require two PlainTime values');
    }
    return isPlainTimeAfter(date1, date2);
  }
  const zoned1 = normalizeTemporalInput(date1);
  const zoned2 = normalizeTemporalInput(date2);

  return isAfterInternal(zoned1, zoned2);
}
