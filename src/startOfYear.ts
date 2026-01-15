import type { Temporal } from '@js-temporal/polyfill';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';

/**
 * Returns a ZonedDateTime representing the first moment of the year (January 1 at midnight).
 *
 * @param input - A Temporal.Instant (UTC) or Temporal.ZonedDateTime
 * @returns ZonedDateTime at January 1st at 00:00:00.000000000
 *
 * @example
 * ```ts
 * // From Instant (always UTC)
 * const instant = Temporal.Instant.from('2025-06-15T12:00:00Z');
 * const start = startOfYear(instant);
 * // 2025-01-01T00:00:00Z[UTC]
 * ```
 *
 * @example
 * ```ts
 * // From ZonedDateTime (uses its timezone)
 * const zoned = Temporal.ZonedDateTime.from('2025-06-15T15:30:00-05:00[America/New_York]');
 * const start = startOfYear(zoned);
 * // 2025-01-01T00:00:00-05:00[America/New_York]
 * ```
 *
 * @example
 * ```ts
 * // Need a different timezone? Convert first
 * const instant = Temporal.Instant.from('2025-06-15T12:00:00Z');
 * const nyTime = instant.toZonedDateTimeISO('America/New_York');
 * const start = startOfYear(nyTime);
 * // 2025-01-01T00:00:00-05:00[America/New_York]
 * ```
 */
export function startOfYear(
  input: Temporal.Instant | Temporal.ZonedDateTime
): Temporal.ZonedDateTime {
  const zonedDateTime = normalizeTemporalInput(input);

  // Set to January 1st, then get start of that day
  const firstDay = zonedDateTime.with({ month: 1, day: 1 });

  return firstDay.startOfDay();
}
