import { Temporal } from '@js-temporal/polyfill';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';

/**
 * Returns an array of ZonedDateTime objects for each month within the interval.
 * Each element represents the first moment of the month (day 1 at midnight).
 * The interval is inclusive of both start and end months.
 *
 * For Instant inputs, UTC is used as the timezone.
 * For ZonedDateTime inputs, the timezone of the start date is preserved.
 *
 * @param interval - The interval with start and end datetimes
 * @returns Array of ZonedDateTime at start of each month in the interval
 *
 * @example
 * ```ts
 * const start = Temporal.ZonedDateTime.from('2025-01-15T10:00:00Z[UTC]');
 * const end = Temporal.ZonedDateTime.from('2025-04-20T14:00:00Z[UTC]');
 *
 * const months = eachMonthOfInterval({ start, end });
 * // [
 * //   2025-01-01T00:00:00Z[UTC],
 * //   2025-02-01T00:00:00Z[UTC],
 * //   2025-03-01T00:00:00Z[UTC],
 * //   2025-04-01T00:00:00Z[UTC]
 * // ]
 * ```
 *
 * @example
 * ```ts
 * // Cross-year boundary
 * const start = Temporal.ZonedDateTime.from('2024-11-15T00:00:00Z[UTC]');
 * const end = Temporal.ZonedDateTime.from('2025-02-15T00:00:00Z[UTC]');
 *
 * const months = eachMonthOfInterval({ start, end });
 * // [
 * //   2024-11-01T00:00:00Z[UTC],
 * //   2024-12-01T00:00:00Z[UTC],
 * //   2025-01-01T00:00:00Z[UTC],
 * //   2025-02-01T00:00:00Z[UTC]
 * // ]
 * ```
 */
export function eachMonthOfInterval(interval: {
  start: Temporal.Instant | Temporal.ZonedDateTime;
  end: Temporal.Instant | Temporal.ZonedDateTime;
}): Temporal.ZonedDateTime[] {
  const startZoned = normalizeTemporalInput(interval.start);
  const endZoned = normalizeTemporalInput(interval.end);

  const timezone = startZoned.timeZoneId;

  // Get start of the starting month
  const startYearMonth = Temporal.PlainYearMonth.from({
    year: startZoned.year,
    month: startZoned.month,
  });

  // Get end month in the same timezone
  const endInTimezone = endZoned.withTimeZone(timezone);
  const endYearMonth = Temporal.PlainYearMonth.from({
    year: endInTimezone.year,
    month: endInTimezone.month,
  });

  const months: Temporal.ZonedDateTime[] = [];
  let current = startYearMonth;

  while (Temporal.PlainYearMonth.compare(current, endYearMonth) <= 0) {
    const firstOfMonth = current.toPlainDate({ day: 1 });
    months.push(
      firstOfMonth.toZonedDateTime({
        timeZone: timezone,
        plainTime: new Temporal.PlainTime(),
      })
    );
    current = current.add({ months: 1 });
  }

  return months;
}
