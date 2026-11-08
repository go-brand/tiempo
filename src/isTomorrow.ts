import type { Temporal } from './shared/temporal';
import type { Timezone } from './types';
import { isDaysFromToday } from './shared/relativeDay';

/**
 * Returns true if the value falls on tomorrow's date in the given timezone.
 *
 * Instant and ZonedDateTime inputs are converted to the timezone before taking
 * their date. PlainDate inputs are compared to tomorrow's date there directly.
 *
 * @param date - An Instant, ZonedDateTime, or PlainDate
 * @param timezone - The timezone that defines "today"
 * @returns true if date is tomorrow in timezone, false otherwise
 *
 * @example
 * ```ts
 * const delivery = Temporal.Now.instant().add({ hours: 24 });
 * isTomorrow(delivery, 'Asia/Tokyo'); // true
 * ```
 */
export function isTomorrow(
  date: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
  timezone: Timezone
): boolean {
  return isDaysFromToday(date, timezone, 1);
}
