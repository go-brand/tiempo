import { Temporal } from '@js-temporal/polyfill';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';
import { isBefore } from './shared/isBefore';
import { isAfter } from './shared/isAfter';

/**
 * Returns true if the given date is within the interval (inclusive of start and end).
 * Compares by the underlying instant (epoch time), not by calendar date/time.
 *
 * @param date - The date to check (Instant or ZonedDateTime)
 * @param interval - The interval with start and end dates
 * @returns true if date is within the interval, false otherwise
 *
 * @example
 * ```ts
 * const start = Temporal.ZonedDateTime.from('2025-01-01T00:00:00Z[UTC]');
 * const end = Temporal.ZonedDateTime.from('2025-01-07T00:00:00Z[UTC]');
 * const date = Temporal.ZonedDateTime.from('2025-01-03T00:00:00Z[UTC]');
 *
 * isWithinInterval(date, { start, end }); // true
 * ```
 *
 * @example
 * ```ts
 * // Date outside the interval
 * const start = Temporal.ZonedDateTime.from('2025-01-01T00:00:00Z[UTC]');
 * const end = Temporal.ZonedDateTime.from('2025-01-07T00:00:00Z[UTC]');
 * const date = Temporal.ZonedDateTime.from('2025-01-10T00:00:00Z[UTC]');
 *
 * isWithinInterval(date, { start, end }); // false
 * ```
 *
 * @example
 * ```ts
 * // Date equal to interval start (inclusive)
 * const start = Temporal.ZonedDateTime.from('2025-01-01T00:00:00Z[UTC]');
 * const end = Temporal.ZonedDateTime.from('2025-01-07T00:00:00Z[UTC]');
 *
 * isWithinInterval(start, { start, end }); // true
 * ```
 *
 * @example
 * ```ts
 * // Date equal to interval end (inclusive)
 * const start = Temporal.ZonedDateTime.from('2025-01-01T00:00:00Z[UTC]');
 * const end = Temporal.ZonedDateTime.from('2025-01-07T00:00:00Z[UTC]');
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
 * const date = Temporal.ZonedDateTime.from('2025-01-03T12:00:00Z[UTC]');
 *
 * isWithinInterval(date, { start, end }); // true
 * ```
 */
export function isWithinInterval(
  date: Temporal.Instant | Temporal.ZonedDateTime,
  interval: {
    start: Temporal.Instant | Temporal.ZonedDateTime;
    end: Temporal.Instant | Temporal.ZonedDateTime;
  }
): boolean {
  const normalizedDate = normalizeTemporalInput(date);
  const normalizedStart = normalizeTemporalInput(interval.start);
  const normalizedEnd = normalizeTemporalInput(interval.end);

  return !isBefore(normalizedDate, normalizedStart) && !isAfter(normalizedDate, normalizedEnd);
}
