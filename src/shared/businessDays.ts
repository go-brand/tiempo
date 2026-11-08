import { Temporal, isPlainDate } from "./temporal";
import { normalizeTemporalInput } from "./normalizeTemporalInput";

/**
 * @internal
 * Saturday (6) and Sunday (7) in Temporal's Monday-based dayOfWeek.
 */
export function isWeekendDay(dayOfWeek: number): boolean {
  return dayOfWeek >= 6;
}

/**
 * @internal
 * Steps one day at a time, counting only Monday–Friday, so the result keeps
 * the input's type, time of day, and timezone.
 */
export function addWeekdays<T extends { dayOfWeek: number; add(duration: { days: number }): T }>(
  start: T,
  days: number,
): T {
  if (!Number.isInteger(days)) {
    throw new RangeError("Business day counts must be integers");
  }
  const step = days < 0 ? -1 : 1;
  let result = start;
  for (let remaining = Math.abs(days); remaining > 0;) {
    result = result.add({ days: step });
    if (!isWeekendDay(result.dayOfWeek)) remaining--;
  }
  return result;
}

/**
 * @internal
 * The calendar date of a value as an ISO PlainDate from this library's
 * Temporal implementation. Instant uses UTC; ZonedDateTime uses its timezone.
 */
export function isoDate(
  input: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
): Temporal.PlainDate {
  const date = isPlainDate(input) ? input : normalizeTemporalInput(input).toPlainDate();
  return Temporal.PlainDate.from(date.toString()).withCalendar("iso8601");
}
