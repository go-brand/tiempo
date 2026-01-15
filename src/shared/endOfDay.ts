import type { Temporal } from '@js-temporal/polyfill';

/**
 * Internal helper: Returns the last nanosecond of a given ZonedDateTime's day.
 * Used by endOfDay() and endOfWeek() to ensure consistent DST-safe behavior.
 */
export function getEndOfDay(
  zonedDateTime: Temporal.ZonedDateTime
): Temporal.ZonedDateTime {
  return zonedDateTime
    .startOfDay()
    .add({ days: 1 })
    .subtract({ nanoseconds: 1 });
}
