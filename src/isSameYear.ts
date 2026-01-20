import type{ Temporal } from '@js-temporal/polyfill';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';

/**
 * Returns true if both datetimes fall in the same calendar year.
 * Compares the year field directly.
 *
 * Instant inputs are converted to UTC. For ZonedDateTime inputs, their
 * timezone is preserved. Convert to a common timezone before calling if
 * you need to compare from a specific perspective.
 *
 * @param date1 - First datetime (Instant or ZonedDateTime)
 * @param date2 - Second datetime (Instant or ZonedDateTime)
 * @returns true if both dates are in the same calendar year, false otherwise
 *
 * @example
 * ```ts
 * // Same timezone, same year
 * const jan = Temporal.ZonedDateTime.from('2025-01-20T08:00:00Z[UTC]');
 * const dec = Temporal.ZonedDateTime.from('2025-12-31T23:59:59Z[UTC]');
 *
 * isSameYear(jan, dec); // true
 * ```
 *
 * @example
 * ```ts
 * // Same timezone, different years
 * const endOf2024 = Temporal.ZonedDateTime.from('2024-12-31T23:59:59Z[UTC]');
 * const startOf2025 = Temporal.ZonedDateTime.from('2025-01-01T00:00:00Z[UTC]');
 *
 * isSameYear(endOf2024, startOf2025); // false
 * ```
 *
 * @example
 * ```ts
 * // Different timezones - compares their local calendar years
 * const ny = Temporal.ZonedDateTime.from('2024-12-31T23:00:00-05:00[America/New_York]');
 * const tokyo = Temporal.ZonedDateTime.from('2025-01-01T13:00:00+09:00[Asia/Tokyo]');
 *
 * // Same instant, different calendar years from each person's perspective
 * isSameYear(ny, tokyo); // false (2024 in NY, 2025 in Tokyo)
 *
 * // Convert to UTC to compare in UTC timezone
 * isSameYear(ny.withTimeZone('UTC'), tokyo.withTimeZone('UTC')); // true (both 2025 in UTC)
 *
 * // Convert to NY timezone to compare from NY perspective
 * isSameYear(ny, tokyo.withTimeZone('America/New_York')); // true (both 2024 in NY)
 * ```
 *
 * @example
 * ```ts
 * // Instant inputs are converted to UTC
 * const instant1 = Temporal.Instant.from('2025-01-01T00:00:00Z');
 * const instant2 = Temporal.Instant.from('2025-12-31T23:59:59Z');
 *
 * isSameYear(instant1, instant2); // true (both 2025 in UTC)
 * ```
 */
export function isSameYear(
  date1: Temporal.Instant | Temporal.ZonedDateTime,
  date2: Temporal.Instant | Temporal.ZonedDateTime
): boolean {
  const zoned1 = normalizeTemporalInput(date1);
  const zoned2 = normalizeTemporalInput(date2);

  return zoned1.year === zoned2.year;
}
