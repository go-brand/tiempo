import { Temporal } from '@js-temporal/polyfill';

/**
 * Returns true if the two plain times are equal.
 * Compares wall-clock times without date or timezone considerations.
 *
 * @param time1 - First plain time
 * @param time2 - Second plain time
 * @returns true if time1 equals time2, false otherwise
 *
 * @example
 * ```ts
 * const nineAM_a = Temporal.PlainTime.from('09:00');
 * const nineAM_b = Temporal.PlainTime.from('09:00');
 * const fivePM = Temporal.PlainTime.from('17:00');
 *
 * isPlainTimeEqual(nineAM_a, nineAM_b); // true
 * isPlainTimeEqual(nineAM_a, fivePM); // false
 * ```
 */
export function isPlainTimeEqual(
  time1: Temporal.PlainTime,
  time2: Temporal.PlainTime
): boolean {
  return Temporal.PlainTime.compare(time1, time2) === 0;
}
