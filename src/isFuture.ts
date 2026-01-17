import { Temporal } from '@js-temporal/polyfill';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';

/**
 * Returns true if the given datetime is in the future.
 * Compares by the underlying instant (epoch time) against the current time.
 *
 * @param date - Datetime to check (Instant or ZonedDateTime)
 * @returns true if date is after the current instant, false otherwise
 *
 * @example
 * ```ts
 * const tomorrow = Temporal.Now.zonedDateTimeISO().add({ days: 1 });
 * const yesterday = Temporal.Now.zonedDateTimeISO().subtract({ days: 1 });
 *
 * isFuture(tomorrow); // true
 * isFuture(yesterday); // false
 * ```
 *
 * @example
 * ```ts
 * // Works with Instant too
 * const futureInstant = Temporal.Now.instant().add({ hours: 1 });
 *
 * isFuture(futureInstant); // true
 * ```
 *
 * @example
 * ```ts
 * // Works with any timezone
 * const futureInTokyo = Temporal.ZonedDateTime.from('2100-01-01T00:00:00+09:00[Asia/Tokyo]');
 *
 * isFuture(futureInTokyo); // true
 * ```
 */
export function isFuture(
  date: Temporal.Instant | Temporal.ZonedDateTime
): boolean {
  const zoned = normalizeTemporalInput(date);
  const nowInstant = Temporal.Now.instant();

  return Temporal.Instant.compare(zoned.toInstant(), nowInstant) > 0;
}
