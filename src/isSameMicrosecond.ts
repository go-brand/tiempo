import type { Temporal } from '@js-temporal/polyfill';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';

/**
 * Returns true if both datetimes fall in the same microsecond.
 * Compares the year, month, day, hour, minute, second, millisecond, and microsecond fields directly.
 * Ignores sub-microsecond precision (nanoseconds).
 *
 * Instant inputs are converted to UTC. For ZonedDateTime inputs, their
 * timezone is preserved. Convert to a common timezone before calling if
 * you need to compare from a specific perspective.
 *
 * @param date1 - First datetime (Instant or ZonedDateTime)
 * @param date2 - Second datetime (Instant or ZonedDateTime)
 * @returns true if both dates are in the same microsecond, false otherwise
 *
 * @example
 * ```ts
 * // Same timezone, same microsecond
 * const time1 = Temporal.ZonedDateTime.from('2025-01-20T14:30:45.123456Z[UTC]');
 * const time2 = Temporal.ZonedDateTime.from('2025-01-20T14:30:45.123456999Z[UTC]');
 *
 * isSameMicrosecond(time1, time2); // true
 * ```
 *
 * @example
 * ```ts
 * // Same timezone, different microseconds
 * const us456 = Temporal.ZonedDateTime.from('2025-01-20T14:30:45.123456Z[UTC]');
 * const us457 = Temporal.ZonedDateTime.from('2025-01-20T14:30:45.123457Z[UTC]');
 *
 * isSameMicrosecond(us456, us457); // false
 * ```
 *
 * @example
 * ```ts
 * // Different timezones - compares their local microseconds
 * const ny = Temporal.ZonedDateTime.from('2025-01-20T14:30:45.123456-05:00[America/New_York]');
 * const tokyo = Temporal.ZonedDateTime.from('2025-01-21T04:30:45.987654+09:00[Asia/Tokyo]');
 *
 * // Same instant, different local microseconds from each person's perspective
 * isSameMicrosecond(ny, tokyo); // false (14:30:45.123456 in NY, 04:30:45.987654 in Tokyo)
 *
 * // Convert to UTC to compare in UTC timezone
 * isSameMicrosecond(ny.withTimeZone('UTC'), tokyo.withTimeZone('UTC')); // true (both 19:30:45.123456 in UTC)
 *
 * // Convert to NY timezone to compare from NY perspective
 * isSameMicrosecond(ny, tokyo.withTimeZone('America/New_York')); // true (both 14:30:45.123456 in NY)
 * ```
 *
 * @example
 * ```ts
 * // Instant inputs are converted to UTC
 * const instant1 = Temporal.Instant.from('2025-01-20T14:30:45.123456789Z');
 * const instant2 = Temporal.Instant.from('2025-01-20T14:30:45.123456999Z');
 *
 * isSameMicrosecond(instant1, instant2); // true (both 14:30:45.123456 in UTC)
 * ```
 */
export function isSameMicrosecond(
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
    zoned1.millisecond === zoned2.millisecond &&
    zoned1.microsecond === zoned2.microsecond
  );
}
