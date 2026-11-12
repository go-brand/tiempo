import { type Temporal, isPlainDate } from './shared/temporal';
import { addBusinessDays } from './addBusinessDays';

/**
 * Subtracts business days (Monday–Friday), skipping weekends and any holidays
 * you pass. Equivalent to `addBusinessDays(input, -days, holidays)`.
 *
 * Instant inputs are converted to UTC. ZonedDateTime inputs keep their
 * timezone and time of day. PlainDate inputs stay dates.
 *
 * @param input - An Instant (UTC), ZonedDateTime, or PlainDate
 * @param days - Whole business days to subtract (negative to add)
 * @param holidays - Dates that are not business days. For Instant and ZonedDateTime
 *   inputs they are matched against the input's own date (UTC for Instant).
 * @returns PlainDate for a date input; otherwise ZonedDateTime
 * @throws RangeError if days is not an integer
 *
 * @example
 * ```ts
 * const monday = Temporal.PlainDate.from('2025-01-27');
 *
 * subBusinessDays(monday, 1); // 2025-01-24 (Friday)
 * ```
 */
export function subBusinessDays(
  input: Temporal.PlainDate,
  days: number,
  holidays?: readonly Temporal.PlainDate[]
): Temporal.PlainDate;
export function subBusinessDays(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  days: number,
  holidays?: readonly Temporal.PlainDate[]
): Temporal.ZonedDateTime;
export function subBusinessDays(
  input: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
  days: number,
  holidays?: readonly Temporal.PlainDate[]
): Temporal.ZonedDateTime | Temporal.PlainDate {
  // Narrow each branch to the matching addBusinessDays overload.
  return isPlainDate(input)
    ? addBusinessDays(input, -days, holidays)
    : addBusinessDays(input, -days, holidays);
}
