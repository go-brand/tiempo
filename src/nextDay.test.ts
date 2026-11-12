import { describe, expect, it } from 'vitest';
import { Temporal } from './shared/temporal';
import { nextDay } from './nextDay';
import type { DayOfWeek } from './shared/week';

const date = (iso: string) => Temporal.PlainDate.from(iso);

describe('nextDay', () => {
  it('finds every day of the week from every day of the week', () => {
    // 2025-01-20 is a Monday.
    for (let start = 0; start < 7; start++) {
      const from = date('2025-01-20').add({ days: start });
      for (let day = 1; day <= 7; day++) {
        const result = nextDay(from, day as DayOfWeek);
        expect(result.dayOfWeek).toBe(day);
        expect(from.until(result).days).toBeGreaterThanOrEqual(1);
        expect(from.until(result).days).toBeLessThanOrEqual(7);
      }
    }
  });

  it('moves a full week when the input is already that day', () => {
    expect(nextDay(date('2025-01-22'), 3).toString()).toBe('2025-01-29');
  });

  it('keeps the wall-clock time and timezone across DST', () => {
    const fridayEvening = Temporal.ZonedDateTime.from(
      '2025-03-07T18:00:00-05:00[America/New_York]'
    );
    expect(nextDay(fridayEvening, 1).toString()).toBe(
      '2025-03-10T18:00:00-04:00[America/New_York]'
    );
  });

  it('reads Instant inputs in UTC', () => {
    expect(nextDay(Temporal.Instant.from('2025-01-22T23:30:00Z'), 4).toString()).toBe(
      '2025-01-23T23:30:00+00:00[UTC]'
    );
  });

  it('keeps the calendar of PlainDate inputs', () => {
    expect(nextDay(date('2025-01-22').withCalendar('hebrew'), 5).calendarId).toBe('hebrew');
  });

  it('rejects Sunday as 0 and other out-of-range days', () => {
    // @ts-expect-error date-fns numbers Sunday 0; Temporal numbers it 7
    expect(() => nextDay(date('2025-01-22'), 0)).toThrow(RangeError);
    // @ts-expect-error 1.5 is not a day of the week
    expect(() => nextDay(date('2025-01-22'), 1.5)).toThrow(RangeError);
  });
});
