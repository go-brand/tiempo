import type { Temporal } from './shared/temporal';
import { calendarDates } from './shared/calendarDates';
import { quarterOfMonth } from './shared/quarter';

/**
 * Returns the number of calendar quarters between two dates, ignoring the
 * position within the quarter. Quarters follow ISO months: Q1 is January–March.
 *
 * PlainDate inputs are compared as given. Instant inputs use their UTC date and
 * ZonedDateTime inputs use the date in their own timezone; convert both to one
 * timezone first to count from a single point of view. Mixing a PlainDate with
 * an Instant or ZonedDateTime throws a TypeError.
 *
 * @param laterDate - The later date
 * @param earlierDate - The earlier date
 * @returns Calendar quarters from earlierDate to laterDate; negative if laterDate is earlier
 *
 * @example
 * ```ts
 * const endOfQ1 = Temporal.PlainDate.from('2025-03-31');
 * const startOfQ2 = Temporal.PlainDate.from('2025-04-01');
 *
 * differenceInCalendarQuarters(startOfQ2, endOfQ1); // 1
 * differenceInQuarters(startOfQ2, endOfQ1); // 0
 * ```
 */
export function differenceInCalendarQuarters(
  laterDate: Temporal.PlainDate,
  earlierDate: Temporal.PlainDate
): number;
export function differenceInCalendarQuarters(
  laterDate: Temporal.Instant | Temporal.ZonedDateTime,
  earlierDate: Temporal.Instant | Temporal.ZonedDateTime
): number;
export function differenceInCalendarQuarters(
  laterDate: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
  earlierDate: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate
): number {
  const [later, earlier] = calendarDates(laterDate, earlierDate).map((date) =>
    date.withCalendar('iso8601')
  ) as [Temporal.PlainDate, Temporal.PlainDate];
  return (
    (later.year - earlier.year) * 4 + quarterOfMonth(later.month) - quarterOfMonth(earlier.month)
  );
}
