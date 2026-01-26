import { Temporal } from '@js-temporal/polyfill';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';

/**
 * Returns an array of ZonedDateTime objects for each calendar day within the interval.
 * Each element represents the start of day (midnight) in the timezone of the interval start.
 * The interval is inclusive of both start and end days.
 *
 * For Instant inputs, UTC is used as the timezone.
 * For ZonedDateTime inputs, the timezone of the start date is preserved.
 *
 * @param interval - The interval with start and end datetimes
 * @returns Array of ZonedDateTime at start of each day in the interval
 *
 * @example
 * ```ts
 * const start = Temporal.ZonedDateTime.from('2025-01-06T10:00:00Z[UTC]');
 * const end = Temporal.ZonedDateTime.from('2025-01-10T14:00:00Z[UTC]');
 *
 * const days = eachDayOfInterval({ start, end });
 * // [
 * //   2025-01-06T00:00:00Z[UTC],
 * //   2025-01-07T00:00:00Z[UTC],
 * //   2025-01-08T00:00:00Z[UTC],
 * //   2025-01-09T00:00:00Z[UTC],
 * //   2025-01-10T00:00:00Z[UTC]
 * // ]
 * ```
 *
 * @example
 * ```ts
 * // With timezone - preserves the timezone from start
 * const start = Temporal.ZonedDateTime.from('2025-01-06T10:00:00-05:00[America/New_York]');
 * const end = Temporal.ZonedDateTime.from('2025-01-08T14:00:00-05:00[America/New_York]');
 *
 * const days = eachDayOfInterval({ start, end });
 * // [
 * //   2025-01-06T00:00:00-05:00[America/New_York],
 * //   2025-01-07T00:00:00-05:00[America/New_York],
 * //   2025-01-08T00:00:00-05:00[America/New_York]
 * // ]
 * ```
 *
 * @example
 * ```ts
 * // With Instant (uses UTC)
 * const start = Temporal.Instant.from('2025-01-06T00:00:00Z');
 * const end = Temporal.Instant.from('2025-01-08T00:00:00Z');
 *
 * const days = eachDayOfInterval({ start, end });
 * // [
 * //   2025-01-06T00:00:00Z[UTC],
 * //   2025-01-07T00:00:00Z[UTC],
 * //   2025-01-08T00:00:00Z[UTC]
 * // ]
 * ```
 *
 * @example
 * ```ts
 * // Single day interval
 * const date = Temporal.ZonedDateTime.from('2025-01-15T12:00:00Z[UTC]');
 *
 * eachDayOfInterval({ start: date, end: date });
 * // [2025-01-15T00:00:00Z[UTC]]
 * ```
 */
export function eachDayOfInterval(interval: {
  start: Temporal.Instant | Temporal.ZonedDateTime;
  end: Temporal.Instant | Temporal.ZonedDateTime;
}): Temporal.ZonedDateTime[] {
  const startZoned = normalizeTemporalInput(interval.start);
  const endZoned = normalizeTemporalInput(interval.end);

  const timezone = startZoned.timeZoneId;
  const startDate = startZoned.toPlainDate();
  const endDate = endZoned.withTimeZone(timezone).toPlainDate();

  const days: Temporal.ZonedDateTime[] = [];
  let current = startDate;

  while (Temporal.PlainDate.compare(current, endDate) <= 0) {
    days.push(current.toZonedDateTime({ timeZone: timezone, plainTime: new Temporal.PlainTime() }));
    current = current.add({ days: 1 });
  }

  return days;
}
