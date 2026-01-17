import { Temporal } from '@js-temporal/polyfill';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';

/**
 * Returns true if the given datetime is in the past.
 * Compares by the underlying instant (epoch time) against the current time.
 *
 * @param date - Datetime to check (Instant or ZonedDateTime)
 * @returns true if date is before the current instant, false otherwise
 *
 * @example
 * ```ts
 * const yesterday = Temporal.Now.zonedDateTimeISO().subtract({ days: 1 });
 * const tomorrow = Temporal.Now.zonedDateTimeISO().add({ days: 1 });
 *
 * isPast(yesterday); // true
 * isPast(tomorrow); // false
 * ```
 *
 * @example
 * ```ts
 * // Works with Instant too
 * const pastInstant = Temporal.Now.instant().subtract({ hours: 1 });
 *
 * isPast(pastInstant); // true
 * ```
 *
 * @example
 * ```ts
 * // Works with any timezone
 * const pastInTokyo = Temporal.ZonedDateTime.from('1970-01-01T00:00:00+09:00[Asia/Tokyo]');
 *
 * isPast(pastInTokyo); // true
 * ```
 */
export function isPast(
  date: Temporal.Instant | Temporal.ZonedDateTime
): boolean {
  const zoned = normalizeTemporalInput(date);
  const nowInstant = Temporal.Now.instant();

  return Temporal.Instant.compare(zoned.toInstant(), nowInstant) < 0;
}
