import type { Temporal } from '@js-temporal/polyfill';
import { addWeeks } from './addWeeks';

/**
 * Subtracts the specified number of weeks from a datetime.
 *
 * This is a convenience wrapper around addWeeks with negated value.
 * Properly handles DST transitions and calendar edge cases through Temporal API.
 *
 * @param input - A Temporal.Instant (UTC) or Temporal.ZonedDateTime
 * @param weeks - Number of weeks to subtract
 * @returns ZonedDateTime with weeks subtracted, in the same timezone as input
 *
 * @example
 * ```ts
 * const instant = Temporal.Instant.from('2025-02-03T12:00:00Z');
 * const result = subWeeks(instant, 2);
 * // 2025-01-20T12:00:00Z[UTC] (2 weeks earlier)
 * ```
 */
export function subWeeks(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  weeks: number
): Temporal.ZonedDateTime {
  return addWeeks(input, -weeks);
}
