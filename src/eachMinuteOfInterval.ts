import { Temporal } from '@js-temporal/polyfill';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';

/**
 * Returns an array of ZonedDateTime objects for each minute within the interval.
 * Each element represents the start of the minute (seconds/etc. set to 0).
 * The interval is inclusive of both start and end minutes.
 *
 * For Instant inputs, UTC is used as the timezone.
 * For ZonedDateTime inputs, the timezone of the start date is preserved.
 *
 * Warning: Large intervals can produce very large arrays. For example, a 24-hour
 * interval produces 1,441 elements. Consider whether this is appropriate for your use case.
 *
 * @param interval - The interval with start and end datetimes
 * @returns Array of ZonedDateTime at start of each minute in the interval
 *
 * @example
 * ```ts
 * const start = Temporal.ZonedDateTime.from('2025-01-06T10:30:00Z[UTC]');
 * const end = Temporal.ZonedDateTime.from('2025-01-06T10:33:45Z[UTC]');
 *
 * const minutes = eachMinuteOfInterval({ start, end });
 * // [
 * //   2025-01-06T10:30:00Z[UTC],
 * //   2025-01-06T10:31:00Z[UTC],
 * //   2025-01-06T10:32:00Z[UTC],
 * //   2025-01-06T10:33:00Z[UTC]
 * // ]
 * ```
 *
 * @example
 * ```ts
 * // Cross-hour boundary
 * const start = Temporal.ZonedDateTime.from('2025-01-06T10:58:00Z[UTC]');
 * const end = Temporal.ZonedDateTime.from('2025-01-06T11:02:00Z[UTC]');
 *
 * const minutes = eachMinuteOfInterval({ start, end });
 * // [
 * //   2025-01-06T10:58:00Z[UTC],
 * //   2025-01-06T10:59:00Z[UTC],
 * //   2025-01-06T11:00:00Z[UTC],
 * //   2025-01-06T11:01:00Z[UTC],
 * //   2025-01-06T11:02:00Z[UTC]
 * // ]
 * ```
 */
export function eachMinuteOfInterval(interval: {
  start: Temporal.Instant | Temporal.ZonedDateTime;
  end: Temporal.Instant | Temporal.ZonedDateTime;
}): Temporal.ZonedDateTime[] {
  const startZoned = normalizeTemporalInput(interval.start);
  const endZoned = normalizeTemporalInput(interval.end);

  const timezone = startZoned.timeZoneId;

  // Get start of the starting minute
  const startMinute = startZoned.round({ smallestUnit: 'minute', roundingMode: 'floor' });

  // Get start of the ending minute in the same timezone
  const endInTimezone = endZoned.withTimeZone(timezone);
  const endMinute = endInTimezone.round({ smallestUnit: 'minute', roundingMode: 'floor' });

  const minutes: Temporal.ZonedDateTime[] = [];
  let current = startMinute;

  while (Temporal.ZonedDateTime.compare(current, endMinute) <= 0) {
    minutes.push(current);
    current = current.add({ minutes: 1 });
  }

  return minutes;
}
