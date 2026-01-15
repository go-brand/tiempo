import { Temporal } from '@js-temporal/polyfill';
import { getEndOfDay } from './shared/endOfDay';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';

/**
 * Returns a ZonedDateTime representing the last nanosecond of the day.
 *
 * @param input - A Temporal.Instant (UTC) or Temporal.ZonedDateTime
 * @returns ZonedDateTime at 23:59:59.999999999
 *
 * @example
 * ```ts
 * // From Instant (always UTC)
 * const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
 * const end = endOfDay(instant);
 * // 2025-01-20T23:59:59.999999999Z[UTC]
 * ```
 *
 * @example
 * ```ts
 * // From ZonedDateTime (uses its timezone)
 * const zoned = Temporal.ZonedDateTime.from('2025-01-20T15:30:00-05:00[America/New_York]');
 * const end = endOfDay(zoned);
 * // 2025-01-20T23:59:59.999999999-05:00[America/New_York]
 * ```
 *
 * @example
 * ```ts
 * // Need a different timezone? Convert first
 * const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
 * const nyTime = instant.toZonedDateTimeISO('America/New_York');
 * const end = endOfDay(nyTime);
 * // 2025-01-20T23:59:59.999999999-05:00[America/New_York]
 * ```
 */
export function endOfDay(
  input: Temporal.Instant | Temporal.ZonedDateTime
): Temporal.ZonedDateTime {
  const zonedDateTime = normalizeTemporalInput(input);

  return getEndOfDay(zonedDateTime);
}
