import type{ Temporal } from '@js-temporal/polyfill';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';

/**
 * Returns true if both datetimes fall in the same ISO 8601 week.
 * Uses ISO week numbering where weeks start on Monday and the first week
 * of the year is the week containing January 4th.
 *
 * Compares the yearOfWeek and weekOfYear fields directly.
 *
 * Instant inputs are converted to UTC. For ZonedDateTime inputs, their
 * timezone is preserved. Convert to a common timezone before calling if
 * you need to compare from a specific perspective.
 *
 * @param date1 - First datetime (Instant or ZonedDateTime)
 * @param date2 - Second datetime (Instant or ZonedDateTime)
 * @returns true if both dates are in the same ISO week, false otherwise
 *
 * @example
 * ```ts
 * // Same timezone, same week (both in week 4 of 2025)
 * const monday = Temporal.ZonedDateTime.from('2025-01-20T08:00:00Z[UTC]'); // Monday, Week 4
 * const sunday = Temporal.ZonedDateTime.from('2025-01-26T23:59:59Z[UTC]'); // Sunday, Week 4
 *
 * isSameWeek(monday, sunday); // true
 * ```
 *
 * @example
 * ```ts
 * // Same timezone, different weeks
 * const week3 = Temporal.ZonedDateTime.from('2025-01-19T23:59:59Z[UTC]'); // Sunday, Week 3
 * const week4 = Temporal.ZonedDateTime.from('2025-01-20T00:00:00Z[UTC]'); // Monday, Week 4
 *
 * isSameWeek(week3, week4); // false
 * ```
 *
 * @example
 * ```ts
 * // Different timezones - compares their local calendar weeks
 * const ny = Temporal.ZonedDateTime.from('2025-01-26T23:00:00-05:00[America/New_York]');
 * const tokyo = Temporal.ZonedDateTime.from('2025-01-27T13:00:00+09:00[Asia/Tokyo]');
 *
 * // Same instant, different local weeks from each person's perspective
 * isSameWeek(ny, tokyo); // false (Week 4 Sun in NY, Week 5 Mon in Tokyo)
 *
 * // Convert to UTC to compare in UTC timezone
 * isSameWeek(ny.withTimeZone('UTC'), tokyo.withTimeZone('UTC')); // true (both Week 5 in UTC)
 *
 * // Convert to NY timezone to compare from NY perspective
 * isSameWeek(ny, tokyo.withTimeZone('America/New_York')); // true (both Week 4 in NY)
 * ```
 *
 * @example
 * ```ts
 * // Instant inputs are converted to UTC
 * const instant1 = Temporal.Instant.from('2025-01-20T00:00:00Z'); // Monday, Week 4
 * const instant2 = Temporal.Instant.from('2025-01-26T23:59:59Z'); // Sunday, Week 4
 *
 * isSameWeek(instant1, instant2); // true (both Week 4 2025 in UTC)
 * ```
 *
 * @example
 * ```ts
 * // ISO week years can differ from calendar years
 * // December 29, 2024 is in Week 52 of 2024
 * const dec29 = Temporal.ZonedDateTime.from('2024-12-29T12:00:00Z[UTC]');
 * // January 5, 2025 is in Week 1 of 2025
 * const jan5 = Temporal.ZonedDateTime.from('2025-01-05T12:00:00Z[UTC]');
 *
 * isSameWeek(dec29, jan5); // false (different ISO weeks)
 * ```
 */
export function isSameWeek(
  date1: Temporal.Instant | Temporal.ZonedDateTime,
  date2: Temporal.Instant | Temporal.ZonedDateTime
): boolean {
  const zoned1 = normalizeTemporalInput(date1);
  const zoned2 = normalizeTemporalInput(date2);

  return (
    zoned1.yearOfWeek === zoned2.yearOfWeek &&
    zoned1.weekOfYear === zoned2.weekOfYear
  );
}
