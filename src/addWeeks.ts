import type { Temporal } from '@js-temporal/polyfill';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';

/**
 * Adds the specified number of weeks to a datetime.
 *
 * Properly handles DST transitions and calendar edge cases through Temporal API.
 * Instant inputs are converted to UTC. For ZonedDateTime inputs, their timezone is preserved.
 *
 * @param input - A Temporal.Instant (UTC) or Temporal.ZonedDateTime
 * @param weeks - Number of weeks to add (can be negative to subtract)
 * @returns ZonedDateTime with weeks added, in the same timezone as input
 *
 * @example
 * ```ts
 * // From Instant (always UTC)
 * const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
 * const result = addWeeks(instant, 2);
 * // 2025-02-03T12:00:00Z[UTC] (2 weeks later)
 * ```
 *
 * @example
 * ```ts
 * // From ZonedDateTime (preserves timezone)
 * const zoned = Temporal.ZonedDateTime.from('2025-01-20T15:30:00-05:00[America/New_York]');
 * const result = addWeeks(zoned, 2);
 * // 2025-02-03T15:30:00-05:00[America/New_York]
 * ```
 *
 * @example
 * ```ts
 * // Negative values subtract weeks
 * const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
 * const result = addWeeks(instant, -1);
 * // 2025-01-13T12:00:00Z[UTC] (1 week earlier)
 * ```
 */
export function addWeeks(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  weeks: number
): Temporal.ZonedDateTime {
  const zonedDateTime = normalizeTemporalInput(input);
  return zonedDateTime.add({ weeks });
}
