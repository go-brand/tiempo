import { type Temporal, isPlainDate } from './shared/temporal';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';
import { addBusinessDaysSkipping } from './shared/businessDays';

/**
 * Adds business days (Monday–Friday), skipping weekends and any holidays you pass.
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
 * @param holidays - Dates that are not business days. For Instant and ZonedDateTime
 *   inputs they are matched against the input's own date (UTC for Instant).
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
 *
 * @example
 * ```ts
 * // Skip holidays too
 * const christmasEve = Temporal.PlainDate.from('2025-12-24');
 * const holidays = [Temporal.PlainDate.from('2025-12-25'), Temporal.PlainDate.from('2025-12-26')];
 *
 * addBusinessDays(christmasEve, 1, holidays).toString(); // "2025-12-29"
 * ```
 */
export function addBusinessDays(
  input: Temporal.PlainDate,
  days: number,
  holidays?: readonly Temporal.PlainDate[]
): Temporal.PlainDate;
export function addBusinessDays(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  days: number,
  holidays?: readonly Temporal.PlainDate[]
): Temporal.ZonedDateTime;
export function addBusinessDays(
  input: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
  days: number,
  holidays: readonly Temporal.PlainDate[] = []
): Temporal.ZonedDateTime | Temporal.PlainDate {
  if (isPlainDate(input)) {
    return addBusinessDaysSkipping(input, days, holidays);
  }
  return addBusinessDaysSkipping(normalizeTemporalInput(input), days, holidays);
}
