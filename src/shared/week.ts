/**
 * Day of the week, numbered as Temporal numbers it: 1 = Monday … 7 = Sunday.
 */
export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/**
 * Options for functions that need to know where a week begins.
 */
export interface WeekOptions {
  /**
   * The first day of the week: 1 = Monday … 7 = Sunday.
   * @default 1 (Monday, as in ISO 8601)
   */
  weekStartsOn?: DayOfWeek;
}

/**
 * @internal
 * Checks a day-of-week argument. date-fns numbers Sunday 0; Temporal numbers it 7,
 * so 0 is rejected rather than silently meaning something else.
 */
export function assertDayOfWeek(day: number, name: string): asserts day is DayOfWeek {
  if (!Number.isInteger(day) || day < 1 || day > 7) {
    throw new RangeError(`${name} must be 1 (Monday) through 7 (Sunday), got ${day}`);
  }
}

/**
 * @internal
 * Days from the start of the week to a given day of the week (0–6).
 */
export function daysIntoWeek(dayOfWeek: number, options: WeekOptions | undefined): number {
  const weekStartsOn = options?.weekStartsOn ?? 1;
  assertDayOfWeek(weekStartsOn, 'weekStartsOn');
  return (dayOfWeek - weekStartsOn + 7) % 7;
}
