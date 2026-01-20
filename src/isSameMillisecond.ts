import type { Temporal } from '@js-temporal/polyfill';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';

/**
 * Returns true if both datetimes fall in the same millisecond.
 * Compares the year, month, day, hour, minute, second, and millisecond fields directly.
 * Ignores sub-millisecond precision (microseconds, nanoseconds).
 *
 * Instant inputs are converted to UTC. For ZonedDateTime inputs, their
 * timezone is preserved. Convert to a common timezone before calling if
 * you need to compare from a specific perspective.
 *
 * @param date1 - First datetime (Instant or ZonedDateTime)
 * @param date2 - Second datetime (Instant or ZonedDateTime)
 * @returns true if both dates are in the same millisecond, false otherwise
 *
 * @example
 * ```ts
 * // Same timezone, same millisecond
 * const time1 = Temporal.ZonedDateTime.from('2025-01-20T14:30:45.123Z[UTC]');
 * const time2 = Temporal.ZonedDateTime.from('2025-01-20T14:30:45.123999Z[UTC]');
 *
 * isSameMillisecond(time1, time2); // true
 * ```
 *
 * @example
 * ```ts
 * // Same timezone, different milliseconds
 * const ms123 = Temporal.ZonedDateTime.from('2025-01-20T14:30:45.123Z[UTC]');
 * const ms124 = Temporal.ZonedDateTime.from('2025-01-20T14:30:45.124Z[UTC]');
 *
 * isSameMillisecond(ms123, ms124); // false
 * ```
 *
 * @example
 * ```ts
 * // Different timezones - compares their local milliseconds
 * const ny = Temporal.ZonedDateTime.from('2025-01-20T14:30:45.123-05:00[America/New_York]');
 * const tokyo = Temporal.ZonedDateTime.from('2025-01-21T04:30:45.987+09:00[Asia/Tokyo]');
 *
 * // Same instant, different local milliseconds from each person's perspective
 * isSameMillisecond(ny, tokyo); // false (14:30:45.123 in NY, 04:30:45.987 in Tokyo)
 *
 * // Convert to UTC to compare in UTC timezone
 * isSameMillisecond(ny.withTimeZone('UTC'), tokyo.withTimeZone('UTC')); // true (both 19:30:45.123 in UTC)
 *
 * // Convert to NY timezone to compare from NY perspective
 * isSameMillisecond(ny, tokyo.withTimeZone('America/New_York')); // true (both 14:30:45.123 in NY)
 * ```
 *
 * @example
 * ```ts
 * // Instant inputs are converted to UTC
 * const instant1 = Temporal.Instant.from('2025-01-20T14:30:45.123456Z');
 * const instant2 = Temporal.Instant.from('2025-01-20T14:30:45.123999Z');
 *
 * isSameMillisecond(instant1, instant2); // true (both 14:30:45.123 in UTC)
 * ```
 */
export function isSameMillisecond(
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
    zoned1.second === zoned2.second &&
    zoned1.millisecond === zoned2.millisecond
  );
}
