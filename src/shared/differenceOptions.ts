/**
 * Options for the differenceIn* family (unit-converting members:
 * seconds, minutes, hours, days, weeks, months, years).
 */
export interface DifferenceOptions {
  /**
   * Return the precise fractional value instead of truncating toward zero.
   * @default false
   *
   * @example
   * differenceInDays(a, b);                     // 1   (truncated)
   * differenceInDays(a, b, { fractional: true }); // 1.5 (precise)
   */
  fractional?: boolean;
}
