import type { Temporal } from './shared/temporal';
import { calendarDates } from './shared/calendarDates';

/**
 * Returns the number of calendar years between two dates, ignoring the month and
 * day. Unlike differenceInYears, which counts complete years, December 31 to
 * January 1 is one calendar year.
 *
 * PlainDate inputs are compared as given. Instant inputs use their UTC date and
 * ZonedDateTime inputs use the date in their own timezone; convert both to one
 * timezone first to count from a single point of view. Mixing a PlainDate with
 * an Instant or ZonedDateTime throws a TypeError.
 *
 * @param laterDate - The later date
 * @param earlierDate - The earlier date
 * @returns Calendar years from earlierDate to laterDate; negative if laterDate is earlier
 *
 * @example
 * ```ts
 * const newYearsEve = Temporal.PlainDate.from('2024-12-31');
 * const newYearsDay = Temporal.PlainDate.from('2025-01-01');
 *
 * differenceInCalendarYears(newYearsDay, newYearsEve); // 1
 * differenceInYears(newYearsDay, newYearsEve); // 0
 * ```
 */
export function differenceInCalendarYears(
  laterDate: Temporal.PlainDate,
  earlierDate: Temporal.PlainDate
): number;
export function differenceInCalendarYears(
  laterDate: Temporal.Instant | Temporal.ZonedDateTime,
  earlierDate: Temporal.Instant | Temporal.ZonedDateTime
): number;
export function differenceInCalendarYears(
  laterDate: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
  earlierDate: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate
): number {
  const [later, earlier] = calendarDates(laterDate, earlierDate);
  return later.year - earlier.year;
}
