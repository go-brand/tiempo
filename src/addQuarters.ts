import type { Temporal } from "@js-temporal/polyfill";
import { normalizeTemporalInput } from "./shared/normalizeTemporalInput";

/**
 * Adds the specified number of quarters (3-month blocks) to a datetime.
 *
 * Properly handles month-end dates and calendar edge cases through Temporal API.
 * Instant inputs are converted to UTC. For ZonedDateTime inputs, their timezone is preserved.
 *
 * @param input - A Temporal.Instant (UTC) or Temporal.ZonedDateTime
 * @param quarters - Number of quarters to add (can be negative to subtract)
 * @returns ZonedDateTime with quarters added, in the same timezone as input
 *
 * @example
 * ```ts
 * // From Instant (always UTC)
 * const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
 * const result = addQuarters(instant, 2);
 * // 2025-07-20T12:00:00Z[UTC] (6 months later)
 * ```
 *
 * @example
 * ```ts
 * // From ZonedDateTime (preserves timezone)
 * const zoned = Temporal.ZonedDateTime.from('2025-01-20T15:30:00-05:00[America/New_York]');
 * const result = addQuarters(zoned, 1);
 * // 2025-04-20T15:30:00-04:00[America/New_York]
 * ```
 */
export function addQuarters(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  quarters: number,
): Temporal.ZonedDateTime {
  const zonedDateTime = normalizeTemporalInput(input);
  return zonedDateTime.add({ months: quarters * 3 });
}
