import { describe, expect, expectTypeOf, it } from 'vitest';
import { Temporal } from './shared/temporal';
import { addBusinessDays } from './addBusinessDays';
import { differenceInBusinessDays } from './differenceInBusinessDays';
import { isWeekend } from './isWeekend';

const date = (iso: string) => Temporal.PlainDate.from(iso);

describe('addBusinessDays', () => {
  it('skips weekends', () => {
    const friday = date('2025-01-24');

    expect(addBusinessDays(friday, 1).toString()).toBe('2025-01-27');
    expect(addBusinessDays(friday, 5).toString()).toBe('2025-01-31');
    expect(addBusinessDays(date('2025-01-22'), 10).toString()).toBe('2025-02-05');
  });

  it('counts backwards for negative values', () => {
    expect(addBusinessDays(date('2025-01-27'), -1).toString()).toBe('2025-01-24');
    expect(addBusinessDays(date('2025-01-31'), -5).toString()).toBe('2025-01-24');
  });

  it('moves a weekend start to the next or previous business day', () => {
    const saturday = date('2025-01-25');

    expect(addBusinessDays(saturday, 1).toString()).toBe('2025-01-27');
    expect(addBusinessDays(saturday, -1).toString()).toBe('2025-01-24');
    expect(addBusinessDays(saturday, 0).toString()).toBe('2025-01-25');
  });

  it('keeps ZonedDateTime time of day and timezone across DST', () => {
    const fridayMorning = Temporal.ZonedDateTime.from(
      '2025-03-07T09:00:00-05:00[America/New_York]'
    );

    const result = addBusinessDays(fridayMorning, 1);

    expect(result.toString()).toBe('2025-03-10T09:00:00-04:00[America/New_York]');
    expectTypeOf(result).toEqualTypeOf<Temporal.ZonedDateTime>();
  });

  it('converts Instant to UTC', () => {
    const result = addBusinessDays(Temporal.Instant.from('2025-01-24T12:00:00Z'), 1);

    expect(result.toString()).toBe('2025-01-27T12:00:00+00:00[UTC]');
  });

  it('returns PlainDate for PlainDate input', () => {
    expectTypeOf(addBusinessDays(date('2025-01-24'), 1)).toEqualTypeOf<Temporal.PlainDate>();
  });

  it('rejects counts that are not integers', () => {
    for (const days of [1.5, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(() => addBusinessDays(date('2025-01-24'), days)).toThrow(RangeError);
    }
  });

  it('always lands on a weekday and is undone by differenceInBusinessDays from a weekday', () => {
    const weekdays = ['2025-01-20', '2025-01-21', '2025-01-22', '2025-01-23', '2025-01-24'].map(
      date
    );

    for (const start of weekdays) {
      for (let days = -12; days <= 12; days++) {
        const result = addBusinessDays(start, days);
        expect(isWeekend(result)).toBe(false);
        expect(differenceInBusinessDays(result, start)).toBe(days);
      }
    }
  });
});
