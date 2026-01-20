import type { Temporal } from '@js-temporal/polyfill';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';

/**
 * Adds the specified number of years to a datetime.
 *
 * Properly handles leap years and calendar edge cases through Temporal API.
 * Instant inputs are converted to UTC. For ZonedDateTime inputs, their timezone is preserved.
 *
 * @param input - A Temporal.Instant (UTC) or Temporal.ZonedDateTime
 * @param years - Number of years to add (can be negative to subtract)
 * @returns ZonedDateTime with years added, in the same timezone as input
 *
 * @example
 * ```ts
 * // From Instant (always UTC)
 * const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
 * const result = addYears(instant, 2);
 * // 2027-01-20T12:00:00Z[UTC] (2 years later)
 * ```
 *
 * @example
 * ```ts
 * // From ZonedDateTime (preserves timezone)
 * const zoned = Temporal.ZonedDateTime.from('2025-01-20T15:30:00-05:00[America/New_York]');
 * const result = addYears(zoned, 1);
 * // 2026-01-20T15:30:00-05:00[America/New_York]
 * ```
 *
 * @example
 * ```ts
 * // Leap year handling
 * const instant = Temporal.Instant.from('2024-02-29T12:00:00Z');
 * const result = addYears(instant, 1);
 * // 2025-02-28T12:00:00Z[UTC] (Feb 29 → Feb 28)
 * ```
 */
export function addYears(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  years: number
): Temporal.ZonedDateTime {
  const zonedDateTime = normalizeTemporalInput(input);
  return zonedDateTime.add({ years });
}
