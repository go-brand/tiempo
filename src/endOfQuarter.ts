import { Temporal } from "./shared/temporal";
import type { Timezone } from "./types";
import { getEndOfDay } from "./shared/endOfDay";
import { normalizeWithPlainDate } from "./shared/normalizeWithPlainDate";
import { quarterStartMonth } from "./shared/quarter";

/**
 * Returns a ZonedDateTime representing the last moment of the quarter
 * (last day of the quarter's ending month at 23:59:59.999999999).
 *
 * Quarters: Q1 = Jan–Mar, Q2 = Apr–Jun, Q3 = Jul–Sep, Q4 = Oct–Dec.
 *
 * @param input - A Temporal.Instant (UTC) or Temporal.ZonedDateTime
 * @returns ZonedDateTime at the last day of the quarter at 23:59:59.999999999
 *
 * @example
 * ```ts
 * // From Instant (always UTC)
 * const instant = Temporal.Instant.from('2025-05-15T12:00:00Z');
 * const end = endOfQuarter(instant);
 * // 2025-06-30T23:59:59.999999999Z[UTC]
 * ```
 *
 * @example
 * ```ts
 * // From ZonedDateTime (uses its timezone)
 * const zoned = Temporal.ZonedDateTime.from('2025-02-15T15:30:00-05:00[America/New_York]');
 * const end = endOfQuarter(zoned);
 * // 2025-03-31T23:59:59.999999999-04:00[America/New_York]
 * ```
 *
 * @example
 * ```ts
 * // From PlainDate (requires timezone)
 * const date = Temporal.PlainDate.from('2025-11-15');
 * const end = endOfQuarter(date, 'America/New_York');
 * // 2025-12-31T23:59:59.999999999-05:00[America/New_York]
 * ```
 */
export function endOfQuarter(
  input: Temporal.Instant | Temporal.ZonedDateTime,
): Temporal.ZonedDateTime;
export function endOfQuarter(input: Temporal.PlainDate, timezone: Timezone): Temporal.ZonedDateTime;
export function endOfQuarter(
  input: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
  timezone?: Timezone,
): Temporal.ZonedDateTime {
  const zonedDateTime = normalizeWithPlainDate(input, timezone!);
  const endMonth = zonedDateTime.with({
    month: quarterStartMonth(zonedDateTime.month) + 2,
    day: 1,
  });
  const lastDay = endMonth.with({ day: endMonth.daysInMonth });
  return getEndOfDay(lastDay);
}
