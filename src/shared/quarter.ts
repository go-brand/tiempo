/**
 * @internal
 * Quarter math shared by the quarter family. A quarter spans 3 calendar months:
 * Q1 = Jan–Mar, Q2 = Apr–Jun, Q3 = Jul–Sep, Q4 = Oct–Dec.
 *
 * These are internal helpers - do not use directly.
 */

/** The quarter (1-4) that a calendar month (1-12) belongs to. */
export function quarterOfMonth(month: number): 1 | 2 | 3 | 4 {
  return (Math.floor((month - 1) / 3) + 1) as 1 | 2 | 3 | 4;
}

/** The first month (1, 4, 7, or 10) of the quarter that a calendar month belongs to. */
export function quarterStartMonth(month: number): number {
  return Math.floor((month - 1) / 3) * 3 + 1;
}
