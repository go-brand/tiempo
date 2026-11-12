import { describe, expect, it } from 'vitest';
import { Temporal } from './shared/temporal';
import { differenceInCalendarQuarters } from './differenceInCalendarQuarters';

const date = (iso: string) => Temporal.PlainDate.from(iso);

describe('differenceInCalendarQuarters', () => {
  it('ignores the position within the quarter', () => {
    expect(differenceInCalendarQuarters(date('2025-04-01'), date('2025-03-31'))).toBe(1);
    expect(differenceInCalendarQuarters(date('2025-03-31'), date('2025-01-01'))).toBe(0);
    expect(differenceInCalendarQuarters(date('2026-01-01'), date('2024-12-31'))).toBe(5);
    expect(differenceInCalendarQuarters(date('2024-12-31'), date('2026-01-01'))).toBe(-5);
  });

  it('uses ISO months for non-ISO calendar dates', () => {
    expect(
      differenceInCalendarQuarters(date('2025-04-01').withCalendar('hebrew'), date('2025-03-31'))
    ).toBe(1);
  });

  it('uses each timeline value in its own timezone', () => {
    const newYork = Temporal.ZonedDateTime.from('2025-03-31T22:00:00-04:00[America/New_York]'); // April in UTC
    const start = Temporal.Instant.from('2025-01-15T00:00:00Z');
    expect(differenceInCalendarQuarters(newYork, start)).toBe(0);
    expect(differenceInCalendarQuarters(newYork.toInstant(), start)).toBe(1);
  });

  it('rejects mixed PlainDate and timeline values', () => {
    const instant = Temporal.Instant.from('2025-01-24T00:00:00Z');
    // @ts-expect-error PlainDate and Instant are different domains
    expect(() => differenceInCalendarQuarters(instant, date('2025-01-24'))).toThrow(TypeError);
  });
});
