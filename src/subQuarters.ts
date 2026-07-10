import type { Temporal } from "@js-temporal/polyfill";
import { isPlainDate } from "./shared/temporal";
import { addQuarters } from "./addQuarters";

/**
 * Subtracts the specified number of quarters (3-month blocks) from a datetime or date.
 *
 * This is a convenience wrapper around addQuarters with the count negated.
 * PlainDate inputs stay in calendar space and return a PlainDate.
 *
 * @param input - A Temporal.Instant (UTC) or Temporal.ZonedDateTime
 * @param quarters - Number of quarters to subtract
 * @returns A ZonedDateTime (for Instant/ZonedDateTime) with the quarters subtracted
 *
 * @example
 * ```ts
 * const instant = Temporal.Instant.from('2025-07-20T12:00:00Z');
 * subQuarters(instant, 2);
 * // 2025-01-20T12:00:00Z[UTC] (6 months earlier)
 * ```
 *
 * @example
 * ```ts
 * subQuarters(Temporal.PlainDate.from('2025-07-20'), 1);
 * // 2025-04-20
 * ```
 */
export function subQuarters(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  quarters: number,
): Temporal.ZonedDateTime;
export function subQuarters(input: Temporal.PlainDate, quarters: number): Temporal.PlainDate;
export function subQuarters(
  input: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
  quarters: number,
): Temporal.ZonedDateTime | Temporal.PlainDate {
  // Branch so each call resolves to the matching addQuarters overload.
  return isPlainDate(input) ? addQuarters(input, -quarters) : addQuarters(input, -quarters);
}
