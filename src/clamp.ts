import type { Temporal } from './shared/temporal';
import { compare, type Comparable, type Timeline } from './shared/compare';

/**
 * Restricts a value to an inclusive interval. Returns the value itself when it
 * is inside, otherwise the nearer endpoint, unchanged.
 *
 * Timeline values compare by exact instant, PlainDates by date, and
 * PlainTimes by wall-clock time. Mixed domains throw a TypeError.
 *
 * @param value - The value to restrict
 * @param interval - Inclusive bounds from the same domain as value
 * @returns value, interval.start, or interval.end
 * @throws RangeError if interval.start is after interval.end
 *
 * @example
 * ```ts
 * const start = Temporal.PlainDate.from('2025-01-01');
 * const end = Temporal.PlainDate.from('2025-01-31');
 *
 * clamp(Temporal.PlainDate.from('2025-02-14'), { start, end }); // 2025-01-31
 * clamp(Temporal.PlainDate.from('2025-01-10'), { start, end }); // 2025-01-10
 * ```
 */
export function clamp<T extends Timeline, S extends Timeline, E extends Timeline>(
  value: T,
  interval: { start: S; end: E }
): T | S | E;
export function clamp(
  value: Temporal.PlainDate,
  interval: { start: Temporal.PlainDate; end: Temporal.PlainDate }
): Temporal.PlainDate;
export function clamp(
  value: Temporal.PlainTime,
  interval: { start: Temporal.PlainTime; end: Temporal.PlainTime }
): Temporal.PlainTime;
export function clamp(
  value: Comparable,
  interval: { start: Comparable; end: Comparable }
): Comparable {
  if (compare(interval.start, interval.end) > 0) {
    throw new RangeError('clamp requires interval.start to be before or equal to interval.end');
  }
  if (compare(value, interval.start) < 0) return interval.start;
  if (compare(value, interval.end) > 0) return interval.end;
  return value;
}
