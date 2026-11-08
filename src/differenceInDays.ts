import { Temporal, isPlainDate } from './shared/temporal';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';
import type { DifferenceOptions } from './shared/differenceOptions';

/**
 * Returns the number of days between two dates or datetimes.
 * The result is positive if laterDate is after earlierDate, negative if before.
 *
 * This function uses calendar-aware calculation, which means it properly handles
 * DST transitions where days can be 23, 24, or 25 hours long.
 *
 * Two PlainDate inputs return signed whole calendar days without a timezone.
 * Their calendars must match; fractional options do not change date-only results.
 *
 * Instant inputs are converted to UTC for calendar calculations.
 * For ZonedDateTime inputs, their timezone is preserved.
 *
 * @param laterDate - The later PlainDate, Instant or ZonedDateTime
 * @param earlierDate - The earlier value in the same Temporal domain
 * @param options - Optional { fractional } to return the precise value
 * @returns The number of days between the dates, truncated toward zero (pass { fractional: true } for the precise value)
 *
 * @example
 * ```ts
 * const later = Temporal.Instant.from('2025-01-25T12:00:00Z');
 * const earlier = Temporal.Instant.from('2025-01-20T12:00:00Z');
 *
 * differenceInDays(later, earlier); // 5
 * ```
 *
 * @example
 * ```ts
 * // Works with ZonedDateTime
 * const later = Temporal.ZonedDateTime.from('2025-01-25T15:00:00-05:00[America/New_York]');
 * const earlier = Temporal.ZonedDateTime.from('2025-01-20T15:00:00-05:00[America/New_York]');
 *
 * differenceInDays(later, earlier); // 5
 * ```
 *
 * @example
 * ```ts
 * // Handles DST transitions correctly
 * const afterDst = Temporal.ZonedDateTime.from('2025-03-10T12:00:00-04:00[America/New_York]');
 * const beforeDst = Temporal.ZonedDateTime.from('2025-03-08T12:00:00-05:00[America/New_York]');
 *
 * differenceInDays(afterDst, beforeDst); // 2 (calendar days, not 48 hours)
 * ```
 */
export function differenceInDays(
  laterDate: Temporal.PlainDate,
  earlierDate: Temporal.PlainDate,
  options?: DifferenceOptions
): number;
export function differenceInDays(
  laterDate: Temporal.Instant | Temporal.ZonedDateTime,
  earlierDate: Temporal.Instant | Temporal.ZonedDateTime,
  options?: DifferenceOptions
): number;
export function differenceInDays(
  laterDate: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
  earlierDate: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
  options?: DifferenceOptions
): number {
  if (isPlainDate(laterDate) || isPlainDate(earlierDate)) {
    if (!isPlainDate(laterDate) || !isPlainDate(earlierDate)) {
      throw new TypeError('PlainDate differences require two PlainDate values');
    }
    return earlierDate.until(laterDate.toString(), { largestUnit: 'days' }).days;
  }
  const zoned1 = normalizeTemporalInput(laterDate);
  const zoned2 = normalizeTemporalInput(earlierDate);

  // A canonical string preserves zone, calendar, and precision across implementations.
  const duration = zoned2.until(zoned1.toString(), { largestUnit: 'hours' });
  const precise = duration.total({ unit: 'days', relativeTo: zoned2 });
  return options?.fractional ? precise : Math.trunc(precise);
}
