import type { Temporal } from '@js-temporal/polyfill';
import { addMicroseconds } from './addMicroseconds';

/**
 * Subtracts the specified number of microseconds from a datetime.
 *
 * This is a convenience wrapper around addMicroseconds with negated value.
 *
 * @param input - A Temporal.Instant (UTC) or Temporal.ZonedDateTime
 * @param microseconds - Number of microseconds to subtract
 * @returns ZonedDateTime with microseconds subtracted, in the same timezone as input
 *
 * @example
 * ```ts
 * const instant = Temporal.Instant.from('2025-01-20T12:00:00.001Z');
 * const result = subMicroseconds(instant, 500);
 * // 2025-01-20T12:00:00.000500Z[UTC] (500 microseconds earlier)
 * ```
 */
export function subMicroseconds(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  microseconds: number
): Temporal.ZonedDateTime {
  return addMicroseconds(input, -microseconds);
}
