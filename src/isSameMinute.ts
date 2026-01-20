import type{ Temporal } from '@js-temporal/polyfill';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';

/**
 * Returns true if both datetimes fall in the same minute.
 * Compares the year, month, day, hour, and minute fields directly.
 *
 * Instant inputs are converted to UTC. For ZonedDateTime inputs, their
 * timezone is preserved. Convert to a common timezone before calling if
 * you need to compare from a specific perspective.
 *
 * @param date1 - First datetime (Instant or ZonedDateTime)
 * @param date2 - Second datetime (Instant or ZonedDateTime)
 * @returns true if both dates are in the same minute, false otherwise
 *
 * @example
 * ```ts
 * // Same timezone, same minute
 * const start = Temporal.ZonedDateTime.from('2025-01-20T14:30:00Z[UTC]');
 * const end = Temporal.ZonedDateTime.from('2025-01-20T14:30:59.999Z[UTC]');
 *
 * isSameMinute(start, end); // true
 * ```
 *
 * @example
 * ```ts
 * // Same timezone, different minutes
 * const min30 = Temporal.ZonedDateTime.from('2025-01-20T14:30:59Z[UTC]');
 * const min31 = Temporal.ZonedDateTime.from('2025-01-20T14:31:00Z[UTC]');
 *
 * isSameMinute(min30, min31); // false
 * ```
 *
 * @example
 * ```ts
 * // Different timezones - compares their local minutes
 * const ny = Temporal.ZonedDateTime.from('2025-01-20T14:30:45-05:00[America/New_York]');
 * const tokyo = Temporal.ZonedDateTime.from('2025-01-21T04:30:45+09:00[Asia/Tokyo]');
 *
 * // Same instant, different local minutes from each person's perspective
 * isSameMinute(ny, tokyo); // false (14:30:xx in NY, 04:30:xx in Tokyo)
 *
 * // Convert to UTC to compare in UTC timezone
 * isSameMinute(ny.withTimeZone('UTC'), tokyo.withTimeZone('UTC')); // true (both 19:30:xx in UTC)
 *
 * // Convert to NY timezone to compare from NY perspective
 * isSameMinute(ny, tokyo.withTimeZone('America/New_York')); // true (both 14:30:xx in NY)
 * ```
 *
 * @example
 * ```ts
 * // Instant inputs are converted to UTC
 * const instant1 = Temporal.Instant.from('2025-01-20T14:30:15Z');
 * const instant2 = Temporal.Instant.from('2025-01-20T14:30:45Z');
 *
 * isSameMinute(instant1, instant2); // true (both 14:30:xx in UTC)
 * ```
 */
export function isSameMinute(
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
    zoned1.minute === zoned2.minute
  );
}
