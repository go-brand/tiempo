import { Temporal, isPlainDate } from './shared/temporal';
import { isWeekendDay, isoDate, weekdayHolidays } from './shared/businessDays';

/**
 * Returns the number of business days (Monday–Friday) from earlierDate up to
 * laterDate: the earlier date counts, the later date does not. Dates in
 * `holidays` are not counted. Swapping the arguments negates the result.
 *
 * Only calendar dates matter; times of day are ignored. Instant inputs use
 * their UTC date and ZonedDateTime inputs use their own timezone's date.
 * Convert both to one timezone first to count from a single perspective.
 *
 * @param laterDate - The later date
 * @param earlierDate - The earlier date
 * @param holidays - Dates that are not business days, matched by date
 * @returns Business days between the dates (negative if laterDate is earlier)
 *
 * @example
 * ```ts
 * const friday = Temporal.PlainDate.from('2025-01-24');
 * const nextFriday = Temporal.PlainDate.from('2025-01-31');
 *
 * differenceInBusinessDays(nextFriday, friday); // 5
 * differenceInBusinessDays(friday, nextFriday); // -5
 * differenceInBusinessDays(nextFriday, friday, [Temporal.PlainDate.from('2025-01-27')]); // 4
 * ```
 */
export function differenceInBusinessDays(
  laterDate: Temporal.PlainDate,
  earlierDate: Temporal.PlainDate,
  holidays?: readonly Temporal.PlainDate[]
): number;
export function differenceInBusinessDays(
  laterDate: Temporal.Instant | Temporal.ZonedDateTime,
  earlierDate: Temporal.Instant | Temporal.ZonedDateTime,
  holidays?: readonly Temporal.PlainDate[]
): number;
export function differenceInBusinessDays(
  laterDate: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
  earlierDate: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
  holidays: readonly Temporal.PlainDate[] = []
): number {
  if (isPlainDate(laterDate) !== isPlainDate(earlierDate)) {
    throw new TypeError('PlainDate differences require two PlainDate values');
  }
  const later = isoDate(laterDate);
  const earlier = isoDate(earlierDate);
  const days = earlier.until(later, { largestUnit: 'days' }).days;
  const [from, span] = days < 0 ? [later, -days] : [earlier, days];

  // Every full week holds five business days; walk the remainder.
  const fullWeeks = Math.trunc(span / 7);
  let count = fullWeeks * 5;
  for (let day = from.add({ days: fullWeeks * 7 }), i = fullWeeks * 7; i < span; i++) {
    if (!isWeekendDay(day.dayOfWeek)) count++;
    day = day.add({ days: 1 });
  }
  const end = from.add({ days: span });
  count -= weekdayHolidays(holidays).filter(
    (date) =>
      Temporal.PlainDate.compare(date, from) >= 0 && Temporal.PlainDate.compare(date, end) < 0
  ).length;
  return days < 0 && count !== 0 ? -count : count;
}
