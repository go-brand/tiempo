import { Temporal } from './temporal';

export function differenceInMilliseconds(
  laterDate: Temporal.ZonedDateTime,
  earlierDate: Temporal.ZonedDateTime
): number {
  return Number((laterDate.epochNanoseconds - earlierDate.epochNanoseconds) / 1_000_000n);
}
