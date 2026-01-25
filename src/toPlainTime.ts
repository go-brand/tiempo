import { Temporal } from '@js-temporal/polyfill';
import type { Timezone } from './types';

// Pattern to detect plain time strings: HH:MM, HH:MM:SS, or HH:MM:SS.fractional
const PLAIN_TIME_PATTERN = /^\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/;

/**
 * Parse a plain time or extract the wall-clock time from a datetime.
 *
 * @param input - A PlainTimeLike object, plain time string (HH:MM or HH:MM:SS), ZonedDateTime, or datetime input requiring timezone
 * @param timezone - IANA timezone identifier. Required for ISO strings, Date, and Instant inputs.
 * @returns A Temporal.PlainTime representing the wall-clock time
 *
 * @example
 * ```typescript
 * import { toPlainTime, toZonedTime } from '@gobrand/tiempo';
 *
 * // From PlainTimeLike object (no timezone needed)
 * const time = toPlainTime({ hour: 14, minute: 30 }); // 14:30
 *
 * // From plain time string (no timezone needed)
 * const time2 = toPlainTime("14:30"); // 14:30
 * const timeWithSeconds = toPlainTime("14:30:45"); // 14:30:45
 *
 * // From ZonedDateTime (no timezone needed)
 * const zdt = toZonedTime("2025-01-20T15:30:00Z", "America/New_York");
 * const time3 = toPlainTime(zdt); // 10:30
 *
 * // From UTC string with timezone
 * const time4 = toPlainTime("2025-01-20T15:30:00Z", "America/New_York"); // 10:30
 *
 * // From Date with timezone
 * const date = new Date("2025-01-20T15:30:00.000Z");
 * const time5 = toPlainTime(date, "Europe/London"); // 15:30
 *
 * // From Instant with timezone
 * const instant = Temporal.Instant.from("2025-01-20T15:30:00Z");
 * const time6 = toPlainTime(instant, "Asia/Tokyo"); // 00:30
 * ```
 */
export function toPlainTime(input: Temporal.ZonedDateTime): Temporal.PlainTime;
export function toPlainTime(
  input: string | Date | Temporal.Instant | Temporal.ZonedDateTime,
  timezone: Timezone
): Temporal.PlainTime;
export function toPlainTime(input: Temporal.PlainTimeLike | string): Temporal.PlainTime;
export function toPlainTime(
  input: string | Date | Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainTimeLike,
  timezone?: Timezone
): Temporal.PlainTime {
  // ZonedDateTime without timezone override
  if (input instanceof Temporal.ZonedDateTime && timezone === undefined) {
    return input.toPlainTime();
  }

  // Date requires timezone
  if (input instanceof Date) {
    if (timezone === undefined) {
      throw new Error('Timezone is required unless input is a ZonedDateTime, PlainTimeLike, or plain time string');
    }
    return Temporal.Instant.from(input.toISOString()).toZonedDateTimeISO(timezone).toPlainTime();
  }

  // Instant requires timezone
  if (input instanceof Temporal.Instant) {
    if (timezone === undefined) {
      throw new Error('Timezone is required unless input is a ZonedDateTime, PlainTimeLike, or plain time string');
    }
    return input.toZonedDateTimeISO(timezone).toPlainTime();
  }

  // ZonedDateTime with timezone override
  if (input instanceof Temporal.ZonedDateTime) {
    if (timezone === undefined) {
      throw new Error('Timezone is required unless input is a ZonedDateTime, PlainTimeLike, or plain time string');
    }
    return input.toInstant().toZonedDateTimeISO(timezone).toPlainTime();
  }

  // String: ISO datetime (requires timezone) or plain time (no timezone)
  if (typeof input === 'string') {
    if (timezone !== undefined) {
      return Temporal.Instant.from(input).toZonedDateTimeISO(timezone).toPlainTime();
    }
    if (PLAIN_TIME_PATTERN.test(input)) {
      return Temporal.PlainTime.from(input);
    }
    throw new Error('Timezone is required unless input is a ZonedDateTime, PlainTimeLike, or plain time string');
  }

  // PlainTimeLike object - pass directly to Temporal.PlainTime.from()
  return Temporal.PlainTime.from(input);
}
