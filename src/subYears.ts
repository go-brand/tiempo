import type { Temporal } from '@js-temporal/polyfill';
import { addYears } from './addYears';

/**
 * Subtracts the specified number of years from a datetime.
 *
 * This is a convenience wrapper around addYears with negated value.
 * Properly handles leap years and calendar edge cases through Temporal API.
 *
 * @param input - A Temporal.Instant (UTC) or Temporal.ZonedDateTime
 * @param years - Number of years to subtract
 * @returns ZonedDateTime with years subtracted, in the same timezone as input
 *
 * @example
 * ```ts
 * const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
 * const result = subYears(instant, 2);
 * // 2023-01-20T12:00:00Z[UTC] (2 years earlier)
 * ```
 */
export function subYears(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  years: number
): Temporal.ZonedDateTime {
  return addYears(input, -years);
}
