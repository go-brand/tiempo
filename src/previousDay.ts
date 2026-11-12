import { type Temporal, isPlainDate } from './shared/temporal';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';
import { assertDayOfWeek, type DayOfWeek } from './shared/week';

/**
 * Returns the previous date that falls on the given day of the week, always
 * before the input: previous Monday from a Monday is a week earlier.
 *
 * Days are numbered as Temporal numbers them: 1 = Monday … 7 = Sunday.
 * PlainDate inputs stay dates. Instant inputs are read in UTC and ZonedDateTime
 * inputs keep their timezone; both keep their wall-clock time.
 *
 * @param input - A Temporal.Instant (UTC), Temporal.ZonedDateTime, or Temporal.PlainDate
 * @param day - The day of the week to find, 1 = Monday … 7 = Sunday
 * @returns The previous date on that day of the week
 *
 * @example
 * ```ts
 * const wednesday = Temporal.PlainDate.from('2025-01-22');
 *
 * previousDay(wednesday, 1).toString(); // "2025-01-20"
 * previousDay(wednesday, 3).toString(); // "2025-01-15"
 * previousDay(wednesday, 7).toString(); // "2025-01-19"
 * ```
 */
export function previousDay(input: Temporal.PlainDate, day: DayOfWeek): Temporal.PlainDate;
export function previousDay(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  day: DayOfWeek
): Temporal.ZonedDateTime;
export function previousDay(
  input: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
  day: DayOfWeek
): Temporal.ZonedDateTime | Temporal.PlainDate {
  assertDayOfWeek(day, 'day');
  const value = isPlainDate(input) ? input : normalizeTemporalInput(input);
  return value.subtract({ days: ((value.dayOfWeek - day + 6) % 7) + 1 });
}
