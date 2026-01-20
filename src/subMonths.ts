import type { Temporal } from '@js-temporal/polyfill';
import { addMonths } from './addMonths';

/**
 * Subtracts the specified number of months from a datetime.
 *
 * This is a convenience wrapper around addMonths with negated value.
 * Properly handles month-end dates and calendar edge cases through Temporal API.
 *
 * @param input - A Temporal.Instant (UTC) or Temporal.ZonedDateTime
 * @param months - Number of months to subtract
 * @returns ZonedDateTime with months subtracted, in the same timezone as input
 *
 * @example
 * ```ts
 * const instant = Temporal.Instant.from('2025-04-20T12:00:00Z');
 * const result = subMonths(instant, 3);
 * // 2025-01-20T12:00:00Z[UTC] (3 months earlier)
 * ```
 */
export function subMonths(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  months: number
): Temporal.ZonedDateTime {
  return addMonths(input, -months);
}
