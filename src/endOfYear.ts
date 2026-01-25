import { Temporal } from '@js-temporal/polyfill';
import type { Timezone } from './types';
import { getEndOfDay } from './shared/endOfDay';
import { normalizeWithPlainDate } from './shared/normalizeWithPlainDate';

/**
 * Returns a ZonedDateTime representing the last moment of the year (last day at 23:59:59.999999999).
 *
 * @param input - A Temporal.Instant (UTC) or Temporal.ZonedDateTime
 * @returns ZonedDateTime at the last day of the year at 23:59:59.999999999
 *
 * @example
 * ```ts
 * // From Instant (always UTC)
 * const instant = Temporal.Instant.from('2025-06-15T12:00:00Z');
 * const end = endOfYear(instant);
 * // 2025-12-31T23:59:59.999999999Z[UTC]
 * ```
 *
 * @example
 * ```ts
 * // From ZonedDateTime (uses its timezone)
 * const zoned = Temporal.ZonedDateTime.from('2025-06-15T15:30:00-05:00[America/New_York]');
 * const end = endOfYear(zoned);
 * // 2025-12-31T23:59:59.999999999-05:00[America/New_York]
 * ```
 *
 * @example
 * ```ts
 * // From PlainDate (requires timezone)
 * const date = Temporal.PlainDate.from('2025-06-15');
 * const end = endOfYear(date, 'America/New_York');
 * // 2025-12-31T23:59:59.999999999-05:00[America/New_York]
 * ```
 */
export function endOfYear(
  input: Temporal.Instant | Temporal.ZonedDateTime
): Temporal.ZonedDateTime;
export function endOfYear(
  input: Temporal.PlainDate,
  timezone: Timezone
): Temporal.ZonedDateTime;
export function endOfYear(
  input: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
  timezone?: Timezone
): Temporal.ZonedDateTime {
  const zonedDateTime = normalizeWithPlainDate(input, timezone!);
  const lastMonth = zonedDateTime.with({ month: zonedDateTime.monthsInYear });
  const lastDay = lastMonth.with({ day: lastMonth.daysInMonth });
  return getEndOfDay(lastDay);
}
