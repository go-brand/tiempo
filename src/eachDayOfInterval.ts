import { Temporal, isPlainDate } from './shared/temporal';
import { differenceInDays } from './differenceInDays';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';

/**
 * Returns each calendar day within the interval, including both endpoints.
 * PlainDate endpoints return PlainDates in the start calendar, without a timezone.
 * Instant/ZonedDateTime endpoints return ZonedDateTimes.
 * Each element represents the first valid moment of the day in the timezone of the interval start.
 * Nonexistent calendar dates are skipped only for timezone-aware intervals.
 * The interval is inclusive of both start and end days.
 *
 * For Instant inputs, UTC is used as the timezone.
 * For ZonedDateTime inputs, the timezone of the start date is preserved.
 *
 * @param interval - Two PlainDates, or two Instant/ZonedDateTime timeline endpoints
 * @returns PlainDates for date-only endpoints; otherwise ZonedDateTimes at each day start. Reversed endpoints return [].
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
  start: Temporal.PlainDate;
  end: Temporal.PlainDate;
}): Temporal.PlainDate[];
export function eachDayOfInterval(interval: {
  start: Temporal.Instant | Temporal.ZonedDateTime;
  end: Temporal.Instant | Temporal.ZonedDateTime;
}): Temporal.ZonedDateTime[];
export function eachDayOfInterval(interval: {
  start: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate;
  end: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate;
}): Temporal.ZonedDateTime[] | Temporal.PlainDate[] {
  if (isPlainDate(interval.start) || isPlainDate(interval.end)) {
    if (!isPlainDate(interval.start) || !isPlainDate(interval.end)) {
      throw new TypeError('PlainDate intervals require two PlainDate endpoints');
    }
    const dayCount = differenceInDays(
      interval.end.withCalendar(interval.start.calendarId),
      interval.start
    );
    const days: Temporal.PlainDate[] = [];
    for (let offset = 0; offset <= dayCount; offset++) {
      days.push(interval.start.add({ days: offset }));
    }
    return days;
  }
  const startZoned = normalizeTemporalInput(interval.start);
  const endZoned = normalizeTemporalInput(interval.end);
  if (startZoned.epochNanoseconds > endZoned.epochNanoseconds) return [];

  const days: Temporal.ZonedDateTime[] = [];
  let current = startZoned.startOfDay();

  // Advancing the resolved date skips nonexistent dates instead of resolving
  // two consecutive PlainDates to the same instant.
  while (current.epochNanoseconds <= endZoned.epochNanoseconds) {
    days.push(current);
    current = current.add({ days: 1 }).startOfDay();
  }

  return days;
}
