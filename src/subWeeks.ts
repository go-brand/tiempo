import { type Temporal, isPlainDate } from './shared/temporal';
import { addWeeks } from './addWeeks';

/**
 * Subtracts the specified number of weeks from a datetime or date.
 *
 * This is a convenience wrapper around addWeeks with negated value.
 * Properly handles DST transitions and calendar edge cases through Temporal API.
 *
 * PlainDate inputs stay in calendar space, preserving their calendar without a timezone.
 *
 * @param input - A Temporal.Instant (UTC), Temporal.ZonedDateTime, or Temporal.PlainDate
 * @param weeks - Number of weeks to subtract
 * @returns PlainDate for a date input; otherwise ZonedDateTime with weeks subtracted
 *
 * @example
 * ```ts
 * const instant = Temporal.Instant.from('2025-02-03T12:00:00Z');
 * const result = subWeeks(instant, 2);
 * // 2025-01-20T12:00:00+00:00[UTC] (2 weeks earlier)
 * ```
 */
export function subWeeks(input: Temporal.PlainDate, weeks: number): Temporal.PlainDate;
export function subWeeks(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  weeks: number
): Temporal.ZonedDateTime;
export function subWeeks(
  input: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
  weeks: number
): Temporal.ZonedDateTime | Temporal.PlainDate {
  // Narrow each branch to the matching addWeeks overload.
  return isPlainDate(input) ? addWeeks(input, -weeks) : addWeeks(input, -weeks);
}
