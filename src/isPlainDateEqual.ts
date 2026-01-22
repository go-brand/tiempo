import { Temporal } from '@js-temporal/polyfill';

/**
 * Returns true if the two plain dates are equal.
 * Compares calendar dates without time or timezone considerations.
 *
 * @param date1 - First plain date
 * @param date2 - Second plain date
 * @returns true if date1 equals date2, false otherwise
 *
 * @example
 * ```ts
 * const jan20a = Temporal.PlainDate.from('2025-01-20');
 * const jan20b = Temporal.PlainDate.from('2025-01-20');
 * const jan25 = Temporal.PlainDate.from('2025-01-25');
 *
 * isPlainDateEqual(jan20a, jan20b); // true
 * isPlainDateEqual(jan20a, jan25); // false
 * ```
 */
export function isPlainDateEqual(
  date1: Temporal.PlainDate,
  date2: Temporal.PlainDate
): boolean {
  return Temporal.PlainDate.compare(date1, date2) === 0;
}
