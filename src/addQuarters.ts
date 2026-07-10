import type { Temporal } from "@js-temporal/polyfill";
import { isPlainDate } from "./shared/temporal";
import { normalizeTemporalInput } from "./shared/normalizeTemporalInput";

/**
 * Adds the specified number of quarters (3-month blocks) to a datetime or date.
 *
 * Properly handles month-end dates and calendar edge cases through Temporal API.
 * Instant inputs are converted to UTC; ZonedDateTime inputs preserve their
 * timezone. PlainDate inputs stay in calendar space and return a PlainDate.
 *
 * @param input - A Temporal.Instant (UTC) or Temporal.ZonedDateTime
 * @param quarters - Number of quarters to add (can be negative to subtract)
 * @returns A ZonedDateTime (for Instant/ZonedDateTime) with the quarters added
 *
 * @example
 * ```ts
 * const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
 * addQuarters(instant, 2);
 * // 2025-07-20T12:00:00Z[UTC] (6 months later)
 * ```
 *
 * @example
 * ```ts
 * // Calendar arithmetic on a date stays a date
 * addQuarters(Temporal.PlainDate.from('2025-01-31'), 1);
 * // 2025-04-30 (Jan 31 → Apr 30)
 * ```
 */
export function addQuarters(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  quarters: number,
): Temporal.ZonedDateTime;
export function addQuarters(input: Temporal.PlainDate, quarters: number): Temporal.PlainDate;
export function addQuarters(
  input: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
  quarters: number,
): Temporal.ZonedDateTime | Temporal.PlainDate {
  if (isPlainDate(input)) {
    return input.add({ months: quarters * 3 });
  }
  return normalizeTemporalInput(input).add({ months: quarters * 3 });
}
