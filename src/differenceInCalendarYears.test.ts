import { describe, expect, it } from 'vitest';
import { Temporal } from './shared/temporal';
import { differenceInCalendarYears } from './differenceInCalendarYears';

const date = (iso: string) => Temporal.PlainDate.from(iso);

describe('differenceInCalendarYears', () => {
  it('ignores the month and day', () => {
    expect(differenceInCalendarYears(date('2025-01-01'), date('2024-12-31'))).toBe(1);
    expect(differenceInCalendarYears(date('2025-12-31'), date('2025-01-01'))).toBe(0);
    expect(differenceInCalendarYears(date('2020-01-01'), date('2025-06-15'))).toBe(-5);
  });

  it('uses each timeline value in its own timezone', () => {
    const tokyo = Temporal.ZonedDateTime.from('2025-01-01T08:00:00+09:00[Asia/Tokyo]');
    const start = Temporal.Instant.from('2024-06-01T00:00:00Z');
    expect(differenceInCalendarYears(tokyo, start)).toBe(1);
    expect(differenceInCalendarYears(tokyo.toInstant(), start)).toBe(0);
  });

  it('counts years in the earlier date’s calendar', () => {
    // 2024-10-02 is the last day of Hebrew year 5784; the next day starts 5785.
    const start = date('2024-10-02').withCalendar('hebrew');
    expect(differenceInCalendarYears(date('2024-10-03'), start)).toBe(1);
    expect(differenceInCalendarYears(date('2024-10-03'), date('2024-10-02'))).toBe(0);
  });

  it('rejects mixed PlainDate and timeline values', () => {
    const instant = Temporal.Instant.from('2025-01-24T00:00:00Z');
    // @ts-expect-error PlainDate and Instant are different domains
    expect(() => differenceInCalendarYears(date('2025-01-24'), instant)).toThrow(TypeError);
  });
});
