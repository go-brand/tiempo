import { type Temporal, isPlainDate } from './shared/temporal';
import { addDays } from './addDays';

/**
 * Subtracts the specified number of days from a datetime or date.
 *
 * This is a convenience wrapper around addDays with negated value.
 * Properly handles DST transitions and calendar edge cases through Temporal API.
 *
 * PlainDate inputs stay in calendar space, preserving their calendar without a timezone.
 *
 * @param input - A Temporal.Instant (UTC), Temporal.ZonedDateTime, or Temporal.PlainDate
 * @param days - Number of days to subtract
 * @returns PlainDate for a date input; otherwise ZonedDateTime with days subtracted
 *
 * @example
 * ```ts
 * const instant = Temporal.Instant.from('2025-01-25T12:00:00Z');
 * const result = subDays(instant, 5);
 * // 2025-01-20T12:00:00Z[UTC] (5 days earlier)
 * ```
 */
export function subDays(input: Temporal.PlainDate, days: number): Temporal.PlainDate;
export function subDays(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  days: number
): Temporal.ZonedDateTime;
export function subDays(
  input: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
  days: number
): Temporal.ZonedDateTime | Temporal.PlainDate {
  // Narrow each branch to the matching addDays overload.
  return isPlainDate(input) ? addDays(input, -days) : addDays(input, -days);
}
