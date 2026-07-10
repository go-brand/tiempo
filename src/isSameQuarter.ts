import type { Temporal } from "@js-temporal/polyfill";
import { isPlainDate } from "./shared/temporal";
import { normalizeTemporalInput } from "./shared/normalizeTemporalInput";
import { quarterOfMonth } from "./shared/quarter";

/**
 * Returns true if both inputs fall in the same calendar quarter and year.
 *
 * Quarters: Q1 = Jan–Mar, Q2 = Apr–Jun, Q3 = Jul–Sep, Q4 = Oct–Dec.
 *
 * Instant inputs are converted to UTC; ZonedDateTime inputs keep their own
 * timezone. PlainDate inputs are compared directly — a quarter is intrinsic to
 * the calendar date, so no timezone is needed.
 *
 * @param date1 - First Instant or ZonedDateTime
 * @param date2 - Second Instant or ZonedDateTime
 * @returns true if both are in the same calendar quarter, false otherwise
 *
 * @example
 * ```ts
 * const jan = Temporal.ZonedDateTime.from('2025-01-15T08:00:00Z[UTC]');
 * const mar = Temporal.ZonedDateTime.from('2025-03-31T23:59:59Z[UTC]');
 * isSameQuarter(jan, mar); // true
 * ```
 *
 * @example
 * ```ts
 * // PlainDate comparison needs no timezone
 * const a = Temporal.PlainDate.from('2025-04-05');
 * const b = Temporal.PlainDate.from('2025-06-28');
 * isSameQuarter(a, b); // true (both Q2)
 * ```
 */
export function isSameQuarter(
  date1: Temporal.Instant | Temporal.ZonedDateTime,
  date2: Temporal.Instant | Temporal.ZonedDateTime,
): boolean;
export function isSameQuarter(date1: Temporal.PlainDate, date2: Temporal.PlainDate): boolean;
export function isSameQuarter(
  date1: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
  date2: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
): boolean {
  const a = isPlainDate(date1) ? date1 : normalizeTemporalInput(date1);
  const b = isPlainDate(date2) ? date2 : normalizeTemporalInput(date2);

  return a.year === b.year && quarterOfMonth(a.month) === quarterOfMonth(b.month);
}
