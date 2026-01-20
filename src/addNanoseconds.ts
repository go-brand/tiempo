import type { Temporal } from '@js-temporal/polyfill';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';

/**
 * Adds the specified number of nanoseconds to a datetime.
 *
 * Instant inputs are converted to UTC. For ZonedDateTime inputs, their timezone is preserved.
 *
 * @param input - A Temporal.Instant (UTC) or Temporal.ZonedDateTime
 * @param nanoseconds - Number of nanoseconds to add (can be negative to subtract)
 * @returns ZonedDateTime with nanoseconds added, in the same timezone as input
 *
 * @example
 * ```ts
 * // From Instant (always UTC)
 * const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
 * const result = addNanoseconds(instant, 500);
 * // 2025-01-20T12:00:00.000000500Z[UTC] (500 nanoseconds later)
 * ```
 *
 * @example
 * ```ts
 * // From ZonedDateTime (preserves timezone)
 * const zoned = Temporal.ZonedDateTime.from('2025-01-20T15:30:00-05:00[America/New_York]');
 * const result = addNanoseconds(zoned, 1000);
 * // 2025-01-20T15:30:00.000001-05:00[America/New_York]
 * ```
 *
 * @example
 * ```ts
 * // Negative values subtract nanoseconds
 * const instant = Temporal.Instant.from('2025-01-20T12:00:00.000001Z');
 * const result = addNanoseconds(instant, -500);
 * // 2025-01-20T12:00:00.000000500Z[UTC] (500 nanoseconds earlier)
 * ```
 */
export function addNanoseconds(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  nanoseconds: number
): Temporal.ZonedDateTime {
  const zonedDateTime = normalizeTemporalInput(input);
  return zonedDateTime.add({ nanoseconds });
}
