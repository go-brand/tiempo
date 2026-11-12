import { describe, expect, it } from 'vitest';
import { Temporal } from './shared/temporal';
import { differenceInCalendarDays } from './differenceInCalendarDays';

const date = (iso: string) => Temporal.PlainDate.from(iso);

describe('differenceInCalendarDays', () => {
  it('counts calendar days between PlainDates', () => {
    expect(differenceInCalendarDays(date('2025-03-01'), date('2025-02-26'))).toBe(3);
    expect(differenceInCalendarDays(date('2025-02-26'), date('2025-03-01'))).toBe(-3);
    expect(differenceInCalendarDays(date('2025-01-01'), date('2025-01-01'))).toBe(0);
    expect(differenceInCalendarDays(date('2025-01-01'), date('2024-01-01'))).toBe(366);
  });

  it('ignores the time of day', () => {
    const lateTonight = Temporal.ZonedDateTime.from('2025-01-20T23:00:00+01:00[Europe/Madrid]');
    const earlyTomorrow = Temporal.ZonedDateTime.from('2025-01-21T01:00:00+01:00[Europe/Madrid]');
    expect(differenceInCalendarDays(earlyTomorrow, lateTonight)).toBe(1);
    expect(differenceInCalendarDays(lateTonight, earlyTomorrow)).toBe(-1);
  });

  it('counts a 23-hour DST day as one day', () => {
    const before = Temporal.ZonedDateTime.from('2025-03-09T00:30:00-05:00[America/New_York]');
    const after = Temporal.ZonedDateTime.from('2025-03-10T00:15:00-04:00[America/New_York]');
    expect(differenceInCalendarDays(after, before)).toBe(1);
  });

  it('uses the UTC date for Instant and the local date for ZonedDateTime', () => {
    const instant = Temporal.Instant.from('2025-01-21T03:00:00Z');
    const newYork = instant.toZonedDateTimeISO('America/New_York'); // still Jan 20
    const earlier = Temporal.Instant.from('2025-01-20T12:00:00Z');
    expect(differenceInCalendarDays(instant, earlier)).toBe(1);
    expect(differenceInCalendarDays(newYork, earlier)).toBe(0);
  });

  it('accepts non-ISO calendar dates', () => {
    expect(
      differenceInCalendarDays(date('2025-01-31').withCalendar('hebrew'), date('2025-01-24'))
    ).toBe(7);
  });

  it('rejects mixed PlainDate and timeline values', () => {
    const instant = Temporal.Instant.from('2025-01-24T00:00:00Z');
    // @ts-expect-error PlainDate and Instant are different domains
    expect(() => differenceInCalendarDays(date('2025-01-24'), instant)).toThrow(TypeError);
    // @ts-expect-error PlainDate and Instant are different domains
    expect(() => differenceInCalendarDays(instant, date('2025-01-24'))).toThrow(TypeError);
  });
});
