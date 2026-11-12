import type { Temporal } from './shared/temporal';
import { calendarDates } from './shared/calendarDates';

/**
 * Returns the number of calendar months between two dates, ignoring the day of
 * the month. Unlike differenceInMonths, which counts complete months, January 31
 * to February 1 is one calendar month.
 *
 * PlainDate inputs are compared as given. Instant inputs use their UTC date and
 * ZonedDateTime inputs use the date in their own timezone; convert both to one
 * timezone first to count from a single point of view. Mixing a PlainDate with
 * an Instant or ZonedDateTime throws a TypeError.
 *
 * @param laterDate - The later date
 * @param earlierDate - The earlier date
 * @returns Calendar months from earlierDate to laterDate; negative if laterDate is earlier
 *
 * @example
 * ```ts
 * const jan31 = Temporal.PlainDate.from('2025-01-31');
 * const feb1 = Temporal.PlainDate.from('2025-02-01');
 *
 * differenceInCalendarMonths(feb1, jan31); // 1
 * differenceInMonths(feb1, jan31); // 0
 * ```
 */
export function differenceInCalendarMonths(
  laterDate: Temporal.PlainDate,
  earlierDate: Temporal.PlainDate
): number;
export function differenceInCalendarMonths(
  laterDate: Temporal.Instant | Temporal.ZonedDateTime,
  earlierDate: Temporal.Instant | Temporal.ZonedDateTime
): number;
export function differenceInCalendarMonths(
  laterDate: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
  earlierDate: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate
): number {
  const [later, earlier] = calendarDates(laterDate, earlierDate);
  return earlier.with({ day: 1 }).until(later.with({ day: 1 }), { largestUnit: 'months' }).months;
}
