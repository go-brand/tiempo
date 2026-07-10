import { Temporal, isInstant } from './shared/temporal';

/**
 * Converts a timeline representation to a Temporal.Instant.
 *
 * Instant inputs are returned unchanged. ZonedDateTime inputs preserve their
 * exact moment while dropping timezone and calendar context.
 *
 * @param input - An Instant, ZonedDateTime, UTC ISO string, Unix timestamp, or Date
 * @returns A timezone-independent Temporal.Instant
 *
 * @example
 * ```typescript
 * const instant = toInstant('2025-01-20T20:00:00Z');
 * // 2025-01-20T20:00:00Z
 * ```
 *
 * @example
 * ```typescript
 * const zoned = Temporal.ZonedDateTime.from(
 *   '2025-01-20T15:00:00-05:00[America/New_York]'
 * );
 * const instant = toInstant(zoned);
 * // 2025-01-20T20:00:00Z
 * ```
 */
export function toInstant(
  input: string | number | Date | Temporal.Instant | Temporal.ZonedDateTime
): Temporal.Instant {
  if (typeof input === 'string') {
    return Temporal.Instant.from(input);
  }

  if (typeof input === 'number') {
    return Temporal.Instant.fromEpochMilliseconds(input);
  }

  if (input instanceof Date) {
    return Temporal.Instant.from(input.toISOString());
  }

  return isInstant(input) ? input : input.toInstant();
}
