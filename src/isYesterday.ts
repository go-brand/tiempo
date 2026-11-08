import type { Temporal } from './shared/temporal';
import type { Timezone } from './types';
import { isDaysFromToday } from './shared/relativeDay';

/**
 * Returns true if the value falls on yesterday's date in the given timezone.
 *
 * Instant and ZonedDateTime inputs are converted to the timezone before taking
 * their date. PlainDate inputs are compared to yesterday's date there directly.
 *
 * @param date - An Instant, ZonedDateTime, or PlainDate
 * @param timezone - The timezone that defines "today"
 * @returns true if date is yesterday in timezone, false otherwise
 *
 * @example
 * ```ts
 * const lastLogin = Temporal.Now.instant().subtract({ hours: 24 });
 * isYesterday(lastLogin, 'UTC'); // true
 * ```
 */
export function isYesterday(
  date: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
  timezone: Timezone
): boolean {
  return isDaysFromToday(date, timezone, -1);
}
