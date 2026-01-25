import { Temporal } from '@js-temporal/polyfill';
import type { Timezone } from './types';
import { getEndOfDay } from './shared/endOfDay';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';
import { plainDateToZonedDateTime } from './shared/plainDateToZonedDateTime';

/**
 * Returns a ZonedDateTime representing the last moment of the week (Sunday at 23:59:59.999999999).
 * Uses ISO 8601 week definition: weeks end on Sunday.
 *
 * @param input - A Temporal.Instant (UTC) or Temporal.ZonedDateTime
 * @returns ZonedDateTime at Sunday 23:59:59.999999999
 *
 * @example
 * ```ts
 * // From Instant (always UTC)
 * const instant = Temporal.Instant.from('2025-01-20T12:00:00Z'); // Monday
 * const end = endOfWeek(instant);
 * // 2025-01-26T23:59:59.999999999Z[UTC] (next Sunday)
 * ```
 *
 * @example
 * ```ts
 * // From ZonedDateTime (uses its timezone)
 * const zoned = Temporal.ZonedDateTime.from('2025-01-22T15:30:00-05:00[America/New_York]'); // Wednesday
 * const end = endOfWeek(zoned);
 * // 2025-01-26T23:59:59.999999999-05:00[America/New_York] (next Sunday)
 * ```
 *
 * @example
 * ```ts
 * // From PlainDate (requires timezone)
 * const date = Temporal.PlainDate.from('2025-01-22'); // Wednesday
 * const end = endOfWeek(date, 'America/New_York');
 * // 2025-01-26T23:59:59.999999999-05:00[America/New_York] (next Sunday)
 * ```
 */
export function endOfWeek(
  input: Temporal.Instant | Temporal.ZonedDateTime
): Temporal.ZonedDateTime;
export function endOfWeek(
  input: Temporal.PlainDate,
  timezone: Timezone
): Temporal.ZonedDateTime;
export function endOfWeek(
  input: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
  timezone?: Timezone
): Temporal.ZonedDateTime {
  const zonedDateTime =
    input instanceof Temporal.PlainDate
      ? plainDateToZonedDateTime(input, timezone!)
      : normalizeTemporalInput(input);

  // Get the day of week (1 = Monday, 7 = Sunday in ISO 8601)
  const dayOfWeek = zonedDateTime.dayOfWeek;

  // Calculate days to add to get to Sunday
  const daysToAdd = 7 - dayOfWeek;

  // Go to Sunday, then get end of that day
  const sunday = zonedDateTime.add({ days: daysToAdd });

  return getEndOfDay(sunday);
}
