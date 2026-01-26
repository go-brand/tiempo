import { Temporal } from '@js-temporal/polyfill';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';

/**
 * Returns an array of ZonedDateTime objects for each week within the interval.
 * Each element represents the first moment of the week (Monday at midnight).
 * Uses ISO 8601 week definition: weeks start on Monday.
 * The interval is inclusive of both start and end weeks.
 *
 * For Instant inputs, UTC is used as the timezone.
 * For ZonedDateTime inputs, the timezone of the start date is preserved.
 *
 * @param interval - The interval with start and end datetimes
 * @returns Array of ZonedDateTime at start of each week (Monday) in the interval
 *
 * @example
 * ```ts
 * const start = Temporal.ZonedDateTime.from('2025-01-06T10:00:00Z[UTC]'); // Monday
 * const end = Temporal.ZonedDateTime.from('2025-01-22T14:00:00Z[UTC]');   // Wednesday
 *
 * const weeks = eachWeekOfInterval({ start, end });
 * // [
 * //   2025-01-06T00:00:00Z[UTC],  // Week 2
 * //   2025-01-13T00:00:00Z[UTC],  // Week 3
 * //   2025-01-20T00:00:00Z[UTC]   // Week 4
 * // ]
 * ```
 *
 * @example
 * ```ts
 * // Mid-week start
 * const start = Temporal.ZonedDateTime.from('2025-01-08T10:00:00Z[UTC]'); // Wednesday
 * const end = Temporal.ZonedDateTime.from('2025-01-15T14:00:00Z[UTC]');   // Wednesday
 *
 * const weeks = eachWeekOfInterval({ start, end });
 * // [
 * //   2025-01-06T00:00:00Z[UTC],  // Monday of week containing Jan 8
 * //   2025-01-13T00:00:00Z[UTC]   // Monday of week containing Jan 15
 * // ]
 * ```
 *
 * @example
 * ```ts
 * // Cross-year boundary
 * const start = Temporal.ZonedDateTime.from('2024-12-25T00:00:00Z[UTC]');
 * const end = Temporal.ZonedDateTime.from('2025-01-08T00:00:00Z[UTC]');
 *
 * const weeks = eachWeekOfInterval({ start, end });
 * // [
 * //   2024-12-23T00:00:00Z[UTC],  // Monday of week containing Dec 25
 * //   2024-12-30T00:00:00Z[UTC],  // Monday of week containing Dec 30
 * //   2025-01-06T00:00:00Z[UTC]   // Monday of week containing Jan 8
 * // ]
 * ```
 */
export function eachWeekOfInterval(interval: {
  start: Temporal.Instant | Temporal.ZonedDateTime;
  end: Temporal.Instant | Temporal.ZonedDateTime;
}): Temporal.ZonedDateTime[] {
  const startZoned = normalizeTemporalInput(interval.start);
  const endZoned = normalizeTemporalInput(interval.end);

  const timezone = startZoned.timeZoneId;

  // Get Monday of the starting week
  // dayOfWeek: 1 = Monday, 7 = Sunday (ISO 8601)
  const daysToSubtractStart = startZoned.dayOfWeek - 1;
  const startMonday = startZoned.subtract({ days: daysToSubtractStart }).startOfDay();

  // Get Monday of the ending week
  const endInTimezone = endZoned.withTimeZone(timezone);
  const daysToSubtractEnd = endInTimezone.dayOfWeek - 1;
  const endMonday = endInTimezone.subtract({ days: daysToSubtractEnd }).startOfDay();

  const weeks: Temporal.ZonedDateTime[] = [];
  let current = startMonday;

  while (Temporal.ZonedDateTime.compare(current, endMonday) <= 0) {
    weeks.push(current);
    current = current.add({ weeks: 1 });
  }

  return weeks;
}
