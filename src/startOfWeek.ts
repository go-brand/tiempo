import type { Temporal } from '@js-temporal/polyfill';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';

/**
 * Returns a ZonedDateTime representing the first moment of the week (Monday at midnight).
 * Uses ISO 8601 week definition: weeks start on Monday.
 *
 * @param input - A Temporal.Instant (UTC) or Temporal.ZonedDateTime
 * @returns ZonedDateTime at Monday 00:00:00.000000000
 *
 * @example
 * ```ts
 * // From Instant (always UTC)
 * const instant = Temporal.Instant.from('2025-01-20T12:00:00Z'); // Monday
 * const start = startOfWeek(instant);
 * // 2025-01-20T00:00:00Z[UTC] (same day, it's already Monday)
 * ```
 *
 * @example
 * ```ts
 * // From ZonedDateTime (uses its timezone)
 * const zoned = Temporal.ZonedDateTime.from('2025-01-22T15:30:00-05:00[America/New_York]'); // Wednesday
 * const start = startOfWeek(zoned);
 * // 2025-01-20T00:00:00-05:00[America/New_York] (previous Monday)
 * ```
 *
 * @example
 * ```ts
 * // Need a different timezone? Convert first
 * const instant = Temporal.Instant.from('2025-01-22T12:00:00Z');
 * const nyTime = instant.toZonedDateTimeISO('America/New_York');
 * const start = startOfWeek(nyTime);
 * // 2025-01-20T00:00:00-05:00[America/New_York]
 * ```
 */
export function startOfWeek(
  input: Temporal.Instant | Temporal.ZonedDateTime
): Temporal.ZonedDateTime {
  const zonedDateTime = normalizeTemporalInput(input);

  // Get the day of week (1 = Monday, 7 = Sunday in ISO 8601)
  const dayOfWeek = zonedDateTime.dayOfWeek;

  // Calculate days to subtract to get to Monday
  const daysToSubtract = dayOfWeek - 1;

  // Go to Monday, then get start of that day
  const monday = zonedDateTime.subtract({ days: daysToSubtract });

  return monday.startOfDay();
}
