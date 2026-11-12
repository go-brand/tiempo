import { describe, expect, it } from 'vitest';
import { Temporal } from './shared/temporal';
import { differenceInCalendarMonths } from './differenceInCalendarMonths';

const date = (iso: string) => Temporal.PlainDate.from(iso);

describe('differenceInCalendarMonths', () => {
  it('ignores the day of the month', () => {
    expect(differenceInCalendarMonths(date('2025-02-01'), date('2025-01-31'))).toBe(1);
    expect(differenceInCalendarMonths(date('2025-01-31'), date('2025-01-01'))).toBe(0);
    expect(differenceInCalendarMonths(date('2025-03-01'), date('2024-02-29'))).toBe(13);
    expect(differenceInCalendarMonths(date('2024-02-29'), date('2025-03-01'))).toBe(-13);
  });

  it('uses each timeline value in its own timezone', () => {
    const tokyo = Temporal.ZonedDateTime.from('2025-02-01T08:00:00+09:00[Asia/Tokyo]');
    const utc = tokyo.toInstant(); // still January 31 in UTC
    const start = Temporal.Instant.from('2025-01-15T00:00:00Z');
    expect(differenceInCalendarMonths(tokyo, start)).toBe(1);
    expect(differenceInCalendarMonths(utc, start)).toBe(0);
  });

  it('counts months in the earlier date’s calendar', () => {
    // Hebrew year 5784 is a leap year with 13 months.
    const start = date('2023-09-16').withCalendar('hebrew'); // 1 Tishrei 5784
    const end = date('2024-10-03').withCalendar('hebrew'); // 1 Tishrei 5785
    expect(differenceInCalendarMonths(end, start)).toBe(13);
    expect(differenceInCalendarMonths(date('2024-10-03'), date('2023-09-16'))).toBe(13);
  });

  it('rejects mixed PlainDate and timeline values', () => {
    const instant = Temporal.Instant.from('2025-01-24T00:00:00Z');
    // @ts-expect-error PlainDate and Instant are different domains
    expect(() => differenceInCalendarMonths(date('2025-01-24'), instant)).toThrow(TypeError);
  });
});
