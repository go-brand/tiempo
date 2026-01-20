import { Temporal } from '@js-temporal/polyfill';

/**
 * Convert a UTC ISO string, Date, or ZonedDateTime to a Temporal.Instant (UTC).
 *
 * @param input - A UTC ISO 8601 string, Date object, or Temporal.ZonedDateTime
 * @returns A Temporal.Instant representing the same moment in UTC
 *
 * @example
 * ```typescript
 * // From ISO string
 * const instant = toUtc("2025-01-20T20:00:00.000Z");
 *
 * // From Date (e.g., from Drizzle ORM)
 * const date = new Date("2025-01-20T20:00:00.000Z");
 * const instant2 = toUtc(date);
 *
 * // From ZonedDateTime
 * const zoned = Temporal.ZonedDateTime.from("2025-01-20T15:00:00-05:00[America/New_York]");
 * const instant3 = toUtc(zoned);
 * // All represent the same UTC moment: 2025-01-20T20:00:00Z
 * ```
 */
export function toUtc(
  input: string | Date | Temporal.ZonedDateTime
): Temporal.Instant {
  if (typeof input === 'string') {
    return Temporal.Instant.from(input);
  }

  if (input instanceof Date) {
    return Temporal.Instant.from(input.toISOString());
  }

  return input.toInstant();
}
