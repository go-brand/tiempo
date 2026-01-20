import type { Temporal } from '@js-temporal/polyfill';
import { addSeconds } from './addSeconds';

/**
 * Subtracts the specified number of seconds from a datetime.
 *
 * This is a convenience wrapper around addSeconds with negated value.
 *
 * @param input - A Temporal.Instant (UTC) or Temporal.ZonedDateTime
 * @param seconds - Number of seconds to subtract
 * @returns ZonedDateTime with seconds subtracted, in the same timezone as input
 *
 * @example
 * ```ts
 * const instant = Temporal.Instant.from('2025-01-20T12:00:45Z');
 * const result = subSeconds(instant, 30);
 * // 2025-01-20T12:00:15Z[UTC] (30 seconds earlier)
 * ```
 */
export function subSeconds(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  seconds: number
): Temporal.ZonedDateTime {
  return addSeconds(input, -seconds);
}
