import type { Temporal } from '@js-temporal/polyfill';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';

/**
 * Options for rounding to nearest second.
 */
export interface RoundToNearestSecondOptions {
  /**
   * The rounding mode to use.
   *
   * Given time 14:37:42.300:
   * - `'round'` → 14:37:42 (300ms < 500, rounds DOWN to nearest)
   * - `'ceil'`  → 14:37:43 (always rounds UP to next second)
   * - `'floor'` → 14:37:42 (always rounds DOWN to current second)
   *
   * Given time 14:37:42 with nearestTo: 10:
   * - `'round'` → 14:37:40 (42 is closer to 40 than 50)
   * - `'ceil'`  → 14:37:50 (always rounds UP to next 10-sec mark)
   * - `'floor'` → 14:37:40 (always rounds DOWN to current 10-sec mark)
   *
   * @default 'round'
   */
  mode?: 'round' | 'ceil' | 'floor';
  /**
   * Round to the nearest N seconds. Must divide evenly into 60.
   * Valid values: 1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30
   * @example nearestTo: 10 rounds to 10-second marks (00, 10, 20, 30, 40, 50)
   */
  nearestTo?: 1 | 2 | 3 | 4 | 5 | 6 | 10 | 12 | 15 | 20 | 30;
}

const MODE_TO_ROUNDING_MODE = {
  round: 'halfExpand',
  ceil: 'ceil',
  floor: 'floor',
} as const;

/**
 * Rounds a datetime to the nearest second boundary.
 *
 * ## Mode comparison (given 14:37:42.567)
 *
 * ```
 * :42 ─────────────────●─────────────── :43
 *                    .567
 *
 * 'round' → :43  (nearest second - 567ms >= 500)
 * 'ceil'  → :43  (next second - always up)
 * 'floor' → :42  (current second - always down)
 * ```
 *
 * @param input - A Temporal.Instant (UTC) or Temporal.ZonedDateTime
 * @param options - Rounding options
 * @returns ZonedDateTime rounded to the second boundary
 *
 * @example
 * ```ts
 * const time = Temporal.ZonedDateTime.from('2025-01-20T14:37:42.567[America/New_York]');
 *
 * roundToNearestSecond(time);                     // → 14:37:43 (567ms >= 500)
 * roundToNearestSecond(time, { mode: 'ceil' });   // → 14:37:43 (always up)
 * roundToNearestSecond(time, { mode: 'floor' });  // → 14:37:42 (always down)
 * ```
 *
 * @example
 * ```ts
 * // 10-second intervals
 * const time = Temporal.ZonedDateTime.from('2025-01-20T14:37:42[America/New_York]');
 *
 * roundToNearestSecond(time, { nearestTo: 10 });                   // → 14:37:40 (nearest)
 * roundToNearestSecond(time, { mode: 'ceil', nearestTo: 10 });     // → 14:37:50 (next 10s)
 * roundToNearestSecond(time, { mode: 'floor', nearestTo: 10 });    // → 14:37:40 (current 10s)
 * ```
 *
 * @example
 * ```ts
 * // Remove sub-second precision for logging
 * const logTime = Temporal.ZonedDateTime.from('2025-01-20T14:37:42.123456789[UTC]');
 * roundToNearestSecond(logTime, { mode: 'floor' });
 * // → 14:37:42.000000000 (clean timestamp)
 * ```
 */
export function roundToNearestSecond(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  options?: RoundToNearestSecondOptions
): Temporal.ZonedDateTime {
  const zonedDateTime = normalizeTemporalInput(input);
  const mode = options?.mode ?? 'round';
  const nearestTo = options?.nearestTo ?? 1;

  return zonedDateTime.round({
    smallestUnit: 'second',
    roundingMode: MODE_TO_ROUNDING_MODE[mode],
    roundingIncrement: nearestTo,
  });
}
