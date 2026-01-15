import { Temporal } from '@js-temporal/polyfill';

/**
 * Convert a UTC ISO string or ZonedDateTime to a Temporal.Instant (UTC).
 *
 * @param input - A UTC ISO 8601 string or Temporal.ZonedDateTime
 * @returns A Temporal.Instant representing the same moment in UTC
 *
 * @example
 * ```typescript
 * // From ISO string
 * const instant = toUtc("2025-01-20T20:00:00.000Z");
 *
 * // From ZonedDateTime
 * const zoned = Temporal.ZonedDateTime.from("2025-01-20T15:00:00-05:00[America/New_York]");
 * const instant2 = toUtc(zoned);
 * // Both represent the same UTC moment: 2025-01-20T20:00:00Z
 * ```
 */
export function toUtc(
  input: string | Temporal.ZonedDateTime
): Temporal.Instant {
  if (typeof input === 'string') {
    return Temporal.Instant.from(input);
  }

  return input.toInstant();
}
