import { Temporal } from '@js-temporal/polyfill';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';

/**
 * Returns an array of ZonedDateTime objects for each year within the interval.
 * Each element represents the first moment of the year (January 1st at midnight).
 * The interval is inclusive of both start and end years.
 *
 * For Instant inputs, UTC is used as the timezone.
 * For ZonedDateTime inputs, the timezone of the start date is preserved.
 *
 * @param interval - The interval with start and end datetimes
 * @returns Array of ZonedDateTime at start of each year in the interval
 *
 * @example
 * ```ts
 * const start = Temporal.ZonedDateTime.from('2022-06-15T10:00:00Z[UTC]');
 * const end = Temporal.ZonedDateTime.from('2025-03-20T14:00:00Z[UTC]');
 *
 * const years = eachYearOfInterval({ start, end });
 * // [
 * //   2022-01-01T00:00:00Z[UTC],
 * //   2023-01-01T00:00:00Z[UTC],
 * //   2024-01-01T00:00:00Z[UTC],
 * //   2025-01-01T00:00:00Z[UTC]
 * // ]
 * ```
 *
 * @example
 * ```ts
 * // Single year
 * const start = Temporal.ZonedDateTime.from('2025-01-15T00:00:00Z[UTC]');
 * const end = Temporal.ZonedDateTime.from('2025-12-31T23:59:59Z[UTC]');
 *
 * const years = eachYearOfInterval({ start, end });
 * // [2025-01-01T00:00:00Z[UTC]]
 * ```
 *
 * @example
 * ```ts
 * // With timezone
 * const start = Temporal.ZonedDateTime.from('2024-01-01T00:00:00-05:00[America/New_York]');
 * const end = Temporal.ZonedDateTime.from('2026-06-15T00:00:00-04:00[America/New_York]');
 *
 * const years = eachYearOfInterval({ start, end });
 * // [
 * //   2024-01-01T00:00:00-05:00[America/New_York],
 * //   2025-01-01T00:00:00-05:00[America/New_York],
 * //   2026-01-01T00:00:00-05:00[America/New_York]
 * // ]
 * ```
 */
export function eachYearOfInterval(interval: {
  start: Temporal.Instant | Temporal.ZonedDateTime;
  end: Temporal.Instant | Temporal.ZonedDateTime;
}): Temporal.ZonedDateTime[] {
  const startZoned = normalizeTemporalInput(interval.start);
  const endZoned = normalizeTemporalInput(interval.end);

  const timezone = startZoned.timeZoneId;
  const startYear = startZoned.year;

  // Get end year in the same timezone
  const endInTimezone = endZoned.withTimeZone(timezone);
  const endYear = endInTimezone.year;

  const years: Temporal.ZonedDateTime[] = [];

  for (let year = startYear; year <= endYear; year++) {
    const firstOfYear = Temporal.PlainDate.from({ year, month: 1, day: 1 });
    years.push(
      firstOfYear.toZonedDateTime({
        timeZone: timezone,
        plainTime: new Temporal.PlainTime(),
      })
    );
  }

  return years;
}
