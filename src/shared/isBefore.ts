import type { Temporal } from './temporal';

export function isBefore(
  date1: Temporal.ZonedDateTime,
  date2: Temporal.ZonedDateTime
): boolean {
  return date1.epochNanoseconds < date2.epochNanoseconds;
}
