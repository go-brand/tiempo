import type { Temporal } from '@js-temporal/polyfill';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';

/**
 * Adds the specified number of days to a datetime.
 *
 * Properly handles DST transitions and calendar edge cases through Temporal API.
 * Instant inputs are converted to UTC. For ZonedDateTime inputs, their timezone is preserved.
 *
 * @param input - A Temporal.Instant (UTC) or Temporal.ZonedDateTime
 * @param days - Number of days to add (can be negative to subtract)
 * @returns ZonedDateTime with days added, in the same timezone as input
 *
 * @example
 * ```ts
 * // From Instant (always UTC)
 * const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
 * const result = addDays(instant, 5);
 * // 2025-01-25T12:00:00Z[UTC] (5 days later)
 * ```
 *
 * @example
 * ```ts
 * // From ZonedDateTime (preserves timezone)
 * const zoned = Temporal.ZonedDateTime.from('2025-01-20T15:30:00-05:00[America/New_York]');
 * const result = addDays(zoned, 10);
 * // 2025-01-30T15:30:00-05:00[America/New_York]
 * ```
 *
 * @example
 * ```ts
 * // Negative values subtract days
 * const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
 * const result = addDays(instant, -7);
 * // 2025-01-13T12:00:00Z[UTC] (7 days earlier)
 * ```
 */
export function addDays(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  days: number
): Temporal.ZonedDateTime {
  const zonedDateTime = normalizeTemporalInput(input);
  return zonedDateTime.add({ days });
}
