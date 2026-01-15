import { Temporal } from '@js-temporal/polyfill';

/**
 * Convert a Temporal.Instant or ZonedDateTime to a UTC ISO 8601 string.
 *
 * @param input - A Temporal.Instant or Temporal.ZonedDateTime
 * @returns A UTC ISO 8601 string representation
 *
 * @example
 * ```typescript
 * // From ZonedDateTime
 * const zoned = Temporal.ZonedDateTime.from("2025-01-20T15:00:00-05:00[America/New_York]");
 * const iso = toIso8601(zoned);
 * // iso === "2025-01-20T20:00:00Z"
 *
 * // From Instant
 * const instant = Temporal.Instant.from("2025-01-20T20:00:00Z");
 * const iso2 = toIso8601(instant);
 * // iso2 === "2025-01-20T20:00:00Z"
 * ```
 */
export function toIso8601(
  input: Temporal.Instant | Temporal.ZonedDateTime
): string {
  if (input instanceof Temporal.Instant) {
    return input.toString();
  }

  return input.toInstant().toString();
}
