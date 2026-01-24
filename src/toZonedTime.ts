import { Temporal } from '@js-temporal/polyfill';
import type { Timezone } from './types';

/**
 * Convert a UTC ISO string, Date, Instant, or ZonedDateTime to a ZonedDateTime in the specified timezone.
 *
 * @param input - A UTC ISO 8601 string, Date object, Temporal.Instant, or Temporal.ZonedDateTime
 * @param timezone - IANA timezone identifier (e.g., "America/New_York", "Europe/London") or "UTC"
 * @returns A Temporal.ZonedDateTime in the specified timezone
 *
 * @example
 * ```typescript
 * import { toZonedTime, browserTimezone } from '@gobrand/tiempo';
 *
 * // Server-side: Convert to UTC
 * const utcTime = toZonedTime("2025-01-20T20:00:00Z", "UTC");
 *
 * // Server-side: Convert to user's timezone (from DB/preferences)
 * const userTime = toZonedTime("2025-01-20T20:00:00Z", user.timezone);
 *
 * // Client-side: Convert to browser's timezone
 * const localTime = toZonedTime("2025-01-20T20:00:00Z", browserTimezone());
 *
 * // From Date (e.g., from Drizzle ORM)
 * const date = new Date("2025-01-20T20:00:00.000Z");
 * const zoned = toZonedTime(date, "America/New_York");
 *
 * // From Instant
 * const instant = Temporal.Instant.from("2025-01-20T20:00:00Z");
 * const zoned = toZonedTime(instant, "Asia/Tokyo");
 *
 * // From ZonedDateTime (convert to different timezone)
 * const nyTime = Temporal.ZonedDateTime.from("2025-01-20T15:00:00-05:00[America/New_York]");
 * const tokyoTime = toZonedTime(nyTime, "Asia/Tokyo");
 * ```
 */
export function toZonedTime(
  input: string | Date | Temporal.Instant | Temporal.ZonedDateTime,
  timezone: Timezone
): Temporal.ZonedDateTime {
  if (typeof input === 'string') {
    return Temporal.Instant.from(input).toZonedDateTimeISO(timezone);
  }

  if (input instanceof Date) {
    return Temporal.Instant.from(input.toISOString()).toZonedDateTimeISO(timezone);
  }

  if (input instanceof Temporal.Instant) {
    return input.toZonedDateTimeISO(timezone);
  }

  return input.toInstant().toZonedDateTimeISO(timezone);
}
