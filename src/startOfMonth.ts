import { Temporal } from '@js-temporal/polyfill';
import type { Timezone } from './types';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';
import { plainDateToZonedDateTime } from './shared/plainDateToZonedDateTime';

/**
 * Returns a ZonedDateTime representing the first moment of the month (day 1 at midnight).
 *
 * @param input - A Temporal.Instant (UTC) or Temporal.ZonedDateTime
 * @returns ZonedDateTime at the 1st day of the month at 00:00:00.000000000
 *
 * @example
 * ```ts
 * // From Instant (always UTC)
 * const instant = Temporal.Instant.from('2025-01-15T12:00:00Z');
 * const start = startOfMonth(instant);
 * // 2025-01-01T00:00:00Z[UTC]
 * ```
 *
 * @example
 * ```ts
 * // From ZonedDateTime (uses its timezone)
 * const zoned = Temporal.ZonedDateTime.from('2025-01-15T15:30:00-05:00[America/New_York]');
 * const start = startOfMonth(zoned);
 * // 2025-01-01T00:00:00-05:00[America/New_York]
 * ```
 *
 * @example
 * ```ts
 * // From PlainDate (requires timezone)
 * const date = Temporal.PlainDate.from('2025-01-15');
 * const start = startOfMonth(date, 'America/New_York');
 * // 2025-01-01T00:00:00-05:00[America/New_York]
 * ```
 */
export function startOfMonth(
  input: Temporal.Instant | Temporal.ZonedDateTime
): Temporal.ZonedDateTime;
export function startOfMonth(
  input: Temporal.PlainDate,
  timezone: Timezone
): Temporal.ZonedDateTime;
export function startOfMonth(
  input: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
  timezone?: Timezone
): Temporal.ZonedDateTime {
  const zonedDateTime =
    input instanceof Temporal.PlainDate
      ? plainDateToZonedDateTime(input, timezone!)
      : normalizeTemporalInput(input);

  // Set day to 1, then get start of that day
  const firstDay = zonedDateTime.with({ day: 1 });

  return firstDay.startOfDay();
}
