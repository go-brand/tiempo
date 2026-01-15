import type { Temporal } from '@js-temporal/polyfill';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';

/**
 * Returns a ZonedDateTime representing the first moment of the day (midnight).
 *
 * @param input - A Temporal.Instant (UTC) or Temporal.ZonedDateTime
 * @returns ZonedDateTime at 00:00:00.000000000
 *
 * @example
 * ```ts
 * // From Instant (always UTC)
 * const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
 * const start = startOfDay(instant);
 * // 2025-01-20T00:00:00Z[UTC]
 * ```
 *
 * @example
 * ```ts
 * // From ZonedDateTime (uses its timezone)
 * const zoned = Temporal.ZonedDateTime.from('2025-01-20T15:30:00-05:00[America/New_York]');
 * const start = startOfDay(zoned);
 * // 2025-01-20T00:00:00-05:00[America/New_York]
 * ```
 *
 * @example
 * ```ts
 * // Need a different timezone? Convert first
 * const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
 * const nyTime = instant.toZonedDateTimeISO('America/New_York');
 * const start = startOfDay(nyTime);
 * // 2025-01-20T00:00:00-05:00[America/New_York]
 * ```
 */
export function startOfDay(
  input: Temporal.Instant | Temporal.ZonedDateTime
): Temporal.ZonedDateTime {
  const zonedDateTime = normalizeTemporalInput(input);

  return zonedDateTime.startOfDay();
}
