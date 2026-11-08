import { type Temporal, isPlainDate } from './shared/temporal';
import { addMonths } from './addMonths';

/**
 * Subtracts the specified number of months from a datetime or date.
 *
 * This is a convenience wrapper around addMonths with negated value.
 * Properly handles month-end dates and calendar edge cases through Temporal API.
 *
 * PlainDate inputs stay in calendar space, preserving their calendar without a timezone.
 *
 * @param input - A Temporal.Instant (UTC), Temporal.ZonedDateTime, or Temporal.PlainDate
 * @param months - Number of months to subtract
 * @returns PlainDate for a date input; otherwise ZonedDateTime with months subtracted
 *
 * @example
 * ```ts
 * const instant = Temporal.Instant.from('2025-04-20T12:00:00Z');
 * const result = subMonths(instant, 3);
 * // 2025-01-20T12:00:00Z[UTC] (3 months earlier)
 * ```
 */
export function subMonths(input: Temporal.PlainDate, months: number): Temporal.PlainDate;
export function subMonths(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  months: number
): Temporal.ZonedDateTime;
export function subMonths(
  input: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
  months: number
): Temporal.ZonedDateTime | Temporal.PlainDate {
  // Narrow each branch to the matching addMonths overload.
  return isPlainDate(input) ? addMonths(input, -months) : addMonths(input, -months);
}
