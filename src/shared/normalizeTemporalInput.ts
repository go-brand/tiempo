import { type Temporal, isInstant } from './temporal';

/**
 * @internal
 * Normalizes input to ZonedDateTime. Converts Instant to UTC, or returns existing ZonedDateTime.
 * This is an internal helper - do not use directly.
 */
export function normalizeTemporalInput(
  input: Temporal.Instant | Temporal.ZonedDateTime
): Temporal.ZonedDateTime {
  return isInstant(input)
    ? input.toZonedDateTimeISO('UTC')
    : input;
}
