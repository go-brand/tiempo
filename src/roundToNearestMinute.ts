import type { Temporal } from '@js-temporal/polyfill';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';

/**
 * Options for rounding to nearest minute.
 */
export interface RoundToNearestMinuteOptions {
  /**
   * The rounding mode to use.
   *
   * Given time 14:37:20:
   * - `'round'` → 14:37 (20 sec < 30, rounds DOWN to nearest)
   * - `'ceil'`  → 14:38 (always rounds UP to next minute)
   * - `'floor'` → 14:37 (always rounds DOWN to current minute)
   *
   * Given time 14:37:00 with nearestTo: 15:
   * - `'round'` → 14:30 (37 is closer to 30 than 45)
   * - `'ceil'`  → 14:45 (always rounds UP to next 15-min slot)
   * - `'floor'` → 14:30 (always rounds DOWN to current 15-min slot)
   *
   * @default 'round'
   */
  mode?: 'round' | 'ceil' | 'floor';
  /**
   * Round to the nearest N minutes. Must divide evenly into 60.
   * Valid values: 1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30
   * @example nearestTo: 15 rounds to quarter-hour marks (00, 15, 30, 45)
   */
  nearestTo?: 1 | 2 | 3 | 4 | 5 | 6 | 10 | 12 | 15 | 20 | 30;
}

const MODE_TO_ROUNDING_MODE = {
  round: 'halfExpand',
  ceil: 'ceil',
  floor: 'floor',
} as const;

/**
 * Rounds a datetime to the nearest minute boundary.
 *
 * ## Mode comparison (given 14:37 with 15-min slots)
 *
 * ```
 * 14:30 ─────────●───────────────────── 14:45
 *              14:37
 *
 * 'round' → 14:30  (nearest slot - 37 is closer to 30 than 45)
 * 'ceil'  → 14:45  (next slot - always up)
 * 'floor' → 14:30  (current slot - always down)
 * ```
 *
 * @param input - A Temporal.Instant (UTC) or Temporal.ZonedDateTime
 * @param options - Rounding options
 * @returns ZonedDateTime rounded to the minute boundary
 *
 * @example
 * ```ts
 * // 15-minute booking slots at 14:37
 * const time = Temporal.ZonedDateTime.from('2025-01-20T14:37:00[America/New_York]');
 *
 * roundToNearestMinute(time, { nearestTo: 15 });                    // → 14:30 (nearest)
 * roundToNearestMinute(time, { mode: 'ceil', nearestTo: 15 });      // → 14:45 (next slot)
 * roundToNearestMinute(time, { mode: 'floor', nearestTo: 15 });     // → 14:30 (current slot)
 * ```
 *
 * @example
 * ```ts
 * // Basic minute rounding (no slots)
 * const time = Temporal.ZonedDateTime.from('2025-01-20T14:37:42[America/New_York]');
 *
 * roundToNearestMinute(time);                     // → 14:38 (42 sec >= 30)
 * roundToNearestMinute(time, { mode: 'ceil' });   // → 14:38 (always up)
 * roundToNearestMinute(time, { mode: 'floor' });  // → 14:37 (always down)
 * ```
 *
 * @example
 * ```ts
 * // Billing: round up to 30-minute increments
 * const sessionEnd = Temporal.ZonedDateTime.from('2025-01-20T11:07:00[America/New_York]');
 * roundToNearestMinute(sessionEnd, { mode: 'ceil', nearestTo: 30 });
 * // → 11:30 (bill for 30 mins even though session was 7 mins)
 * ```
 */
export function roundToNearestMinute(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  options?: RoundToNearestMinuteOptions
): Temporal.ZonedDateTime {
  const zonedDateTime = normalizeTemporalInput(input);
  const mode = options?.mode ?? 'round';
  const nearestTo = options?.nearestTo ?? 1;

  return zonedDateTime.round({
    smallestUnit: 'minute',
    roundingMode: MODE_TO_ROUNDING_MODE[mode],
    roundingIncrement: nearestTo,
  });
}
