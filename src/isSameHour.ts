import type { Temporal } from '@js-temporal/polyfill';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';

/**
 * Returns true if both datetimes fall in the same hour.
 * Compares the year, month, day, and hour fields directly.
 *
 * Instant inputs are converted to UTC. For ZonedDateTime inputs, their
 * timezone is preserved. Convert to a common timezone before calling if
 * you need to compare from a specific perspective.
 *
 * @param date1 - First datetime (Instant or ZonedDateTime)
 * @param date2 - Second datetime (Instant or ZonedDateTime)
 * @returns true if both dates are in the same hour, false otherwise
 *
 * @example
 * ```ts
 * // Same timezone, same hour
 * const start = Temporal.ZonedDateTime.from('2025-01-20T14:00:00Z[UTC]');
 * const end = Temporal.ZonedDateTime.from('2025-01-20T14:59:59.999Z[UTC]');
 *
 * isSameHour(start, end); // true
 * ```
 *
 * @example
 * ```ts
 * // Same timezone, different hours
 * const hour14 = Temporal.ZonedDateTime.from('2025-01-20T14:59:59Z[UTC]');
 * const hour15 = Temporal.ZonedDateTime.from('2025-01-20T15:00:00Z[UTC]');
 *
 * isSameHour(hour14, hour15); // false
 * ```
 *
 * @example
 * ```ts
 * // Different timezones - compares their local hours
 * const ny = Temporal.ZonedDateTime.from('2025-01-20T14:30:00-05:00[America/New_York]');
 * const tokyo = Temporal.ZonedDateTime.from('2025-01-21T04:30:00+09:00[Asia/Tokyo]');
 *
 * // Same instant, different local hours from each person's perspective
 * isSameHour(ny, tokyo); // false (14:xx in NY, 04:xx in Tokyo)
 *
 * // Convert to UTC to compare in UTC timezone
 * isSameHour(ny.withTimeZone('UTC'), tokyo.withTimeZone('UTC')); // true (both 19:xx in UTC)
 *
 * // Convert to NY timezone to compare from NY perspective
 * isSameHour(ny, tokyo.withTimeZone('America/New_York')); // true (both 14:xx in NY)
 * ```
 *
 * @example
 * ```ts
 * // Instant inputs are converted to UTC
 * const instant1 = Temporal.Instant.from('2025-01-20T14:15:30Z');
 * const instant2 = Temporal.Instant.from('2025-01-20T14:45:50Z');
 *
 * isSameHour(instant1, instant2); // true (both 14:xx in UTC)
 * ```
 */
export function isSameHour(
  date1: Temporal.Instant | Temporal.ZonedDateTime,
  date2: Temporal.Instant | Temporal.ZonedDateTime
): boolean {
  const zoned1 = normalizeTemporalInput(date1);
  const zoned2 = normalizeTemporalInput(date2);

  return (
    zoned1.year === zoned2.year &&
    zoned1.month === zoned2.month &&
    zoned1.day === zoned2.day &&
    zoned1.hour === zoned2.hour
  );
}
