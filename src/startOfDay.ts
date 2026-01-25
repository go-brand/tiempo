import { Temporal } from '@js-temporal/polyfill';
import type { Timezone } from './types';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';
import { plainDateToZonedDateTime } from './shared/plainDateToZonedDateTime';

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
 * // From PlainDate (requires timezone)
 * const date = Temporal.PlainDate.from('2025-01-20');
 * const start = startOfDay(date, 'America/New_York');
 * // 2025-01-20T00:00:00-05:00[America/New_York]
 * ```
 */
export function startOfDay(
  input: Temporal.Instant | Temporal.ZonedDateTime
): Temporal.ZonedDateTime;
export function startOfDay(
  input: Temporal.PlainDate,
  timezone: Timezone
): Temporal.ZonedDateTime;
export function startOfDay(
  input: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
  timezone?: Timezone
): Temporal.ZonedDateTime {
  if (input instanceof Temporal.PlainDate) {
    return plainDateToZonedDateTime(input, timezone!).startOfDay();
  }

  const zonedDateTime = normalizeTemporalInput(input);
  return zonedDateTime.startOfDay();
}
