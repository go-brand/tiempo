import type { Temporal } from "@js-temporal/polyfill";
import { normalizeTemporalInput } from "./shared/normalizeTemporalInput";
import { quarterOfMonth } from "./shared/quarter";

/**
 * Returns true if both datetimes fall in the same calendar quarter and year.
 *
 * Quarters: Q1 = Jan–Mar, Q2 = Apr–Jun, Q3 = Jul–Sep, Q4 = Oct–Dec.
 *
 * Instant inputs are converted to UTC. For ZonedDateTime inputs, their
 * timezone is preserved. Convert to a common timezone before calling if
 * you need to compare from a specific perspective.
 *
 * @param date1 - First datetime (Instant or ZonedDateTime)
 * @param date2 - Second datetime (Instant or ZonedDateTime)
 * @returns true if both dates are in the same calendar quarter, false otherwise
 *
 * @example
 * ```ts
 * // Same quarter (Q1 2025)
 * const jan = Temporal.ZonedDateTime.from('2025-01-15T08:00:00Z[UTC]');
 * const mar = Temporal.ZonedDateTime.from('2025-03-31T23:59:59Z[UTC]');
 *
 * isSameQuarter(jan, mar); // true
 * ```
 *
 * @example
 * ```ts
 * // Different quarters
 * const mar = Temporal.ZonedDateTime.from('2025-03-31T23:59:59Z[UTC]');
 * const apr = Temporal.ZonedDateTime.from('2025-04-01T00:00:00Z[UTC]');
 *
 * isSameQuarter(mar, apr); // false (Q1 vs Q2)
 * ```
 *
 * @example
 * ```ts
 * // Same quarter number, different years
 * const q1of2024 = Temporal.ZonedDateTime.from('2024-02-15T00:00:00Z[UTC]');
 * const q1of2025 = Temporal.ZonedDateTime.from('2025-02-15T00:00:00Z[UTC]');
 *
 * isSameQuarter(q1of2024, q1of2025); // false (different years)
 * ```
 */
export function isSameQuarter(
  date1: Temporal.Instant | Temporal.ZonedDateTime,
  date2: Temporal.Instant | Temporal.ZonedDateTime,
): boolean {
  const zoned1 = normalizeTemporalInput(date1);
  const zoned2 = normalizeTemporalInput(date2);

  return (
    zoned1.year === zoned2.year && quarterOfMonth(zoned1.month) === quarterOfMonth(zoned2.month)
  );
}
