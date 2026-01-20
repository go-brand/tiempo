import type { Temporal } from '@js-temporal/polyfill';
import { addNanoseconds } from './addNanoseconds';

/**
 * Subtracts the specified number of nanoseconds from a datetime.
 *
 * This is a convenience wrapper around addNanoseconds with negated value.
 *
 * @param input - A Temporal.Instant (UTC) or Temporal.ZonedDateTime
 * @param nanoseconds - Number of nanoseconds to subtract
 * @returns ZonedDateTime with nanoseconds subtracted, in the same timezone as input
 *
 * @example
 * ```ts
 * const instant = Temporal.Instant.from('2025-01-20T12:00:00.000001Z');
 * const result = subNanoseconds(instant, 500);
 * // 2025-01-20T12:00:00.000000500Z[UTC] (500 nanoseconds earlier)
 * ```
 */
export function subNanoseconds(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  nanoseconds: number
): Temporal.ZonedDateTime {
  return addNanoseconds(input, -nanoseconds);
}
