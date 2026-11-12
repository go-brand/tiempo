import { type Temporal, isPlainDate } from './shared/temporal';
import type { Timezone } from './types';
import { getEndOfDay } from './shared/endOfDay';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';
import { plainDateToZonedDateTime } from './shared/plainDateToZonedDateTime';
import { daysIntoWeek, type WeekOptions } from './shared/week';

/**
 * Returns the last boundary of the week.
 * Weeks start on Monday and end on Sunday (ISO 8601) unless `weekStartsOn` says otherwise.
 * PlainDate inputs stay in calendar space unless a timezone is provided.
 *
 * @param input - A Temporal.Instant (UTC), Temporal.ZonedDateTime, or Temporal.PlainDate
 * @param options - `weekStartsOn`: 1 = Monday (default) … 7 = Sunday
 * @returns The last day of the week at 23:59:59.999999999, or that date for PlainDate input
 *
 * @example
 * ```ts
 * // From Instant (always UTC)
 * const instant = Temporal.Instant.from('2025-01-20T12:00:00Z'); // Monday
 * const end = endOfWeek(instant);
 * // 2025-01-26T23:59:59.999999999+00:00[UTC] (next Sunday)
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
 * // From PlainDate (stays a date)
 * const date = Temporal.PlainDate.from('2025-01-22'); // Wednesday
 * const end = endOfWeek(date);
 * // 2025-01-26 (next Sunday)
 * ```
 *
 * @example
 * ```ts
 * // From PlainDate with a timezone (returns a ZonedDateTime)
 * const date = Temporal.PlainDate.from('2025-01-22'); // Wednesday
 * const end = endOfWeek(date, 'America/New_York');
 * // 2025-01-26T23:59:59.999999999-05:00[America/New_York] (next Sunday)
 * ```
 *
 * @example
 * ```ts
 * // Weeks that start on Sunday end on Saturday
 * const date = Temporal.PlainDate.from('2025-01-22'); // Wednesday
 * const end = endOfWeek(date, { weekStartsOn: 7 });
 * // 2025-01-25 (next Saturday)
 * ```
 */
export function endOfWeek(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  options?: WeekOptions
): Temporal.ZonedDateTime;
export function endOfWeek(input: Temporal.PlainDate, options?: WeekOptions): Temporal.PlainDate;
export function endOfWeek(
  input: Temporal.PlainDate,
  timezone: Timezone,
  options?: WeekOptions
): Temporal.ZonedDateTime;
export function endOfWeek(
  input: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
  timezoneOrOptions?: Timezone | WeekOptions,
  options?: WeekOptions
): Temporal.ZonedDateTime | Temporal.PlainDate {
  const timezone = typeof timezoneOrOptions === 'string' ? timezoneOrOptions : undefined;
  const weekOptions = typeof timezoneOrOptions === 'string' ? options : timezoneOrOptions;

  if (isPlainDate(input) && timezone === undefined) {
    return input.add({ days: 6 - daysIntoWeek(input.dayOfWeek, weekOptions) });
  }

  const zonedDateTime = isPlainDate(input)
    ? plainDateToZonedDateTime(input, timezone!)
    : normalizeTemporalInput(input);

  return getEndOfDay(
    zonedDateTime.add({ days: 6 - daysIntoWeek(zonedDateTime.dayOfWeek, weekOptions) })
  );
}
