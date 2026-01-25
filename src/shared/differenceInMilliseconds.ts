import { Temporal } from '@js-temporal/polyfill';

export function differenceInMilliseconds(
  laterDate: Temporal.ZonedDateTime,
  earlierDate: Temporal.ZonedDateTime
): number {
  return laterDate.epochMilliseconds - earlierDate.epochMilliseconds;
}
