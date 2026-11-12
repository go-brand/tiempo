import type { Temporal } from './shared/temporal';
import { calendarDates } from './shared/calendarDates';
import { daysIntoWeek, type WeekOptions } from './shared/week';

/**
 * Returns the number of week boundaries crossed between two dates, ignoring the
 * day within the week. Weeks start on Monday (ISO 8601) unless `weekStartsOn`
 * says otherwise.
 *
 * PlainDate inputs are compared as given. Instant inputs use their UTC date and
 * ZonedDateTime inputs use the date in their own timezone; convert both to one
 * timezone first to count from a single point of view. Mixing a PlainDate with
 * an Instant or ZonedDateTime throws a TypeError.
 *
 * @param laterDate - The later date
 * @param earlierDate - The earlier date
 * @param options - `weekStartsOn`: 1 = Monday (default) … 7 = Sunday
 * @returns Calendar weeks from earlierDate to laterDate; negative if laterDate is earlier
 *
 * @example
 * ```ts
 * const sunday = Temporal.PlainDate.from('2025-01-26');
 * const monday = Temporal.PlainDate.from('2025-01-27');
 *
 * differenceInCalendarWeeks(monday, sunday); // 1
 * differenceInCalendarWeeks(monday, sunday, { weekStartsOn: 7 }); // 0
 * ```
 */
export function differenceInCalendarWeeks(
  laterDate: Temporal.PlainDate,
  earlierDate: Temporal.PlainDate,
  options?: WeekOptions
): number;
export function differenceInCalendarWeeks(
  laterDate: Temporal.Instant | Temporal.ZonedDateTime,
  earlierDate: Temporal.Instant | Temporal.ZonedDateTime,
  options?: WeekOptions
): number;
export function differenceInCalendarWeeks(
  laterDate: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
  earlierDate: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
  options?: WeekOptions
): number {
  const [later, earlier] = calendarDates(laterDate, earlierDate);
  const laterStart = later.subtract({ days: daysIntoWeek(later.dayOfWeek, options) });
  const earlierStart = earlier.subtract({ days: daysIntoWeek(earlier.dayOfWeek, options) });
  return earlierStart.until(laterStart, { largestUnit: 'days' }).days / 7;
}
