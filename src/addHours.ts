import type { Temporal } from '@js-temporal/polyfill';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';

/**
 * Adds the specified number of hours to a datetime.
 *
 * Properly handles DST transitions through Temporal API.
 * Instant inputs are converted to UTC. For ZonedDateTime inputs, their timezone is preserved.
 *
 * @param input - A Temporal.Instant (UTC) or Temporal.ZonedDateTime
 * @param hours - Number of hours to add (can be negative to subtract)
 * @returns ZonedDateTime with hours added, in the same timezone as input
 *
 * @example
 * ```ts
 * // From Instant (always UTC)
 * const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
 * const result = addHours(instant, 3);
 * // 2025-01-20T15:00:00Z[UTC] (3 hours later)
 * ```
 *
 * @example
 * ```ts
 * // From ZonedDateTime (preserves timezone)
 * const zoned = Temporal.ZonedDateTime.from('2025-01-20T15:30:00-05:00[America/New_York]');
 * const result = addHours(zoned, 24);
 * // 2025-01-21T15:30:00-05:00[America/New_York]
 * ```
 *
 * @example
 * ```ts
 * // Negative values subtract hours
 * const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
 * const result = addHours(instant, -5);
 * // 2025-01-20T07:00:00Z[UTC] (5 hours earlier)
 * ```
 */
export function addHours(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  hours: number
): Temporal.ZonedDateTime {
  const zonedDateTime = normalizeTemporalInput(input);
  return zonedDateTime.add({ hours });
}
