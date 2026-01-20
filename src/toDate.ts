import { Temporal } from '@js-temporal/polyfill';

/**
 * Convert a Temporal.Instant or ZonedDateTime to a Date object.
 *
 * @param input - A Temporal.Instant or Temporal.ZonedDateTime
 * @returns A Date object representing the same moment in time
 *
 * @example
 * ```typescript
 * // From Instant
 * const instant = Temporal.Instant.from("2025-01-20T20:00:00Z");
 * const date = toDate(instant);
 * // date.toISOString() === "2025-01-20T20:00:00.000Z"
 *
 * // From ZonedDateTime
 * const zoned = Temporal.ZonedDateTime.from("2025-01-20T15:00:00-05:00[America/New_York]");
 * const date2 = toDate(zoned);
 * // date2.toISOString() === "2025-01-20T20:00:00.000Z"
 *
 * // Use with Drizzle ORM (for storing back to database)
 * const instant = Temporal.Instant.from("2025-01-20T20:00:00Z");
 * const date = toDate(instant);
 * await db.update(posts).set({ publishedAt: date });
 * ```
 */
export function toDate(
  input: Temporal.Instant | Temporal.ZonedDateTime
): Date {
  if (input instanceof Temporal.Instant) {
    return new Date(input.toString());
  }

  return new Date(input.toInstant().toString());
}
