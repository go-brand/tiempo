import type { Temporal } from '@js-temporal/polyfill';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';

/**
 * Adds the specified number of seconds to a datetime.
 *
 * Instant inputs are converted to UTC. For ZonedDateTime inputs, their timezone is preserved.
 *
 * @param input - A Temporal.Instant (UTC) or Temporal.ZonedDateTime
 * @param seconds - Number of seconds to add (can be negative to subtract)
 * @returns ZonedDateTime with seconds added, in the same timezone as input
 *
 * @example
 * ```ts
 * // From Instant (always UTC)
 * const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
 * const result = addSeconds(instant, 45);
 * // 2025-01-20T12:00:45Z[UTC] (45 seconds later)
 * ```
 *
 * @example
 * ```ts
 * // From ZonedDateTime (preserves timezone)
 * const zoned = Temporal.ZonedDateTime.from('2025-01-20T15:30:00-05:00[America/New_York]');
 * const result = addSeconds(zoned, 3600);
 * // 2025-01-20T16:30:00-05:00[America/New_York]
 * ```
 *
 * @example
 * ```ts
 * // Negative values subtract seconds
 * const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
 * const result = addSeconds(instant, -30);
 * // 2025-01-20T11:59:30Z[UTC] (30 seconds earlier)
 * ```
 */
export function addSeconds(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  seconds: number
): Temporal.ZonedDateTime {
  const zonedDateTime = normalizeTemporalInput(input);
  return zonedDateTime.add({ seconds });
}
