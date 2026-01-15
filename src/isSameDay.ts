import { Temporal } from '@js-temporal/polyfill';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';

/**
 * Returns true if both datetimes fall on the same calendar day.
 * Compares the year, month, and day fields directly.
 *
 * Instant inputs are converted to UTC. For ZonedDateTime inputs, their
 * timezone is preserved. Convert to a common timezone before calling if
 * you need to compare from a specific perspective.
 *
 * @param date1 - First datetime (Instant or ZonedDateTime)
 * @param date2 - Second datetime (Instant or ZonedDateTime)
 * @returns true if both dates are on the same calendar day, false otherwise
 *
 * @example
 * ```ts
 * // Same timezone, same day
 * const morning = Temporal.ZonedDateTime.from('2025-01-20T08:00:00Z[UTC]');
 * const evening = Temporal.ZonedDateTime.from('2025-01-20T23:00:00Z[UTC]');
 *
 * isSameDay(morning, evening); // true
 * ```
 *
 * @example
 * ```ts
 * // Same timezone, different days
 * const today = Temporal.ZonedDateTime.from('2025-01-20T23:59:59Z[UTC]');
 * const tomorrow = Temporal.ZonedDateTime.from('2025-01-21T00:00:00Z[UTC]');
 *
 * isSameDay(today, tomorrow); // false
 * ```
 *
 * @example
 * ```ts
 * // Different timezones - compares their local calendar days
 * const ny = Temporal.ZonedDateTime.from('2025-01-20T23:00:00-05:00[America/New_York]');
 * const tokyo = Temporal.ZonedDateTime.from('2025-01-21T13:00:00+09:00[Asia/Tokyo]');
 *
 * // Same instant, different calendar days from each person's perspective
 * isSameDay(ny, tokyo); // false (Jan 20 in NY, Jan 21 in Tokyo)
 *
 * // Convert to UTC to compare in UTC timezone
 * isSameDay(ny.withTimeZone('UTC'), tokyo.withTimeZone('UTC')); // true (both Jan 21 in UTC)
 *
 * // Convert to NY timezone to compare from NY perspective
 * isSameDay(ny, tokyo.withTimeZone('America/New_York')); // true (both Jan 20 in NY)
 * ```
 *
 * @example
 * ```ts
 * // Instant inputs are converted to UTC
 * const instant1 = Temporal.Instant.from('2025-01-20T10:00:00Z');
 * const instant2 = Temporal.Instant.from('2025-01-20T23:00:00Z');
 *
 * isSameDay(instant1, instant2); // true (both Jan 20 in UTC)
 * ```
 */
export function isSameDay(
  date1: Temporal.Instant | Temporal.ZonedDateTime,
  date2: Temporal.Instant | Temporal.ZonedDateTime
): boolean {
  const zoned1 = normalizeTemporalInput(date1);
  const zoned2 = normalizeTemporalInput(date2);

  return (
    zoned1.year === zoned2.year &&
    zoned1.month === zoned2.month &&
    zoned1.day === zoned2.day
  );
}
