import type { Temporal } from '@js-temporal/polyfill';
import { isPlainDate } from './shared/temporal';
import { addYears } from './addYears';

/**
 * Subtracts the specified number of years from a datetime or date.
 *
 * This is a convenience wrapper around addYears with negated value.
 * Properly handles leap years and calendar edge cases through Temporal API.
 *
 * PlainDate inputs stay in calendar space, preserving their calendar without a timezone.
 *
 * @param input - A Temporal.Instant (UTC), Temporal.ZonedDateTime, or Temporal.PlainDate
 * @param years - Number of years to subtract
 * @returns PlainDate for a date input; otherwise ZonedDateTime with years subtracted
 *
 * @example
 * ```ts
 * const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
 * const result = subYears(instant, 2);
 * // 2023-01-20T12:00:00Z[UTC] (2 years earlier)
 * ```
 */
export function subYears(input: Temporal.PlainDate, years: number): Temporal.PlainDate;
export function subYears(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  years: number
): Temporal.ZonedDateTime;
export function subYears(
  input: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
  years: number
): Temporal.ZonedDateTime | Temporal.PlainDate {
  // Narrow each branch to the matching addYears overload.
  return isPlainDate(input) ? addYears(input, -years) : addYears(input, -years);
}
