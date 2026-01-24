import { Temporal } from '@js-temporal/polyfill';

/**
 * Returns true if the first plain time is after the second plain time.
 * Compares wall-clock times without date or timezone considerations.
 *
 * @param time1 - First plain time
 * @param time2 - Second plain time
 * @returns true if time1 is after time2, false otherwise
 *
 * @example
 * ```ts
 * const morning = Temporal.PlainTime.from('09:00');
 * const evening = Temporal.PlainTime.from('17:00');
 *
 * isPlainTimeAfter(evening, morning); // true
 * isPlainTimeAfter(morning, evening); // false
 * isPlainTimeAfter(morning, morning); // false
 * ```
 */
export function isPlainTimeAfter(
  time1: Temporal.PlainTime,
  time2: Temporal.PlainTime
): boolean {
  return Temporal.PlainTime.compare(time1, time2) > 0;
}
