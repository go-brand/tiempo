import type { Temporal } from '@js-temporal/polyfill';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';

/**
 * Adds the specified number of microseconds to a datetime.
 *
 * Instant inputs are converted to UTC. For ZonedDateTime inputs, their timezone is preserved.
 *
 * @param input - A Temporal.Instant (UTC) or Temporal.ZonedDateTime
 * @param microseconds - Number of microseconds to add (can be negative to subtract)
 * @returns ZonedDateTime with microseconds added, in the same timezone as input
 *
 * @example
 * ```ts
 * // From Instant (always UTC)
 * const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
 * const result = addMicroseconds(instant, 500);
 * // 2025-01-20T12:00:00.000500Z[UTC] (500 microseconds later)
 * ```
 *
 * @example
 * ```ts
 * // From ZonedDateTime (preserves timezone)
 * const zoned = Temporal.ZonedDateTime.from('2025-01-20T15:30:00-05:00[America/New_York]');
 * const result = addMicroseconds(zoned, 1000);
 * // 2025-01-20T15:30:00.001-05:00[America/New_York]
 * ```
 *
 * @example
 * ```ts
 * // Negative values subtract microseconds
 * const instant = Temporal.Instant.from('2025-01-20T12:00:00.001Z');
 * const result = addMicroseconds(instant, -500);
 * // 2025-01-20T12:00:00.000500Z[UTC] (500 microseconds earlier)
 * ```
 */
export function addMicroseconds(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  microseconds: number
): Temporal.ZonedDateTime {
  const zonedDateTime = normalizeTemporalInput(input);
  return zonedDateTime.add({ microseconds });
}
