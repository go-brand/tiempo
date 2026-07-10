import type { Temporal } from "@js-temporal/polyfill";
import { isPlainDate } from "./shared/temporal";
import { differenceInMonths } from "./differenceInMonths";
import type { DifferenceOptions } from "./shared/differenceOptions";

/**
 * Returns the number of quarters (3-month blocks) between two datetimes or dates.
 * The result is positive if laterDate is after earlierDate, negative if before.
 *
 * Uses calendar-aware, elapsed-time calculation (a quarter is three months).
 * Instant inputs are converted to UTC; ZonedDateTime inputs keep their timezone.
 * PlainDate inputs are compared directly — no timezone needed.
 *
 * @param laterDate - The later Instant or ZonedDateTime
 * @param earlierDate - The earlier Instant or ZonedDateTime
 * @param options - Optional { fractional } to return the precise value
 * @returns The number of quarters, truncated toward zero (pass { fractional: true } for the precise value)
 *
 * @example
 * ```ts
 * const later = Temporal.Instant.from('2025-07-20T12:00:00Z');
 * const earlier = Temporal.Instant.from('2025-01-20T12:00:00Z');
 * differenceInQuarters(later, earlier); // 2
 * ```
 *
 * @example
 * ```ts
 * // PlainDate comparison needs no timezone
 * const later = Temporal.PlainDate.from('2025-07-20');
 * const earlier = Temporal.PlainDate.from('2025-01-20');
 * differenceInQuarters(later, earlier); // 2
 * ```
 */
export function differenceInQuarters(
  laterDate: Temporal.Instant | Temporal.ZonedDateTime,
  earlierDate: Temporal.Instant | Temporal.ZonedDateTime,
  options?: DifferenceOptions,
): number;
export function differenceInQuarters(
  laterDate: Temporal.PlainDate,
  earlierDate: Temporal.PlainDate,
  options?: DifferenceOptions,
): number;
export function differenceInQuarters(
  laterDate: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
  earlierDate: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
  options?: DifferenceOptions,
): number {
  // A quarter is three months, so work in elapsed months and divide by 3.
  const months =
    isPlainDate(laterDate) && isPlainDate(earlierDate)
      ? earlierDate.until(laterDate).total({
          unit: "months",
          relativeTo: earlierDate,
        })
      : differenceInMonths(
          laterDate as Temporal.Instant | Temporal.ZonedDateTime,
          earlierDate as Temporal.Instant | Temporal.ZonedDateTime,
          { fractional: true },
        );

  const quarters = months / 3;
  return options?.fractional ? quarters : Math.trunc(quarters);
}
