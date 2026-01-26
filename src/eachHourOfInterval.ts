import { Temporal } from '@js-temporal/polyfill';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';

/**
 * Returns an array of ZonedDateTime objects for each hour within the interval.
 * Each element represents the start of the hour (minute/second/etc. set to 0).
 * The interval is inclusive of both start and end hours.
 *
 * For Instant inputs, UTC is used as the timezone.
 * For ZonedDateTime inputs, the timezone of the start date is preserved.
 *
 * Note: During DST transitions, some hours may be skipped (spring forward) or
 * the array may contain fewer/more hours than expected based on wall-clock time.
 *
 * @param interval - The interval with start and end datetimes
 * @returns Array of ZonedDateTime at start of each hour in the interval
 *
 * @example
 * ```ts
 * const start = Temporal.ZonedDateTime.from('2025-01-06T10:30:00Z[UTC]');
 * const end = Temporal.ZonedDateTime.from('2025-01-06T14:15:00Z[UTC]');
 *
 * const hours = eachHourOfInterval({ start, end });
 * // [
 * //   2025-01-06T10:00:00Z[UTC],
 * //   2025-01-06T11:00:00Z[UTC],
 * //   2025-01-06T12:00:00Z[UTC],
 * //   2025-01-06T13:00:00Z[UTC],
 * //   2025-01-06T14:00:00Z[UTC]
 * // ]
 * ```
 *
 * @example
 * ```ts
 * // Cross-day boundary
 * const start = Temporal.ZonedDateTime.from('2025-01-06T22:00:00Z[UTC]');
 * const end = Temporal.ZonedDateTime.from('2025-01-07T02:00:00Z[UTC]');
 *
 * const hours = eachHourOfInterval({ start, end });
 * // [
 * //   2025-01-06T22:00:00Z[UTC],
 * //   2025-01-06T23:00:00Z[UTC],
 * //   2025-01-07T00:00:00Z[UTC],
 * //   2025-01-07T01:00:00Z[UTC],
 * //   2025-01-07T02:00:00Z[UTC]
 * // ]
 * ```
 */
export function eachHourOfInterval(interval: {
  start: Temporal.Instant | Temporal.ZonedDateTime;
  end: Temporal.Instant | Temporal.ZonedDateTime;
}): Temporal.ZonedDateTime[] {
  const startZoned = normalizeTemporalInput(interval.start);
  const endZoned = normalizeTemporalInput(interval.end);

  const timezone = startZoned.timeZoneId;

  // Get start of the starting hour
  const startHour = startZoned.round({ smallestUnit: 'hour', roundingMode: 'floor' });

  // Get start of the ending hour in the same timezone
  const endInTimezone = endZoned.withTimeZone(timezone);
  const endHour = endInTimezone.round({ smallestUnit: 'hour', roundingMode: 'floor' });

  const hours: Temporal.ZonedDateTime[] = [];
  let current = startHour;

  while (Temporal.ZonedDateTime.compare(current, endHour) <= 0) {
    hours.push(current);
    current = current.add({ hours: 1 });
  }

  return hours;
}
