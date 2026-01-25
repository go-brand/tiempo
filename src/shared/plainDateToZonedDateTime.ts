import { Temporal } from '@js-temporal/polyfill';
import type { Timezone } from '../types';

/**
 * @internal
 * Converts a PlainDate to a ZonedDateTime at midnight in the specified timezone.
 * This is an internal helper - do not use directly.
 */
export function plainDateToZonedDateTime(
  date: Temporal.PlainDate,
  timezone: Timezone
): Temporal.ZonedDateTime {
  return date.toZonedDateTime({
    timeZone: timezone,
    plainTime: Temporal.PlainTime.from('00:00'),
  });
}
