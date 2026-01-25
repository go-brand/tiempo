import { Temporal } from '@js-temporal/polyfill';

export function isBefore(
  date1: Temporal.ZonedDateTime,
  date2: Temporal.ZonedDateTime
): boolean {
  return Temporal.ZonedDateTime.compare(date1, date2) < 0;
}
