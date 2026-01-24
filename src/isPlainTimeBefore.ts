import { Temporal } from '@js-temporal/polyfill';

/**
 * Returns true if the first plain time is before the second plain time.
 * Compares wall-clock times without date or timezone considerations.
 *
 * @param time1 - First plain time
 * @param time2 - Second plain time
 * @returns true if time1 is before time2, false otherwise
 *
 * @example
 * ```ts
 * const morning = Temporal.PlainTime.from('09:00');
 * const evening = Temporal.PlainTime.from('17:00');
 *
 * isPlainTimeBefore(morning, evening); // true
 * isPlainTimeBefore(evening, morning); // false
 * isPlainTimeBefore(morning, morning); // false
 * ```
 */
export function isPlainTimeBefore(
  time1: Temporal.PlainTime,
  time2: Temporal.PlainTime
): boolean {
  return Temporal.PlainTime.compare(time1, time2) < 0;
}
