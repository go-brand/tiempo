import { Temporal } from '@js-temporal/polyfill';

export type IsoMode = 'utc' | 'offset';

export interface ToIsoOptions {
  /**
   * Output mode for time zone designator.
   * - 'utc' (default): UTC time with Z suffix
   * - 'offset': local time with offset suffix
   */
  mode?: IsoMode;
}

/**
 * Convert a Temporal.Instant to a UTC ISO 8601 string.
 */
export function toIso(input: Temporal.Instant): string;

/**
 * Convert a Temporal.ZonedDateTime to an ISO 8601 string.
 *
 * @param input - A Temporal.ZonedDateTime
 * @param options - Output options
 *
 * @example
 * ```typescript
 * const zoned = Temporal.ZonedDateTime.from("2025-01-20T15:00:00-05:00[America/New_York]");
 *
 * toIso(zoned);                    // "2025-01-20T20:00:00Z"
 * toIso(zoned, { mode: 'utc' });   // "2025-01-20T20:00:00Z"
 * toIso(zoned, { mode: 'offset' }); // "2025-01-20T15:00:00-05:00"
 * ```
 */
export function toIso(
  input: Temporal.ZonedDateTime,
  options?: ToIsoOptions
): string;

export function toIso(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  options: ToIsoOptions = {}
): string {
  const { mode = 'utc' } = options;

  if (input instanceof Temporal.Instant) {
    return input.toString();
  }

  if (mode === 'offset') {
    return input.toString({ timeZoneName: 'never' });
  }

  return input.toInstant().toString();
}
