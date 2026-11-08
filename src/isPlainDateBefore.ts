import { Temporal } from './shared/temporal';

/**
 * Returns true if the first plain date is before the second plain date.
 * Compares calendar dates without time or timezone considerations.
 *
 * @param date1 - First plain date
 * @param date2 - Second plain date
 * @returns true if date1 is before date2, false otherwise
 *
 * @example
 * ```ts
 * const jan20 = Temporal.PlainDate.from('2025-01-20');
 * const jan25 = Temporal.PlainDate.from('2025-01-25');
 *
 * isPlainDateBefore(jan20, jan25); // true
 * isPlainDateBefore(jan25, jan20); // false
 * isPlainDateBefore(jan20, jan20); // false
 * ```
 */
export function isPlainDateBefore(
  date1: Temporal.PlainDate,
  date2: Temporal.PlainDate
): boolean {
  // Only foreign objects need conversion; strings retain their calendar annotations.
  return Temporal.PlainDate.compare(
    Temporal.PlainDate.prototype.isPrototypeOf(date1) ? date1 : date1.toString(),
    Temporal.PlainDate.prototype.isPrototypeOf(date2) ? date2 : date2.toString()
  ) < 0;
}
