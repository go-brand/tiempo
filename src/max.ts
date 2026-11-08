import type { Temporal } from "./shared/temporal";
import { compare, type Comparable, type Timeline } from "./shared/compare";

/**
 * Returns the latest value in a non-empty array. The value is returned as
 * given, with its type, timezone, and calendar intact. Ties return the first.
 *
 * Timeline values compare by exact instant, PlainDates by date, and
 * PlainTimes by wall-clock time. Mixed domains throw a TypeError.
 *
 * @param values - Values from one domain; at least one is required
 * @returns The latest value
 * @throws RangeError if values is empty
 *
 * @example
 * ```ts
 * max([
 *   Temporal.Instant.from('2025-01-20T15:00:00Z'),
 *   Temporal.ZonedDateTime.from('2025-01-20T11:00:00-05:00[America/New_York]'),
 * ]); // the ZonedDateTime (16:00 UTC)
 * ```
 */
export function max<T extends Timeline>(values: readonly T[]): T;
export function max(values: readonly Temporal.PlainDate[]): Temporal.PlainDate;
export function max(values: readonly Temporal.PlainTime[]): Temporal.PlainTime;
export function max(values: readonly Comparable[]): Comparable {
  if (values.length === 0) {
    throw new RangeError("max requires at least one value");
  }
  return values.reduce((latest, value) => (compare(value, latest) > 0 ? value : latest));
}
