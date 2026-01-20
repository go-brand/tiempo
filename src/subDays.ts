import type { Temporal } from '@js-temporal/polyfill';
import { addDays } from './addDays';

/**
 * Subtracts the specified number of days from a datetime.
 *
 * This is a convenience wrapper around addDays with negated value.
 * Properly handles DST transitions and calendar edge cases through Temporal API.
 *
 * @param input - A Temporal.Instant (UTC) or Temporal.ZonedDateTime
 * @param days - Number of days to subtract
 * @returns ZonedDateTime with days subtracted, in the same timezone as input
 *
 * @example
 * ```ts
 * const instant = Temporal.Instant.from('2025-01-25T12:00:00Z');
 * const result = subDays(instant, 5);
 * // 2025-01-20T12:00:00Z[UTC] (5 days earlier)
 * ```
 */
export function subDays(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  days: number
): Temporal.ZonedDateTime {
  return addDays(input, -days);
}
