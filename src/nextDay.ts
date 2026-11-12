import { type Temporal, isPlainDate } from './shared/temporal';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';
import { assertDayOfWeek, type DayOfWeek } from './shared/week';

/**
 * Returns the next date that falls on the given day of the week, always after
 * the input: next Friday from a Friday is a week later.
 *
 * Days are numbered as Temporal numbers them: 1 = Monday … 7 = Sunday.
 * PlainDate inputs stay dates. Instant inputs are read in UTC and ZonedDateTime
 * inputs keep their timezone; both keep their wall-clock time.
 *
 * @param input - A Temporal.Instant (UTC), Temporal.ZonedDateTime, or Temporal.PlainDate
 * @param day - The day of the week to find, 1 = Monday … 7 = Sunday
 * @returns The next date on that day of the week
 *
 * @example
 * ```ts
 * const wednesday = Temporal.PlainDate.from('2025-01-22');
 *
 * nextDay(wednesday, 5).toString(); // "2025-01-24"
 * nextDay(wednesday, 3).toString(); // "2025-01-29"
 * ```
 *
 * @example
 * ```ts
 * // Keeps the wall-clock time across a DST change
 * const fridayEvening = Temporal.ZonedDateTime.from('2025-03-07T18:00:00-05:00[America/New_York]');
 *
 * nextDay(fridayEvening, 1).toString(); // "2025-03-10T18:00:00-04:00[America/New_York]"
 * ```
 */
export function nextDay(input: Temporal.PlainDate, day: DayOfWeek): Temporal.PlainDate;
export function nextDay(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  day: DayOfWeek
): Temporal.ZonedDateTime;
export function nextDay(
  input: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
  day: DayOfWeek
): Temporal.ZonedDateTime | Temporal.PlainDate {
  assertDayOfWeek(day, 'day');
  const value = isPlainDate(input) ? input : normalizeTemporalInput(input);
  return value.add({ days: ((day - value.dayOfWeek + 6) % 7) + 1 });
}
