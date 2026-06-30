import type { Temporal } from "@js-temporal/polyfill";
import type { Timezone } from "./types";
import { normalizeWithPlainDate } from "./shared/normalizeWithPlainDate";
import { quarterOfMonth } from "./shared/quarter";

/**
 * Returns the quarter (1-4) that a datetime falls in.
 *
 * Quarters: Q1 = Jan–Mar, Q2 = Apr–Jun, Q3 = Jul–Sep, Q4 = Oct–Dec.
 *
 * Instant inputs are interpreted in UTC. For ZonedDateTime inputs, their
 * timezone is used. For PlainDate inputs, a timezone is required for a
 * consistent input contract (the quarter itself is timezone-independent).
 *
 * @param input - A Temporal.Instant (UTC) or Temporal.ZonedDateTime
 * @returns The quarter number: 1, 2, 3, or 4
 *
 * @example
 * ```ts
 * // From Instant (always UTC)
 * const instant = Temporal.Instant.from('2025-05-15T12:00:00Z');
 * getQuarter(instant); // 2
 * ```
 *
 * @example
 * ```ts
 * // From ZonedDateTime (uses its timezone)
 * const zoned = Temporal.ZonedDateTime.from('2025-11-15T15:30:00-05:00[America/New_York]');
 * getQuarter(zoned); // 4
 * ```
 *
 * @example
 * ```ts
 * // From PlainDate (requires timezone)
 * const date = Temporal.PlainDate.from('2025-02-15');
 * getQuarter(date, 'America/New_York'); // 1
 * ```
 */
export function getQuarter(input: Temporal.Instant | Temporal.ZonedDateTime): 1 | 2 | 3 | 4;
export function getQuarter(input: Temporal.PlainDate, timezone: Timezone): 1 | 2 | 3 | 4;
export function getQuarter(
  input: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
  timezone?: Timezone,
): 1 | 2 | 3 | 4 {
  const zonedDateTime = normalizeWithPlainDate(input, timezone!);
  return quarterOfMonth(zonedDateTime.month);
}
