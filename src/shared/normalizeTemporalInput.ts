import { type Temporal, isInstant, isZonedDateTime } from './temporal';

/**
 * @internal
 * Normalizes input to ZonedDateTime. Converts Instant to UTC, or returns existing ZonedDateTime.
 * Anything else (a PlainDate, a string, a Date) throws, so a wrong-domain value can never
 * flow through as if it were a moment.
 * This is an internal helper - do not use directly.
 */
export function normalizeTemporalInput(
  input: Temporal.Instant | Temporal.ZonedDateTime
): Temporal.ZonedDateTime {
  if (isInstant(input)) return input.toZonedDateTimeISO('UTC');
  if (isZonedDateTime(input)) return input;
  throw new TypeError(
    `Expected a Temporal.Instant or Temporal.ZonedDateTime, got ${Object.prototype.toString.call(input).slice(8, -1)}`
  );
}
