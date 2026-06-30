import type { Temporal } from "@js-temporal/polyfill";
import { differenceInMonths } from "./differenceInMonths";
import type { DifferenceOptions } from "./shared/differenceOptions";

/**
 * Returns the number of quarters (3-month blocks) between two datetimes.
 * The result is positive if laterDate is after earlierDate, negative if before.
 *
 * This function uses calendar-aware calculation, which means it properly handles
 * months with different numbers of days (28, 29, 30, or 31).
 *
 * Instant inputs are converted to UTC for calendar calculations.
 * For ZonedDateTime inputs, their timezone is preserved.
 *
 * @param laterDate - The later datetime (Instant or ZonedDateTime)
 * @param earlierDate - The earlier datetime (Instant or ZonedDateTime)
 * @param options - Optional { fractional } to return the precise value
 * @returns The number of quarters between the dates, truncated toward zero (pass { fractional: true } for the precise value)
 *
 * @example
 * ```ts
 * const later = Temporal.Instant.from('2025-07-20T12:00:00Z');
 * const earlier = Temporal.Instant.from('2025-01-20T12:00:00Z');
 *
 * differenceInQuarters(later, earlier); // 2
 * ```
 *
 * @example
 * ```ts
 * // Pass { fractional: true } for partial-unit precision
 * const later = Temporal.Instant.from('2025-03-20T12:00:00Z');
 * const earlier = Temporal.Instant.from('2025-01-20T12:00:00Z');
 *
 * differenceInQuarters(later, earlier);                     // 0
 * differenceInQuarters(later, earlier, { fractional: true }); // ~0.67
 * ```
 */
export function differenceInQuarters(
  laterDate: Temporal.Instant | Temporal.ZonedDateTime,
  earlierDate: Temporal.Instant | Temporal.ZonedDateTime,
  options?: DifferenceOptions,
): number {
  // A quarter is three months, so reuse the month difference and divide by 3.
  const quarters = differenceInMonths(laterDate, earlierDate, { fractional: true }) / 3;
  return options?.fractional ? quarters : Math.trunc(quarters);
}
