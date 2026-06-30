import { Temporal } from "./shared/temporal";
import { normalizeTemporalInput } from "./shared/normalizeTemporalInput";
import { quarterStartMonth } from "./shared/quarter";

/**
 * Returns an array of ZonedDateTime objects for each quarter within the interval.
 * Each element represents the first moment of the quarter (day 1 of the quarter's
 * starting month at midnight). The interval is inclusive of both start and end quarters.
 *
 * Quarters: Q1 = Jan–Mar, Q2 = Apr–Jun, Q3 = Jul–Sep, Q4 = Oct–Dec.
 *
 * For Instant inputs, UTC is used as the timezone.
 * For ZonedDateTime inputs, the timezone of the start date is preserved.
 *
 * @param interval - The interval with start and end datetimes
 * @returns Array of ZonedDateTime at start of each quarter in the interval
 *
 * @example
 * ```ts
 * const start = Temporal.ZonedDateTime.from('2025-02-15T10:00:00Z[UTC]');
 * const end = Temporal.ZonedDateTime.from('2025-11-20T14:00:00Z[UTC]');
 *
 * const quarters = eachQuarterOfInterval({ start, end });
 * // [
 * //   2025-01-01T00:00:00Z[UTC], // Q1
 * //   2025-04-01T00:00:00Z[UTC], // Q2
 * //   2025-07-01T00:00:00Z[UTC], // Q3
 * //   2025-10-01T00:00:00Z[UTC]  // Q4
 * // ]
 * ```
 *
 * @example
 * ```ts
 * // Cross-year boundary
 * const start = Temporal.ZonedDateTime.from('2024-11-15T00:00:00Z[UTC]');
 * const end = Temporal.ZonedDateTime.from('2025-05-15T00:00:00Z[UTC]');
 *
 * const quarters = eachQuarterOfInterval({ start, end });
 * // [
 * //   2024-10-01T00:00:00Z[UTC], // Q4 2024
 * //   2025-01-01T00:00:00Z[UTC], // Q1 2025
 * //   2025-04-01T00:00:00Z[UTC]  // Q2 2025
 * // ]
 * ```
 */
export function eachQuarterOfInterval(interval: {
  start: Temporal.Instant | Temporal.ZonedDateTime;
  end: Temporal.Instant | Temporal.ZonedDateTime;
}): Temporal.ZonedDateTime[] {
  const startZoned = normalizeTemporalInput(interval.start);
  const endZoned = normalizeTemporalInput(interval.end);

  const timezone = startZoned.timeZoneId;

  // Start of the starting quarter
  const startYearMonth = Temporal.PlainYearMonth.from({
    year: startZoned.year,
    month: quarterStartMonth(startZoned.month),
  });

  // Start of the ending quarter in the same timezone
  const endInTimezone = endZoned.withTimeZone(timezone);
  const endYearMonth = Temporal.PlainYearMonth.from({
    year: endInTimezone.year,
    month: quarterStartMonth(endInTimezone.month),
  });

  const quarters: Temporal.ZonedDateTime[] = [];
  let current = startYearMonth;

  while (Temporal.PlainYearMonth.compare(current, endYearMonth) <= 0) {
    const firstOfQuarter = current.toPlainDate({ day: 1 });
    quarters.push(
      firstOfQuarter.toZonedDateTime({
        timeZone: timezone,
        plainTime: new Temporal.PlainTime(),
      }),
    );
    current = current.add({ months: 3 });
  }

  return quarters;
}
