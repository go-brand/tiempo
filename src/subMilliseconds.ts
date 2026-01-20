import type { Temporal } from '@js-temporal/polyfill';
import { addMilliseconds } from './addMilliseconds';

/**
 * Subtracts the specified number of milliseconds from a datetime.
 *
 * This is a convenience wrapper around addMilliseconds with negated value.
 *
 * @param input - A Temporal.Instant (UTC) or Temporal.ZonedDateTime
 * @param milliseconds - Number of milliseconds to subtract
 * @returns ZonedDateTime with milliseconds subtracted, in the same timezone as input
 *
 * @example
 * ```ts
 * const instant = Temporal.Instant.from('2025-01-20T12:00:00.500Z');
 * const result = subMilliseconds(instant, 250);
 * // 2025-01-20T12:00:00.250Z[UTC] (250 milliseconds earlier)
 * ```
 */
export function subMilliseconds(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  milliseconds: number
): Temporal.ZonedDateTime {
  return addMilliseconds(input, -milliseconds);
}
