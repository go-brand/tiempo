import type { Temporal } from './temporal';

export function isAfter(
  date1: Temporal.ZonedDateTime,
  date2: Temporal.ZonedDateTime
): boolean {
  return date1.epochNanoseconds > date2.epochNanoseconds;
}
