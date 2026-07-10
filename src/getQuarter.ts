import type { Temporal } from "@js-temporal/polyfill";
import { isPlainDate } from "./shared/temporal";
import { normalizeTemporalInput } from "./shared/normalizeTemporalInput";
import { quarterOfMonth } from "./shared/quarter";

/**
 * Returns the quarter (1-4) that a datetime or date falls in.
 *
 * Quarters: Q1 = Jan–Mar, Q2 = Apr–Jun, Q3 = Jul–Sep, Q4 = Oct–Dec.
 *
 * A quarter is intrinsic to the calendar date, so no timezone is ever needed.
 * `Instant` inputs are interpreted in UTC; `ZonedDateTime` inputs use their own
 * timezone; `PlainDate` inputs use their calendar month directly.
 *
 * @param input - A Temporal.Instant (UTC), Temporal.ZonedDateTime, or Temporal.PlainDate
 * @returns The quarter number: 1, 2, 3, or 4
 *
 * @example
 * ```ts
 * getQuarter(Temporal.Instant.from('2025-05-15T12:00:00Z'));   // 2
 * getQuarter(Temporal.PlainDate.from('2025-11-15'));           // 4
 * ```
 */
export function getQuarter(
  input: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
): 1 | 2 | 3 | 4 {
  const month = isPlainDate(input) ? input.month : normalizeTemporalInput(input).month;
  return quarterOfMonth(month);
}
