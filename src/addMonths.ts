import type { Temporal } from '@js-temporal/polyfill';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';

/**
 * Adds the specified number of months to a datetime.
 *
 * Properly handles month-end dates and calendar edge cases through Temporal API.
 * Instant inputs are converted to UTC. For ZonedDateTime inputs, their timezone is preserved.
 *
 * @param input - A Temporal.Instant (UTC) or Temporal.ZonedDateTime
 * @param months - Number of months to add (can be negative to subtract)
 * @returns ZonedDateTime with months added, in the same timezone as input
 *
 * @example
 * ```ts
 * // From Instant (always UTC)
 * const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
 * const result = addMonths(instant, 3);
 * // 2025-04-20T12:00:00Z[UTC] (3 months later)
 * ```
 *
 * @example
 * ```ts
 * // From ZonedDateTime (preserves timezone)
 * const zoned = Temporal.ZonedDateTime.from('2025-01-20T15:30:00-05:00[America/New_York]');
 * const result = addMonths(zoned, 6);
 * // 2025-07-20T15:30:00-04:00[America/New_York]
 * ```
 *
 * @example
 * ```ts
 * // Month-end handling
 * const instant = Temporal.Instant.from('2025-01-31T12:00:00Z');
 * const result = addMonths(instant, 1);
 * // 2025-02-28T12:00:00Z[UTC] (Jan 31 → Feb 28)
 * ```
 */
export function addMonths(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  months: number
): Temporal.ZonedDateTime {
  const zonedDateTime = normalizeTemporalInput(input);
  return zonedDateTime.add({ months });
}
