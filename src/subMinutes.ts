import type { Temporal } from '@js-temporal/polyfill';
import { addMinutes } from './addMinutes';

/**
 * Subtracts the specified number of minutes from a datetime.
 *
 * This is a convenience wrapper around addMinutes with negated value.
 *
 * @param input - A Temporal.Instant (UTC) or Temporal.ZonedDateTime
 * @param minutes - Number of minutes to subtract
 * @returns ZonedDateTime with minutes subtracted, in the same timezone as input
 *
 * @example
 * ```ts
 * const instant = Temporal.Instant.from('2025-01-20T12:30:00Z');
 * const result = subMinutes(instant, 15);
 * // 2025-01-20T12:15:00Z[UTC] (15 minutes earlier)
 * ```
 */
export function subMinutes(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  minutes: number
): Temporal.ZonedDateTime {
  return addMinutes(input, -minutes);
}
