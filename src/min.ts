import type { Temporal } from './shared/temporal';
import { compare, type Comparable, type Timeline } from './shared/compare';

/**
 * Returns the earliest value in a non-empty array. The value is returned as
 * given, with its type, timezone, and calendar intact. Ties return the first.
 *
 * Timeline values compare by exact instant, PlainDates by date, and
 * PlainTimes by wall-clock time. Mixed domains throw a TypeError.
 *
 * @param values - Values from one domain; at least one is required
 * @returns The earliest value
 * @throws RangeError if values is empty
 *
 * @example
 * ```ts
 * const deadlines = [
 *   Temporal.PlainDate.from('2025-03-01'),
 *   Temporal.PlainDate.from('2025-01-15')
 * ];
 *
 * min(deadlines); // 2025-01-15
 * ```
 */
export function min<T extends Timeline>(values: readonly T[]): T;
export function min(values: readonly Temporal.PlainDate[]): Temporal.PlainDate;
export function min(values: readonly Temporal.PlainTime[]): Temporal.PlainTime;
export function min(values: readonly Comparable[]): Comparable {
  if (values.length === 0) {
    throw new RangeError('min requires at least one value');
  }
  return values.reduce((earliest, value) => (compare(value, earliest) < 0 ? value : earliest));
}
