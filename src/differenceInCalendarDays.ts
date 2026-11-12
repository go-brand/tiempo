import type { Temporal } from './shared/temporal';
import { calendarDates } from './shared/calendarDates';

/**
 * Returns the number of calendar days between two dates, ignoring the time of day.
 * Unlike differenceInDays, which counts complete 24-hour days, 23:00 to 01:00
 * the next morning is one calendar day.
 *
 * PlainDate inputs are compared as given. Instant inputs use their UTC date and
 * ZonedDateTime inputs use the date in their own timezone; convert both to one
 * timezone first to count from a single point of view. Mixing a PlainDate with
 * an Instant or ZonedDateTime throws a TypeError.
 *
 * @param laterDate - The later date
 * @param earlierDate - The earlier date
 * @returns Calendar days from earlierDate to laterDate; negative if laterDate is earlier
 *
 * @example
 * ```ts
 * const lateTonight = Temporal.ZonedDateTime.from('2025-01-20T23:00:00+01:00[Europe/Madrid]');
 * const earlyTomorrow = Temporal.ZonedDateTime.from('2025-01-21T01:00:00+01:00[Europe/Madrid]');
 *
 * differenceInCalendarDays(earlyTomorrow, lateTonight); // 1
 * differenceInDays(earlyTomorrow, lateTonight); // 0
 * ```
 *
 * @example
 * ```ts
 * const due = Temporal.PlainDate.from('2025-03-01');
 * const today = Temporal.PlainDate.from('2025-02-26');
 *
 * differenceInCalendarDays(due, today); // 3
 * ```
 */
export function differenceInCalendarDays(
  laterDate: Temporal.PlainDate,
  earlierDate: Temporal.PlainDate
): number;
export function differenceInCalendarDays(
  laterDate: Temporal.Instant | Temporal.ZonedDateTime,
  earlierDate: Temporal.Instant | Temporal.ZonedDateTime
): number;
export function differenceInCalendarDays(
  laterDate: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
  earlierDate: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate
): number {
  const [later, earlier] = calendarDates(laterDate, earlierDate);
  return earlier.until(later, { largestUnit: 'days' }).days;
}
