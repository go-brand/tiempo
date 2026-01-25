import { Temporal } from '@js-temporal/polyfill';
import type { Timezone } from './types';

// Pattern to detect plain date strings: YYYY-MM-DD
const PLAIN_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Parse a plain date or extract the calendar date from a datetime.
 *
 * @param input - A PlainDateLike object, plain date string (YYYY-MM-DD), ZonedDateTime, or datetime input requiring timezone
 * @param timezone - IANA timezone identifier. Required for ISO strings, Date, and Instant inputs.
 * @returns A Temporal.PlainDate representing the calendar date
 *
 * @example
 * ```typescript
 * import { toPlainDate, toZonedTime } from '@gobrand/tiempo';
 *
 * // From PlainDateLike object (no timezone needed)
 * const date = toPlainDate({ year: 2025, month: 1, day: 20 }); // 2025-01-20
 *
 * // From plain date string (no timezone needed)
 * const date2 = toPlainDate("2025-01-20"); // 2025-01-20
 *
 * // From ZonedDateTime (no timezone needed)
 * const zdt = toZonedTime("2025-01-20T15:30:00Z", "America/New_York");
 * const date3 = toPlainDate(zdt); // 2025-01-20
 *
 * // From UTC string with timezone
 * const date4 = toPlainDate("2025-01-20T15:30:00Z", "America/New_York"); // 2025-01-20
 *
 * // From Date with timezone
 * const jsDate = new Date("2025-01-20T15:30:00.000Z");
 * const date5 = toPlainDate(jsDate, "Europe/London"); // 2025-01-20
 *
 * // Date boundary crossing: 23:00 UTC on Jan 20 → Jan 21 in Tokyo
 * const date6 = toPlainDate("2025-01-20T23:00:00Z", "Asia/Tokyo"); // 2025-01-21
 * ```
 */
export function toPlainDate(input: Temporal.ZonedDateTime): Temporal.PlainDate;
export function toPlainDate(
  input: string | Date | Temporal.Instant | Temporal.ZonedDateTime,
  timezone: Timezone
): Temporal.PlainDate;
export function toPlainDate(input: Temporal.PlainDateLike | string): Temporal.PlainDate;
export function toPlainDate(
  input: string | Date | Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDateLike,
  timezone?: Timezone
): Temporal.PlainDate {
  // ZonedDateTime without timezone override
  if (input instanceof Temporal.ZonedDateTime && timezone === undefined) {
    return input.toPlainDate();
  }

  // Date requires timezone
  if (input instanceof Date) {
    if (timezone === undefined) {
      throw new Error('Timezone is required unless input is a ZonedDateTime, PlainDateLike, or plain date string');
    }
    return Temporal.Instant.from(input.toISOString()).toZonedDateTimeISO(timezone).toPlainDate();
  }

  // Instant requires timezone
  if (input instanceof Temporal.Instant) {
    if (timezone === undefined) {
      throw new Error('Timezone is required unless input is a ZonedDateTime, PlainDateLike, or plain date string');
    }
    return input.toZonedDateTimeISO(timezone).toPlainDate();
  }

  // ZonedDateTime with timezone override
  if (input instanceof Temporal.ZonedDateTime) {
    if (timezone === undefined) {
      throw new Error('Timezone is required unless input is a ZonedDateTime, PlainDateLike, or plain date string');
    }
    return input.toInstant().toZonedDateTimeISO(timezone).toPlainDate();
  }

  // String: ISO datetime (requires timezone) or plain date (no timezone)
  if (typeof input === 'string') {
    if (timezone !== undefined) {
      return Temporal.Instant.from(input).toZonedDateTimeISO(timezone).toPlainDate();
    }
    if (PLAIN_DATE_PATTERN.test(input)) {
      return Temporal.PlainDate.from(input);
    }
    throw new Error('Timezone is required unless input is a ZonedDateTime, PlainDateLike, or plain date string');
  }

  // PlainDateLike object - pass directly to Temporal.PlainDate.from()
  return Temporal.PlainDate.from(input);
}
