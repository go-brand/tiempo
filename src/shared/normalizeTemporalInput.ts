import { Temporal } from '@js-temporal/polyfill';

/**
 * @internal
 * Normalizes input to ZonedDateTime. Converts Instant to UTC, or returns existing ZonedDateTime.
 * This is an internal helper - do not use directly.
 */
export function normalizeTemporalInput(
  input: Temporal.Instant | Temporal.ZonedDateTime
): Temporal.ZonedDateTime {
  return input instanceof Temporal.Instant
    ? input.toZonedDateTimeISO('UTC')
    : input;
}
