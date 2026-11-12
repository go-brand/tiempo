import { describe, expect, it } from 'vitest';
import { Temporal } from './shared/temporal';
import { differenceInCalendarWeeks } from './differenceInCalendarWeeks';

const date = (iso: string) => Temporal.PlainDate.from(iso);

describe('differenceInCalendarWeeks', () => {
  it('counts Monday week boundaries by default', () => {
    expect(differenceInCalendarWeeks(date('2025-01-27'), date('2025-01-26'))).toBe(1); // Sun -> Mon
    expect(differenceInCalendarWeeks(date('2025-01-26'), date('2025-01-20'))).toBe(0); // Mon -> Sun
    expect(differenceInCalendarWeeks(date('2025-02-03'), date('2025-01-22'))).toBe(2);
    expect(differenceInCalendarWeeks(date('2025-01-22'), date('2025-02-03'))).toBe(-2);
  });

  it('counts boundaries on the chosen first day', () => {
    expect(
      differenceInCalendarWeeks(date('2025-01-27'), date('2025-01-26'), { weekStartsOn: 7 })
    ).toBe(0);
    expect(
      differenceInCalendarWeeks(date('2025-01-26'), date('2025-01-25'), { weekStartsOn: 7 })
    ).toBe(1);
  });

  it('counts across a year boundary and DST', () => {
    expect(differenceInCalendarWeeks(date('2025-01-06'), date('2024-12-29'))).toBe(2);
    const before = Temporal.ZonedDateTime.from('2025-03-07T12:00:00-05:00[America/New_York]');
    const after = Temporal.ZonedDateTime.from('2025-03-10T00:15:00-04:00[America/New_York]');
    expect(differenceInCalendarWeeks(after, before)).toBe(1);
  });

  it('uses the UTC date for Instant inputs', () => {
    const sundayNight = Temporal.Instant.from('2025-01-26T23:30:00Z');
    const mondayMorning = Temporal.Instant.from('2025-01-27T00:30:00Z');
    expect(differenceInCalendarWeeks(mondayMorning, sundayNight)).toBe(1);
  });

  it('rejects mixed domains and Sunday as 0', () => {
    const instant = Temporal.Instant.from('2025-01-24T00:00:00Z');
    // @ts-expect-error PlainDate and Instant are different domains
    expect(() => differenceInCalendarWeeks(date('2025-01-24'), instant)).toThrow(TypeError);
    const monday = date('2025-01-20');
    // @ts-expect-error date-fns numbers Sunday 0; Temporal numbers it 7
    expect(() => differenceInCalendarWeeks(monday, monday, { weekStartsOn: 0 })).toThrow(
      RangeError
    );
  });
});
