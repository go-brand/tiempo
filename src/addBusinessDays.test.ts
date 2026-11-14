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

  it('matches a day-by-day walk from every weekday and weekend start', () => {
    const walk = (start: Temporal.PlainDate, days: number) => {
      let result = start;
      for (let remaining = Math.abs(days); remaining > 0;) {
        result = result.add({ days: Math.sign(days) });
        if (!isWeekend(result)) remaining--;
      }
      return result;
    };

    for (let offset = 0; offset < 14; offset++) {
      const start = date('2025-01-20').add({ days: offset });
      for (let days = -30; days <= 30; days++) {
        expect(addBusinessDays(start, days).toString()).toBe(walk(start, days).toString());
      }
    }
  });

  it('handles large counts without walking every day', () => {
    expect(addBusinessDays(date('2025-01-24'), 50_000).toString()).toBe('2216-09-20');
    expect(() => addBusinessDays(date('2025-01-24'), 1e9)).toThrow(RangeError);
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

  describe('holidays', () => {
    const d = (iso: string) => Temporal.PlainDate.from(iso);
    const christmas = [d('2025-12-25'), d('2025-12-26')];

    it('skips holidays going forward and backward', () => {
      expect(addBusinessDays(d('2025-12-24'), 1, christmas).toString()).toBe('2025-12-29');
      expect(addBusinessDays(d('2025-12-24'), 2, christmas).toString()).toBe('2025-12-30');
      expect(addBusinessDays(d('2025-12-29'), -1, christmas).toString()).toBe('2025-12-24');
      expect(addBusinessDays(d('2025-12-22'), 5, christmas).toString()).toBe('2025-12-31');
    });

    it('never lands on a holiday, including after a week jump', () => {
      // 10 business days from Monday 1 Dec lands on 15 Dec without holidays.
      expect(addBusinessDays(d('2025-12-01'), 10).toString()).toBe('2025-12-15');
      expect(addBusinessDays(d('2025-12-01'), 10, [d('2025-12-15')]).toString()).toBe('2025-12-16');
      expect(
        addBusinessDays(d('2025-12-01'), 10, [d('2025-12-08'), d('2025-12-16')]).toString()
      ).toBe('2025-12-17');
    });

    it('ignores weekend, duplicate, and out-of-range holidays', () => {
      const noise = [
        d('2025-12-27'),
        d('2025-12-25'),
        d('2025-12-25'),
        d('2026-06-01'),
        d('2025-12-24')
      ];
      expect(addBusinessDays(d('2025-12-24'), 1, noise).toString()).toBe('2025-12-26');
    });

    it('matches the start of a run but does not count it', () => {
      expect(addBusinessDays(d('2025-12-25'), 1, christmas).toString()).toBe('2025-12-29');
      expect(addBusinessDays(d('2025-12-25'), 0, christmas).toString()).toBe('2025-12-25');
    });

    it('matches holidays against the date in the input timezone', () => {
      const tokyo = Temporal.ZonedDateTime.from('2025-12-24T09:00:00+09:00[Asia/Tokyo]');
      expect(addBusinessDays(tokyo, 1, christmas).toString()).toBe(
        '2025-12-29T09:00:00+09:00[Asia/Tokyo]'
      );
      // 23:30 UTC on the 24th; the UTC date decides
      const instant = Temporal.Instant.from('2025-12-24T23:30:00Z');
      expect(addBusinessDays(instant, 1, christmas).toString()).toBe(
        '2025-12-29T23:30:00+00:00[UTC]'
      );
    });

    it('accepts holidays in other calendars', () => {
      expect(
        addBusinessDays(d('2025-12-24'), 1, [d('2025-12-25').withCalendar('hebrew')]).toString()
      ).toBe('2025-12-26');
    });

    it('matches a long run of holidays', () => {
      const allOfJanuary = Array.from({ length: 31 }, (_, i) => d('2026-01-01').add({ days: i }));
      expect(addBusinessDays(d('2025-12-31'), 1, allOfJanuary).toString()).toBe('2026-02-02');
      expect(addBusinessDays(d('2026-02-02'), -1, allOfJanuary).toString()).toBe('2025-12-31');
    });
  });
});
