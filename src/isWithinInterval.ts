import { type Temporal, isPlainDate, isPlainTime } from './shared/temporal';
import { compare, type Comparable, type Timeline } from './shared/compare';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';
import { isBefore } from './shared/isBefore';
import { isAfter } from './shared/isAfter';

/**
 * Returns true if the given value is within the interval (inclusive of start and end).
 *
 * Instants and ZonedDateTimes compare by the moment they represent, not by
 * calendar date/time. PlainDates compare by date. PlainTimes compare by
 * wall-clock time, and an interval whose start is later than its end wraps
 * past midnight: 22:00 to 02:00 contains 23:30 and 01:00. A reversed timeline
 * or PlainDate interval contains nothing.
 *
 * Mixing PlainDate, PlainTime, and timeline values throws a TypeError.
 *
 * @param date - The value to check
 * @param interval - The interval with start and end values of the same kind
 * @returns true if the value is within the interval, false otherwise
 *
 * @example
 * ```ts
 * const start = Temporal.ZonedDateTime.from('2025-01-01T00:00:00+00:00[UTC]');
 * const end = Temporal.ZonedDateTime.from('2025-01-07T00:00:00+00:00[UTC]');
 * const date = Temporal.ZonedDateTime.from('2025-01-03T00:00:00+00:00[UTC]');
 *
 * isWithinInterval(date, { start, end }); // true
 * ```
 *
 * @example
 * ```ts
 * // Date outside the interval
 * const start = Temporal.ZonedDateTime.from('2025-01-01T00:00:00+00:00[UTC]');
 * const end = Temporal.ZonedDateTime.from('2025-01-07T00:00:00+00:00[UTC]');
 * const date = Temporal.ZonedDateTime.from('2025-01-10T00:00:00+00:00[UTC]');
 *
 * isWithinInterval(date, { start, end }); // false
 * ```
 *
 * @example
 * ```ts
 * // Date equal to interval start (inclusive)
 * const start = Temporal.ZonedDateTime.from('2025-01-01T00:00:00+00:00[UTC]');
 * const end = Temporal.ZonedDateTime.from('2025-01-07T00:00:00+00:00[UTC]');
 *
 * isWithinInterval(start, { start, end }); // true
 * ```
 *
 * @example
 * ```ts
 * // Date equal to interval end (inclusive)
 * const start = Temporal.ZonedDateTime.from('2025-01-01T00:00:00+00:00[UTC]');
 * const end = Temporal.ZonedDateTime.from('2025-01-07T00:00:00+00:00[UTC]');
 *
 * isWithinInterval(end, { start, end }); // true
 * ```
 *
 * @example
 * ```ts
 * // Works with Instant too
 * const start = Temporal.Instant.from('2025-01-01T00:00:00Z');
 * const end = Temporal.Instant.from('2025-01-07T00:00:00Z');
 * const date = Temporal.Instant.from('2025-01-03T00:00:00Z');
 *
 * isWithinInterval(date, { start, end }); // true
 * ```
 *
 * @example
 * ```ts
 * // Different timezones - compares by instant
 * const start = Temporal.ZonedDateTime.from('2025-01-01T00:00:00-05:00[America/New_York]');
 * const end = Temporal.ZonedDateTime.from('2025-01-07T00:00:00+09:00[Asia/Tokyo]');
 * const date = Temporal.ZonedDateTime.from('2025-01-03T12:00:00+00:00[UTC]');
 *
 * isWithinInterval(date, { start, end }); // true
 * ```
 *
 * @example
 * ```ts
 * // Dates
 * const start = Temporal.PlainDate.from('2025-07-01');
 * const end = Temporal.PlainDate.from('2025-07-15');
 *
 * isWithinInterval(Temporal.PlainDate.from('2025-07-15'), { start, end }); // true
 * ```
 *
 * @example
 * ```ts
 * // Opening hours that run past midnight
 * const start = Temporal.PlainTime.from('22:00');
 * const end = Temporal.PlainTime.from('02:00');
 *
 * isWithinInterval(Temporal.PlainTime.from('23:30'), { start, end }); // true
 * isWithinInterval(Temporal.PlainTime.from('01:00'), { start, end }); // true
 * isWithinInterval(Temporal.PlainTime.from('12:00'), { start, end }); // false
 * ```
 */
export function isWithinInterval(
  date: Temporal.PlainDate,
  interval: { start: Temporal.PlainDate; end: Temporal.PlainDate }
): boolean;
export function isWithinInterval(
  date: Temporal.PlainTime,
  interval: { start: Temporal.PlainTime; end: Temporal.PlainTime }
): boolean;
export function isWithinInterval(
  date: Temporal.Instant | Temporal.ZonedDateTime,
  interval: {
    start: Temporal.Instant | Temporal.ZonedDateTime;
    end: Temporal.Instant | Temporal.ZonedDateTime;
  }
): boolean;
export function isWithinInterval(
  date: Comparable,
  interval: { start: Comparable; end: Comparable }
): boolean {
  const { start, end } = interval;
  if ([date, start, end].some((value) => isPlainDate(value) || isPlainTime(value))) {
    const afterStart = compare(date, start) >= 0;
    const beforeEnd = compare(date, end) <= 0;
    if (isPlainTime(start) && compare(start, end) > 0) return afterStart || beforeEnd;
    return afterStart && beforeEnd;
  }

  const normalizedDate = normalizeTemporalInput(date as Timeline);
  const normalizedStart = normalizeTemporalInput(start as Timeline);
  const normalizedEnd = normalizeTemporalInput(end as Timeline);

  return !isBefore(normalizedDate, normalizedStart) && !isAfter(normalizedDate, normalizedEnd);
}
