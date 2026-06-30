import type { Temporal } from "@js-temporal/polyfill";
import { addQuarters } from "./addQuarters";

/**
 * Subtracts the specified number of quarters (3-month blocks) from a datetime.
 *
 * This is a convenience wrapper around addQuarters with negated value.
 * Properly handles month-end dates and calendar edge cases through Temporal API.
 *
 * @param input - A Temporal.Instant (UTC) or Temporal.ZonedDateTime
 * @param quarters - Number of quarters to subtract
 * @returns ZonedDateTime with quarters subtracted, in the same timezone as input
 *
 * @example
 * ```ts
 * const instant = Temporal.Instant.from('2025-07-20T12:00:00Z');
 * const result = subQuarters(instant, 2);
 * // 2025-01-20T12:00:00Z[UTC] (6 months earlier)
 * ```
 */
export function subQuarters(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  quarters: number,
): Temporal.ZonedDateTime {
  return addQuarters(input, -quarters);
}
