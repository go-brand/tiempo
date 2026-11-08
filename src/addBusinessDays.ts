import { type Temporal, isPlainDate } from "./shared/temporal";
import { normalizeTemporalInput } from "./shared/normalizeTemporalInput";
import { addWeekdays } from "./shared/businessDays";

/**
 * Adds business days (Monday–Friday), skipping weekends. Holidays are not
 * considered.
 *
 * Starting on a weekend, the first business day counted is the next Monday
 * (or the previous Friday for negative values). Adding 0 returns the input's
 * date unchanged, even on a weekend.
 *
 * Instant inputs are converted to UTC. ZonedDateTime inputs keep their
 * timezone and time of day. PlainDate inputs stay dates.
 *
 * @param input - An Instant (UTC), ZonedDateTime, or PlainDate
 * @param days - Whole business days to add (negative to subtract)
 * @returns PlainDate for a date input; otherwise ZonedDateTime
 * @throws RangeError if days is not an integer
 *
 * @example
 * ```ts
 * const friday = Temporal.PlainDate.from('2025-01-24');
 *
 * addBusinessDays(friday, 1); // 2025-01-27 (Monday)
 * addBusinessDays(friday, 5); // 2025-01-31 (Friday)
 * ```
 */
export function addBusinessDays(input: Temporal.PlainDate, days: number): Temporal.PlainDate;
export function addBusinessDays(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  days: number,
): Temporal.ZonedDateTime;
export function addBusinessDays(
  input: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
  days: number,
): Temporal.ZonedDateTime | Temporal.PlainDate {
  if (isPlainDate(input)) {
    return addWeekdays(input, days);
  }
  return addWeekdays(normalizeTemporalInput(input), days);
}
