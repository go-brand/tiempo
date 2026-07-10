import { isPlainDate } from "./shared/temporal";
import type { Temporal } from "@js-temporal/polyfill";
import type { Timezone } from "./types";
import { normalizeWithPlainDate } from "./shared/normalizeWithPlainDate";
import { quarterStartMonth } from "./shared/quarter";

/**
 * Returns a ZonedDateTime representing the first moment of the quarter
 * (first day of the quarter's starting month at midnight).
 *
 * Quarters: Q1 = Jan–Mar, Q2 = Apr–Jun, Q3 = Jul–Sep, Q4 = Oct–Dec.
 *
 * @param input - A Temporal.Instant (UTC) or Temporal.ZonedDateTime
 * @returns ZonedDateTime at the 1st day of the quarter at 00:00:00.000000000
 *
 * @example
 * ```ts
 * // From Instant (always UTC)
 * const instant = Temporal.Instant.from('2025-05-15T12:00:00Z');
 * const start = startOfQuarter(instant);
 * // 2025-04-01T00:00:00Z[UTC]
 * ```
 *
 * @example
 * ```ts
 * // From ZonedDateTime (uses its timezone)
 * const zoned = Temporal.ZonedDateTime.from('2025-08-15T15:30:00-05:00[America/New_York]');
 * const start = startOfQuarter(zoned);
 * // 2025-07-01T00:00:00-04:00[America/New_York]
 * ```
 *
 * @example
 * ```ts
 * // From PlainDate (requires timezone)
 * const date = Temporal.PlainDate.from('2025-11-15');
 * const start = startOfQuarter(date, 'America/New_York');
 * // 2025-10-01T00:00:00-04:00[America/New_York]
 * ```
 */
export function startOfQuarter(
  input: Temporal.Instant | Temporal.ZonedDateTime,
): Temporal.ZonedDateTime;
export function startOfQuarter(input: Temporal.PlainDate): Temporal.PlainDate;
export function startOfQuarter(
  input: Temporal.PlainDate,
  timezone: Timezone,
): Temporal.ZonedDateTime;
export function startOfQuarter(
  input: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
  timezone?: Timezone,
): Temporal.ZonedDateTime | Temporal.PlainDate {
  // PlainDate with no timezone stays in calendar space → first day of quarter.
  if (isPlainDate(input) && timezone === undefined) {
    return input.with({ month: quarterStartMonth(input.month), day: 1 });
  }
  const zonedDateTime = normalizeWithPlainDate(input, timezone!);
  const firstDay = zonedDateTime.with({
    month: quarterStartMonth(zonedDateTime.month),
    day: 1,
  });
  return firstDay.startOfDay();
}
