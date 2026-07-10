import { isPlainDate, Temporal } from './shared/temporal';
import type { Timezone } from './types';
import { normalizeWithPlainDate } from './shared/normalizeWithPlainDate';

/**
 * Returns the first boundary of the year.
 * PlainDate inputs stay in calendar space unless a timezone is provided.
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
 * // From PlainDate (stays a date)
 * const date = Temporal.PlainDate.from('2025-06-15');
 * const start = startOfYear(date);
 * // 2025-01-01
 * ```
 *
 * @example
 * ```ts
 * // From PlainDate with a timezone (returns a ZonedDateTime)
 * const date = Temporal.PlainDate.from('2025-06-15');
 * const start = startOfYear(date, 'America/New_York');
 * // 2025-01-01T00:00:00-05:00[America/New_York]
 * ```
 */
export function startOfYear(
  input: Temporal.Instant | Temporal.ZonedDateTime
): Temporal.ZonedDateTime;
export function startOfYear(input: Temporal.PlainDate): Temporal.PlainDate;
export function startOfYear(
  input: Temporal.PlainDate,
  timezone: Timezone
): Temporal.ZonedDateTime;
export function startOfYear(
  input: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
  timezone?: Timezone
): Temporal.ZonedDateTime | Temporal.PlainDate {
  if (isPlainDate(input) && timezone === undefined) {
    return input.with({ month: 1, day: 1 });
  }

  const zonedDateTime = normalizeWithPlainDate(input, timezone!);
  const firstDay = zonedDateTime.with({ month: 1, day: 1 });
  return firstDay.startOfDay();
}
