import { Temporal } from '@js-temporal/polyfill';
import type { Timezone } from '../types';
import { normalizeTemporalInput } from './normalizeTemporalInput';
import { plainDateToZonedDateTime } from './plainDateToZonedDateTime';

/**
 * @internal
 * Normalizes any temporal input (Instant, ZonedDateTime, or PlainDate) to ZonedDateTime.
 * - Instant → UTC ZonedDateTime
 * - ZonedDateTime → returned as-is
 * - PlainDate → ZonedDateTime at midnight in the specified timezone
 *
 * This is an internal helper - do not use directly.
 */
export function normalizeWithPlainDate(
  input: Temporal.Instant | Temporal.ZonedDateTime
): Temporal.ZonedDateTime;
export function normalizeWithPlainDate(
  input: Temporal.PlainDate,
  timezone: Timezone
): Temporal.ZonedDateTime;
export function normalizeWithPlainDate(
  input: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
  timezone?: Timezone
): Temporal.ZonedDateTime;
export function normalizeWithPlainDate(
  input: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate,
  timezone?: Timezone
): Temporal.ZonedDateTime {
  return input instanceof Temporal.PlainDate
    ? plainDateToZonedDateTime(input, timezone!)
    : normalizeTemporalInput(input);
}
