import { Temporal } from '@js-temporal/polyfill';
import type { Timezone } from './types';

/**
 * Extract the calendar date from a ZonedDateTime or convert an input to a timezone and extract the date.
 *
 * @param input - A Temporal.ZonedDateTime (timezone optional) or a UTC ISO string, Date, Instant, or ZonedDateTime (timezone required)
 * @param timezone - IANA timezone identifier. Required unless input is a ZonedDateTime.
 * @returns A Temporal.PlainDate representing the calendar date
 *
 * @example
 * ```typescript
 * import { toPlainDate, toZonedTime } from '@gobrand/tiempo';
 *
 * // From ZonedDateTime (no timezone needed)
 * const zdt = toZonedTime("2025-01-20T15:30:00Z", "America/New_York");
 * const date = toPlainDate(zdt); // 2025-01-20
 *
 * // From UTC string with timezone
 * const date2 = toPlainDate("2025-01-20T15:30:00Z", "America/New_York"); // 2025-01-20
 *
 * // From Date with timezone
 * const jsDate = new Date("2025-01-20T15:30:00.000Z");
 * const date3 = toPlainDate(jsDate, "Europe/London"); // 2025-01-20
 *
 * // Date boundary crossing: 23:00 UTC on Jan 20 → Jan 21 in Tokyo
 * const date4 = toPlainDate("2025-01-20T23:00:00Z", "Asia/Tokyo"); // 2025-01-21
 * ```
 */
export function toPlainDate(input: Temporal.ZonedDateTime): Temporal.PlainDate;
export function toPlainDate(
  input: string | Date | Temporal.Instant | Temporal.ZonedDateTime,
  timezone: Timezone
): Temporal.PlainDate;
export function toPlainDate(
  input: string | Date | Temporal.Instant | Temporal.ZonedDateTime,
  timezone?: Timezone
): Temporal.PlainDate {
  if (input instanceof Temporal.ZonedDateTime && timezone === undefined) {
    return input.toPlainDate();
  }

  if (timezone === undefined) {
    throw new Error('Timezone is required unless input is a ZonedDateTime');
  }

  if (typeof input === 'string') {
    return Temporal.Instant.from(input).toZonedDateTimeISO(timezone).toPlainDate();
  }

  if (input instanceof Date) {
    return Temporal.Instant.from(input.toISOString()).toZonedDateTimeISO(timezone).toPlainDate();
  }

  if (input instanceof Temporal.Instant) {
    return input.toZonedDateTimeISO(timezone).toPlainDate();
  }

  return input.toInstant().toZonedDateTimeISO(timezone).toPlainDate();
}
