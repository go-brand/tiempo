import type { Temporal } from "./shared/temporal";
import type { Timezone } from "./types";
import { isDaysFromToday } from "./shared/relativeDay";

/**
 * Returns true if the value falls on today's date in the given timezone.
 *
 * "Today" depends on where you are, so the timezone is required. Instant and
 * ZonedDateTime inputs are converted to that timezone before taking their
 * date. PlainDate inputs are compared to today's date there directly.
 *
 * @param date - An Instant, ZonedDateTime, or PlainDate
 * @param timezone - The timezone that defines "today"
 * @returns true if date is today in timezone, false otherwise
 *
 * @example
 * ```ts
 * isToday(Temporal.Now.instant(), 'America/New_York'); // true
 * isToday(event.start, user.timezone); // label "Today" in the user's calendar
 * ```
 */
export function isToday(
  date: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
  timezone: Timezone,
): boolean {
  return isDaysFromToday(date, timezone, 0);
}
