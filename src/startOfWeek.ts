import { type Temporal, isPlainDate } from './shared/temporal';
import type { Timezone } from './types';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';
import { plainDateToZonedDateTime } from './shared/plainDateToZonedDateTime';
import { daysIntoWeek, type WeekOptions } from './shared/week';

/**
 * Returns the first boundary of the week.
 * Weeks start on Monday (ISO 8601) unless `weekStartsOn` says otherwise.
 * PlainDate inputs stay in calendar space unless a timezone is provided.
 *
 * @param input - A Temporal.Instant (UTC), Temporal.ZonedDateTime, or Temporal.PlainDate
 * @param options - `weekStartsOn`: 1 = Monday (default) … 7 = Sunday
 * @returns The first day of the week at 00:00, or that date for PlainDate input
 *
 * @example
 * ```ts
 * // From Instant (always UTC)
 * const instant = Temporal.Instant.from('2025-01-20T12:00:00Z'); // Monday
 * const start = startOfWeek(instant);
 * // 2025-01-20T00:00:00+00:00[UTC] (same day, it's already Monday)
 * ```
 *
 * @example
 * ```ts
 * // From ZonedDateTime (uses its timezone)
 * const zoned = Temporal.ZonedDateTime.from('2025-01-22T15:30:00-05:00[America/New_York]'); // Wednesday
 * const start = startOfWeek(zoned);
 * // 2025-01-20T00:00:00-05:00[America/New_York] (previous Monday)
 * ```
 *
 * @example
 * ```ts
 * // From PlainDate (stays a date)
 * const date = Temporal.PlainDate.from('2025-01-22'); // Wednesday
 * const start = startOfWeek(date);
 * // 2025-01-20 (previous Monday)
 * ```
 *
 * @example
 * ```ts
 * // From PlainDate with a timezone (returns a ZonedDateTime)
 * const date = Temporal.PlainDate.from('2025-01-22'); // Wednesday
 * const start = startOfWeek(date, 'America/New_York');
 * // 2025-01-20T00:00:00-05:00[America/New_York] (previous Monday)
 * ```
 *
 * @example
 * ```ts
 * // Weeks that start on Sunday
 * const date = Temporal.PlainDate.from('2025-01-22'); // Wednesday
 * const start = startOfWeek(date, { weekStartsOn: 7 });
 * // 2025-01-19 (previous Sunday)
 * ```
 */
export function startOfWeek(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  options?: WeekOptions
): Temporal.ZonedDateTime;
export function startOfWeek(input: Temporal.PlainDate, options?: WeekOptions): Temporal.PlainDate;
export function startOfWeek(
  input: Temporal.PlainDate,
  timezone: Timezone,
  options?: WeekOptions
): Temporal.ZonedDateTime;
export function startOfWeek(
  input: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
  timezoneOrOptions?: Timezone | WeekOptions,
  options?: WeekOptions
): Temporal.ZonedDateTime | Temporal.PlainDate {
  const timezone = typeof timezoneOrOptions === 'string' ? timezoneOrOptions : undefined;
  const weekOptions = typeof timezoneOrOptions === 'string' ? options : timezoneOrOptions;

  if (isPlainDate(input) && timezone === undefined) {
    return input.subtract({ days: daysIntoWeek(input.dayOfWeek, weekOptions) });
  }

  const zonedDateTime = isPlainDate(input)
    ? plainDateToZonedDateTime(input, timezone!)
    : normalizeTemporalInput(input);

  return zonedDateTime
    .subtract({ days: daysIntoWeek(zonedDateTime.dayOfWeek, weekOptions) })
    .startOfDay();
}
