import type { Temporal } from '@js-temporal/polyfill';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';

/**
 * Adds the specified number of milliseconds to a datetime.
 *
 * Instant inputs are converted to UTC. For ZonedDateTime inputs, their timezone is preserved.
 *
 * @param input - A Temporal.Instant (UTC) or Temporal.ZonedDateTime
 * @param milliseconds - Number of milliseconds to add (can be negative to subtract)
 * @returns ZonedDateTime with milliseconds added, in the same timezone as input
 *
 * @example
 * ```ts
 * // From Instant (always UTC)
 * const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
 * const result = addMilliseconds(instant, 500);
 * // 2025-01-20T12:00:00.500Z[UTC] (500 milliseconds later)
 * ```
 *
 * @example
 * ```ts
 * // From ZonedDateTime (preserves timezone)
 * const zoned = Temporal.ZonedDateTime.from('2025-01-20T15:30:00-05:00[America/New_York]');
 * const result = addMilliseconds(zoned, 1500);
 * // 2025-01-20T15:30:01.500-05:00[America/New_York]
 * ```
 *
 * @example
 * ```ts
 * // Negative values subtract milliseconds
 * const instant = Temporal.Instant.from('2025-01-20T12:00:00.500Z');
 * const result = addMilliseconds(instant, -250);
 * // 2025-01-20T12:00:00.250Z[UTC] (250 milliseconds earlier)
 * ```
 */
export function addMilliseconds(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  milliseconds: number
): Temporal.ZonedDateTime {
  const zonedDateTime = normalizeTemporalInput(input);
  return zonedDateTime.add({ milliseconds });
}
