import { Temporal } from '@js-temporal/polyfill';

/**
 * Convert a UTC ISO string to a ZonedDateTime in the given timezone.
 *
 * @param isoString - A UTC ISO 8601 string (e.g., "2025-01-20T20:00:00.000Z")
 * @param timezone - An IANA timezone identifier (e.g., "America/New_York", "Europe/London")
 * @returns A Temporal.ZonedDateTime representing the same instant in the specified timezone
 *
 * @example
 * ```typescript
 * // Backend sends: "2025-01-20T20:00:00.000Z"
 * const zoned = utcToZonedTime("2025-01-20T20:00:00.000Z", "America/New_York");
 * // zoned.hour === 15 (3 PM in New York)
 * // zoned.toString() === "2025-01-20T15:00:00-05:00[America/New_York]"
 * ```
 */
export function utcToZonedTime(
  isoString: string,
  timezone: string
): Temporal.ZonedDateTime {
  return Temporal.Instant.from(isoString).toZonedDateTimeISO(timezone);
}

/**
 * Convert a ZonedDateTime to a UTC ISO string.
 *
 * @param zonedDateTime - A Temporal.ZonedDateTime instance
 * @returns A UTC ISO 8601 string representation of the instant
 *
 * @example
 * ```typescript
 * const zoned = Temporal.ZonedDateTime.from("2025-01-20T15:00:00-05:00[America/New_York]");
 * const utc = zonedTimeToUtc(zoned);
 * // utc === "2025-01-20T20:00:00Z"
 * ```
 */
export function zonedTimeToUtc(zonedDateTime: Temporal.ZonedDateTime): string {
  return zonedDateTime.toInstant().toString();
}
