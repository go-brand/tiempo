import { type Temporal, isPlainDate, isPlainTime } from './shared/temporal';
import { assertSameDomain, type Comparable, type Timeline } from './shared/compare';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';

/**
 * Returns the exact `Temporal.Duration` between the start and end of an interval.
 *
 * For timeline values (`Instant` or `ZonedDateTime`), the duration is broken down from
 * years through nanoseconds in `start`'s timezone and calendar (UTC when `start` is an
 * `Instant`). For `PlainDate` values, it returns years, months, and days. For `PlainTime`
 * values, it returns hours through nanoseconds.
 *
 * When `end` is before `start`, the returned `Temporal.Duration` is negative (`sign === -1`).
 * Mixing `PlainDate`, `PlainTime`, and timeline values throws a `TypeError`.
 *
 * @param interval - The interval with `start` and `end` in the same Temporal domain
 * @returns The `Temporal.Duration` from `start` to `end`
 *
 * @example
 * ```ts
 * const start = Temporal.ZonedDateTime.from('2025-01-15T09:00:00+00:00[UTC]');
 * const end = Temporal.ZonedDateTime.from('2026-03-20T11:30:00+00:00[UTC]');
 *
 * const duration = intervalToDuration({ start, end });
 * duration.toString(); // "P1Y2M5DT2H30M"
 * ```
 *
 * @example
 * ```ts
 * // PlainDate interval
 * const duration = intervalToDuration({
 *   start: Temporal.PlainDate.from('2025-01-15'),
 *   end: Temporal.PlainDate.from('2025-04-20')
 * });
 * duration.toString(); // "P3M5D"
 * ```
 *
 * @example
 * ```ts
 * // PlainTime interval
 * const duration = intervalToDuration({
 *   start: Temporal.PlainTime.from('09:15'),
 *   end: Temporal.PlainTime.from('17:45')
 * });
 * duration.toString(); // "PT8H30M"
 * ```
 */
export function intervalToDuration(interval: {
  start: Temporal.PlainDate;
  end: Temporal.PlainDate;
}): Temporal.Duration;
/**
 * Returns the `Temporal.Duration` between two PlainTimes, broken down from hours through
 * nanoseconds.
 */
export function intervalToDuration(interval: {
  start: Temporal.PlainTime;
  end: Temporal.PlainTime;
}): Temporal.Duration;
/**
 * Returns the `Temporal.Duration` between two Instants or ZonedDateTimes in the start's
 * timezone and calendar (UTC when `start` is an Instant).
 */
export function intervalToDuration(interval: {
  start: Temporal.Instant | Temporal.ZonedDateTime;
  end: Temporal.Instant | Temporal.ZonedDateTime;
}): Temporal.Duration;
export function intervalToDuration(interval: {
  start: Comparable;
  end: Comparable;
}): Temporal.Duration {
  const { start, end } = interval;
  assertSameDomain(start, end);

  if (isPlainDate(start)) {
    return start.until((end as Temporal.PlainDate).toString(), { largestUnit: 'years' });
  }
  if (isPlainTime(start)) {
    return start.until((end as Temporal.PlainTime).toString(), { largestUnit: 'hours' });
  }

  const startZoned = normalizeTemporalInput(start as Timeline);
  const endZoned = normalizeTemporalInput(end as Timeline)
    .withTimeZone(startZoned.timeZoneId)
    .withCalendar(startZoned.calendarId);
  return startZoned.until(endZoned.toString(), { largestUnit: 'years' });
}
