import type{ Temporal } from '@js-temporal/polyfill';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';

/**
 * Returns true if both datetimes fall in the same calendar month and year.
 * Compares the year and month fields directly.
 *
 * Instant inputs are converted to UTC. For ZonedDateTime inputs, their
 * timezone is preserved. Convert to a common timezone before calling if
 * you need to compare from a specific perspective.
 *
 * @param date1 - First datetime (Instant or ZonedDateTime)
 * @param date2 - Second datetime (Instant or ZonedDateTime)
 * @returns true if both dates are in the same calendar month, false otherwise
 *
 * @example
 * ```ts
 * // Same timezone, same month
 * const start = Temporal.ZonedDateTime.from('2025-01-01T08:00:00Z[UTC]');
 * const end = Temporal.ZonedDateTime.from('2025-01-31T23:59:59Z[UTC]');
 *
 * isSameMonth(start, end); // true
 * ```
 *
 * @example
 * ```ts
 * // Same timezone, different months
 * const jan = Temporal.ZonedDateTime.from('2025-01-31T23:59:59Z[UTC]');
 * const feb = Temporal.ZonedDateTime.from('2025-02-01T00:00:00Z[UTC]');
 *
 * isSameMonth(jan, feb); // false
 * ```
 *
 * @example
 * ```ts
 * // Different timezones - compares their local calendar months
 * const ny = Temporal.ZonedDateTime.from('2025-01-31T23:00:00-05:00[America/New_York]');
 * const tokyo = Temporal.ZonedDateTime.from('2025-02-01T13:00:00+09:00[Asia/Tokyo]');
 *
 * // Same instant, different calendar months from each person's perspective
 * isSameMonth(ny, tokyo); // false (Jan in NY, Feb in Tokyo)
 *
 * // Convert to UTC to compare in UTC timezone
 * isSameMonth(ny.withTimeZone('UTC'), tokyo.withTimeZone('UTC')); // true (both Feb in UTC)
 *
 * // Convert to NY timezone to compare from NY perspective
 * isSameMonth(ny, tokyo.withTimeZone('America/New_York')); // true (both Jan in NY)
 * ```
 *
 * @example
 * ```ts
 * // Instant inputs are converted to UTC
 * const instant1 = Temporal.Instant.from('2025-01-01T00:00:00Z');
 * const instant2 = Temporal.Instant.from('2025-01-31T23:59:59Z');
 *
 * isSameMonth(instant1, instant2); // true (both Jan 2025 in UTC)
 * ```
 */
export function isSameMonth(
  date1: Temporal.Instant | Temporal.ZonedDateTime,
  date2: Temporal.Instant | Temporal.ZonedDateTime
): boolean {
  const zoned1 = normalizeTemporalInput(date1);
  const zoned2 = normalizeTemporalInput(date2);

  return zoned1.year === zoned2.year && zoned1.month === zoned2.month;
}
