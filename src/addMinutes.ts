import type { Temporal } from '@js-temporal/polyfill';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';

/**
 * Adds the specified number of minutes to a datetime.
 *
 * Instant inputs are converted to UTC. For ZonedDateTime inputs, their timezone is preserved.
 *
 * @param input - A Temporal.Instant (UTC) or Temporal.ZonedDateTime
 * @param minutes - Number of minutes to add (can be negative to subtract)
 * @returns ZonedDateTime with minutes added, in the same timezone as input
 *
 * @example
 * ```ts
 * // From Instant (always UTC)
 * const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
 * const result = addMinutes(instant, 30);
 * // 2025-01-20T12:30:00Z[UTC] (30 minutes later)
 * ```
 *
 * @example
 * ```ts
 * // From ZonedDateTime (preserves timezone)
 * const zoned = Temporal.ZonedDateTime.from('2025-01-20T15:30:00-05:00[America/New_York]');
 * const result = addMinutes(zoned, 90);
 * // 2025-01-20T17:00:00-05:00[America/New_York]
 * ```
 *
 * @example
 * ```ts
 * // Negative values subtract minutes
 * const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
 * const result = addMinutes(instant, -15);
 * // 2025-01-20T11:45:00Z[UTC] (15 minutes earlier)
 * ```
 */
export function addMinutes(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  minutes: number
): Temporal.ZonedDateTime {
  const zonedDateTime = normalizeTemporalInput(input);
  return zonedDateTime.add({ minutes });
}
