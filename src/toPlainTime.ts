import { Temporal } from '@js-temporal/polyfill';
import type { Timezone } from './types';

/**
 * Extract the wall-clock time from a ZonedDateTime or convert an input to a timezone and extract the time.
 *
 * @param input - A Temporal.ZonedDateTime (timezone optional) or a UTC ISO string, Date, Instant, or ZonedDateTime (timezone required)
 * @param timezone - IANA timezone identifier. Required unless input is a ZonedDateTime.
 * @returns A Temporal.PlainTime representing the wall-clock time
 *
 * @example
 * ```typescript
 * import { toPlainTime, toZonedTime } from '@gobrand/tiempo';
 *
 * // From ZonedDateTime (no timezone needed)
 * const zdt = toZonedTime("2025-01-20T15:30:00Z", "America/New_York");
 * const time = toPlainTime(zdt); // 10:30
 *
 * // From UTC string with timezone
 * const time2 = toPlainTime("2025-01-20T15:30:00Z", "America/New_York"); // 10:30
 *
 * // From Date with timezone
 * const date = new Date("2025-01-20T15:30:00.000Z");
 * const time3 = toPlainTime(date, "Europe/London"); // 15:30
 *
 * // From Instant with timezone
 * const instant = Temporal.Instant.from("2025-01-20T15:30:00Z");
 * const time4 = toPlainTime(instant, "Asia/Tokyo"); // 00:30
 * ```
 */
export function toPlainTime(input: Temporal.ZonedDateTime): Temporal.PlainTime;
export function toPlainTime(
  input: string | Date | Temporal.Instant | Temporal.ZonedDateTime,
  timezone: Timezone
): Temporal.PlainTime;
export function toPlainTime(
  input: string | Date | Temporal.Instant | Temporal.ZonedDateTime,
  timezone?: Timezone
): Temporal.PlainTime {
  if (input instanceof Temporal.ZonedDateTime && timezone === undefined) {
    return input.toPlainTime();
  }

  if (timezone === undefined) {
    throw new Error('Timezone is required unless input is a ZonedDateTime');
  }

  if (typeof input === 'string') {
    return Temporal.Instant.from(input).toZonedDateTimeISO(timezone).toPlainTime();
  }

  if (input instanceof Date) {
    return Temporal.Instant.from(input.toISOString()).toZonedDateTimeISO(timezone).toPlainTime();
  }

  if (input instanceof Temporal.Instant) {
    return input.toZonedDateTimeISO(timezone).toPlainTime();
  }

  return input.toInstant().toZonedDateTimeISO(timezone).toPlainTime();
}
