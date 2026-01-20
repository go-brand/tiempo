import type{ Temporal } from '@js-temporal/polyfill';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';

/**
 * Returns true if both datetimes fall in the same second.
 * Compares the year, month, day, hour, minute, and second fields directly.
 * Ignores sub-second precision (milliseconds, microseconds, nanoseconds).
 *
 * Instant inputs are converted to UTC. For ZonedDateTime inputs, their
 * timezone is preserved. Convert to a common timezone before calling if
 * you need to compare from a specific perspective.
 *
 * @param date1 - First datetime (Instant or ZonedDateTime)
 * @param date2 - Second datetime (Instant or ZonedDateTime)
 * @returns true if both dates are in the same second, false otherwise
 *
 * @example
 * ```ts
 * // Same timezone, same second
 * const time1 = Temporal.ZonedDateTime.from('2025-01-20T14:30:45.000Z[UTC]');
 * const time2 = Temporal.ZonedDateTime.from('2025-01-20T14:30:45.999Z[UTC]');
 *
 * isSameSecond(time1, time2); // true
 * ```
 *
 * @example
 * ```ts
 * // Same timezone, different seconds
 * const sec45 = Temporal.ZonedDateTime.from('2025-01-20T14:30:45Z[UTC]');
 * const sec46 = Temporal.ZonedDateTime.from('2025-01-20T14:30:46Z[UTC]');
 *
 * isSameSecond(sec45, sec46); // false
 * ```
 *
 * @example
 * ```ts
 * // Different timezones - compares their local seconds
 * const ny = Temporal.ZonedDateTime.from('2025-01-20T14:30:45.123-05:00[America/New_York]');
 * const tokyo = Temporal.ZonedDateTime.from('2025-01-21T04:30:45.987+09:00[Asia/Tokyo]');
 *
 * // Same instant, different local seconds from each person's perspective
 * isSameSecond(ny, tokyo); // false (14:30:45 in NY, 04:30:45 in Tokyo)
 *
 * // Convert to UTC to compare in UTC timezone
 * isSameSecond(ny.withTimeZone('UTC'), tokyo.withTimeZone('UTC')); // true (both 19:30:45 in UTC)
 *
 * // Convert to NY timezone to compare from NY perspective
 * isSameSecond(ny, tokyo.withTimeZone('America/New_York')); // true (both 14:30:45 in NY)
 * ```
 *
 * @example
 * ```ts
 * // Instant inputs are converted to UTC
 * const instant1 = Temporal.Instant.from('2025-01-20T14:30:45.123Z');
 * const instant2 = Temporal.Instant.from('2025-01-20T14:30:45.999Z');
 *
 * isSameSecond(instant1, instant2); // true (both 14:30:45 in UTC)
 * ```
 */
export function isSameSecond(
  date1: Temporal.Instant | Temporal.ZonedDateTime,
  date2: Temporal.Instant | Temporal.ZonedDateTime
): boolean {
  const zoned1 = normalizeTemporalInput(date1);
  const zoned2 = normalizeTemporalInput(date2);

  return (
    zoned1.year === zoned2.year &&
    zoned1.month === zoned2.month &&
    zoned1.day === zoned2.day &&
    zoned1.hour === zoned2.hour &&
    zoned1.minute === zoned2.minute &&
    zoned1.second === zoned2.second
  );
}
