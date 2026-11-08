import { type Temporal, isPlainDate } from './shared/temporal';
import { addBusinessDays } from './addBusinessDays';

/**
 * Subtracts business days (Monday–Friday), skipping weekends. Holidays are
 * not considered. Equivalent to `addBusinessDays(input, -days)`.
 *
 * Instant inputs are converted to UTC. ZonedDateTime inputs keep their
 * timezone and time of day. PlainDate inputs stay dates.
 *
 * @param input - An Instant (UTC), ZonedDateTime, or PlainDate
 * @param days - Whole business days to subtract (negative to add)
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
export function subBusinessDays(input: Temporal.PlainDate, days: number): Temporal.PlainDate;
export function subBusinessDays(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  days: number
): Temporal.ZonedDateTime;
export function subBusinessDays(
  input: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
  days: number
): Temporal.ZonedDateTime | Temporal.PlainDate {
  // Narrow each branch to the matching addBusinessDays overload.
  return isPlainDate(input) ? addBusinessDays(input, -days) : addBusinessDays(input, -days);
}
