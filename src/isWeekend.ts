import { type Temporal, isPlainDate } from './shared/temporal';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';
import { isWeekendDay } from './shared/businessDays';

/**
 * Returns true if the value falls on a Saturday or Sunday.
 *
 * Instant inputs are converted to UTC. ZonedDateTime inputs use their own
 * timezone. PlainDate inputs use their date directly.
 *
 * @param input - An Instant (UTC), ZonedDateTime, or PlainDate
 * @returns true on Saturday or Sunday, false otherwise
 *
 * @example
 * ```ts
 * isWeekend(Temporal.PlainDate.from('2025-01-25')); // true (Saturday)
 * isWeekend(Temporal.PlainDate.from('2025-01-27')); // false (Monday)
 * ```
 */
export function isWeekend(
  input: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate
): boolean {
  const date = isPlainDate(input) ? input : normalizeTemporalInput(input);
  return isWeekendDay(date.dayOfWeek);
}
