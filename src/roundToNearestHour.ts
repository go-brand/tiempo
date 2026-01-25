import type { Temporal } from '@js-temporal/polyfill';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';

/**
 * Options for rounding to nearest hour.
 */
export interface RoundToNearestHourOptions {
  /**
   * The rounding mode to use.
   *
   * Given time 14:20:
   * - `'round'` → 14:00 (20 min < 30, rounds DOWN to nearest)
   * - `'ceil'`  → 15:00 (always rounds UP to next hour)
   * - `'floor'` → 14:00 (always rounds DOWN to current hour)
   *
   * Given time 14:40:
   * - `'round'` → 15:00 (40 min >= 30, rounds UP to nearest)
   * - `'ceil'`  → 15:00 (always rounds UP to next hour)
   * - `'floor'` → 14:00 (always rounds DOWN to current hour)
   *
   * @default 'round'
   */
  mode?: 'round' | 'ceil' | 'floor';
  /**
   * Round to the nearest N hours. Must divide evenly into 24.
   * Valid values: 1, 2, 3, 4, 6, 8, 12
   * @example nearestTo: 6 rounds to 00:00, 06:00, 12:00, or 18:00
   */
  nearestTo?: 1 | 2 | 3 | 4 | 6 | 8 | 12;
}

const MODE_TO_ROUNDING_MODE = {
  round: 'halfExpand',
  ceil: 'ceil',
  floor: 'floor',
} as const;

/**
 * Rounds a datetime to the nearest hour boundary.
 *
 * ## Mode comparison (given 14:20)
 *
 * ```
 * 14:00 ─────────────●───────────────── 15:00
 *                  14:20
 *
 * 'round' → 14:00  (nearest hour - 20 min < 30)
 * 'ceil'  → 15:00  (next hour - always up)
 * 'floor' → 14:00  (current hour - always down)
 * ```
 *
 * @param input - A Temporal.Instant (UTC) or Temporal.ZonedDateTime
 * @param options - Rounding options
 * @returns ZonedDateTime rounded to the hour boundary
 *
 * @example
 * ```ts
 * const time = Temporal.ZonedDateTime.from('2025-01-20T14:20:00[America/New_York]');
 *
 * roundToNearestHour(time);                     // → 14:00 (nearest)
 * roundToNearestHour(time, { mode: 'ceil' });   // → 15:00 (always up)
 * roundToNearestHour(time, { mode: 'floor' });  // → 14:00 (always down)
 * ```
 *
 * @example
 * ```ts
 * // With 37 minutes (past the halfway point)
 * const time = Temporal.ZonedDateTime.from('2025-01-20T14:37:00[America/New_York]');
 *
 * roundToNearestHour(time);                     // → 15:00 (nearest - 37 >= 30)
 * roundToNearestHour(time, { mode: 'ceil' });   // → 15:00 (always up)
 * roundToNearestHour(time, { mode: 'floor' });  // → 14:00 (always down)
 * ```
 *
 * @example
 * ```ts
 * // Round to 6-hour blocks (shift scheduling)
 * const time = Temporal.ZonedDateTime.from('2025-01-20T14:00:00[America/New_York]');
 *
 * roundToNearestHour(time, { nearestTo: 6 });                    // → 12:00
 * roundToNearestHour(time, { mode: 'ceil', nearestTo: 6 });      // → 18:00
 * roundToNearestHour(time, { mode: 'floor', nearestTo: 6 });     // → 12:00
 * ```
 */
export function roundToNearestHour(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  options?: RoundToNearestHourOptions
): Temporal.ZonedDateTime {
  const zonedDateTime = normalizeTemporalInput(input);
  const mode = options?.mode ?? 'round';
  const nearestTo = options?.nearestTo ?? 1;

  return zonedDateTime.round({
    smallestUnit: 'hour',
    roundingMode: MODE_TO_ROUNDING_MODE[mode],
    roundingIncrement: nearestTo,
  });
}
