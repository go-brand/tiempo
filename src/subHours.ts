import type { Temporal } from '@js-temporal/polyfill';
import { addHours } from './addHours';

/**
 * Subtracts the specified number of hours from a datetime.
 *
 * This is a convenience wrapper around addHours with negated value.
 * Properly handles DST transitions through Temporal API.
 *
 * @param input - A Temporal.Instant (UTC) or Temporal.ZonedDateTime
 * @param hours - Number of hours to subtract
 * @returns ZonedDateTime with hours subtracted, in the same timezone as input
 *
 * @example
 * ```ts
 * const instant = Temporal.Instant.from('2025-01-20T15:00:00Z');
 * const result = subHours(instant, 3);
 * // 2025-01-20T12:00:00Z[UTC] (3 hours earlier)
 * ```
 */
export function subHours(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  hours: number
): Temporal.ZonedDateTime {
  return addHours(input, -hours);
}
