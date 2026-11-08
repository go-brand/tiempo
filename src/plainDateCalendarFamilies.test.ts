import { Temporal as Polyfill } from '@js-temporal/polyfill';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { Temporal } from './shared/temporal';
import { differenceInWeeks, differenceInMonths, differenceInYears, differenceInQuarters, eachWeekOfInterval, eachMonthOfInterval, eachYearOfInterval, eachQuarterOfInterval } from './index';

const Native = (globalThis as unknown as { Temporal?: typeof Polyfill }).Temporal;
const differences = [
  ['weeks', differenceInWeeks, '2025-01-01', '2025-01-11', 1, 10 / 7],
  ['months', differenceInMonths, '2025-01-01', '2025-02-16', 1, 1 + 15 / 28],
  ['years', differenceInYears, '2024-01-01', '2024-07-01', 0, 182 / 366],
] as const;
const intervals = [
  ['weeks', eachWeekOfInterval, ['2024-12-30', '2025-01-06', '2025-01-13']],
  ['months', eachMonthOfInterval, ['2025-01-01']],
  ['years', eachYearOfInterval, ['2025-01-01']],
] as const;

for (const [name, Left, Right] of [
  ['polyfill/polyfill', Polyfill, Polyfill], ['native/native', Native, Native],
  ['polyfill/native', Polyfill, Native], ['native/polyfill', Native, Polyfill],
] as const) {
  describe.skipIf(!Left || !Right)(`PlainDate calendar families: ${name}`, () => {
    for (const [unit, difference, startText, endText, whole, fractional] of differences) {
      it(`${unit}: whole and fractional counts preserve date-only meaning`, () => {
        const start = Left!.PlainDate.from(startText);
        const end = Right!.PlainDate.from(endText);
        expectTypeOf(difference(end, start)).toEqualTypeOf<number>();
        expect(difference(end, start)).toBe(whole);
        expect(difference(end, start, { fractional: true })).toBeCloseTo(fractional, 12);
        expect(difference(start, Right!.PlainDate.from(startText))).toBe(0);
        expect(start.toString()).toBe(startText);
        expect(end.toString()).toBe(endText);
      });

      it(`${unit}: supports negative whole counts and matching non-ISO calendars`, () => {
        const start = Left!.PlainDate.from('2024-02-10[u-ca=hebrew]');
        const end = Right!.PlainDate.from(start.add({ [unit]: 2 }).toString());
        expect(difference(end, start)).toBe(2);
        expect(difference(start, end)).toBe(-2);
        expect(() => difference(end.withCalendar('iso8601'), start)).toThrow(RangeError);
      });
    }

    it('uses calendar month-end and leap-year constraining', () => {
      expect(differenceInMonths(Right!.PlainDate.from('2025-02-28'), Left!.PlainDate.from('2025-01-31'))).toBe(1);
      expect(differenceInYears(Right!.PlainDate.from('2025-02-28'), Left!.PlainDate.from('2024-02-29'))).toBe(1);
    });

    for (const [unit, interval, expected] of intervals) {
      it(`${unit}: returns starts of touched periods and retains PlainDate inference`, () => {
        const start = Left!.PlainDate.from('2025-01-01');
        const end = Right!.PlainDate.from('2025-01-15');
        const result = interval({ start, end });
        expectTypeOf(result).toEqualTypeOf<Temporal.PlainDate[]>();
        expect(result.map(value => value.toString())).toEqual(expected);
        expect(result.every(value => !('timeZoneId' in value))).toBe(true);
        expect(start.toString()).toBe('2025-01-01');
        expect(end.toString()).toBe('2025-01-15');
      });

      it(`${unit}: rejects original reverse order before rounding to boundaries`, () => {
        const start = Left!.PlainDate.from('2025-01-15');
        const end = Right!.PlainDate.from('2025-01-14');
        expect(interval({ start, end })).toEqual([]);
        expect(interval({ start, end: Right!.PlainDate.from(start.toString()) })).toHaveLength(1);
      });

      it(`${unit}: ends at the last boundary without exceeding the maximum date`, () => {
        const end = Right!.PlainDate.from('+275760-09-13');
        const result = interval({ start: Left!.PlainDate.from(end.toString()), end });
        expect(result).toHaveLength(1);
        expect(Temporal.PlainDate.compare(result[0]!.toString(), end.toString())).toBeLessThanOrEqual(0);
      });
    }

    it('month intervals cross a Hebrew leap month and preserve the start calendar', () => {
      const start = Left!.PlainDate.from('2024-02-10[u-ca=hebrew]');
      const end = Right!.PlainDate.from('2024-03-11');
      expect(eachMonthOfInterval({ start, end }).map(value => value.toString())).toEqual(['2024-02-10[u-ca=hebrew]', '2024-03-11[u-ca=hebrew]']);
    });

    it('year intervals cross a non-ISO year boundary', () => {
      const start = Left!.PlainDate.from('2024-09-30[u-ca=hebrew]');
      const end = Right!.PlainDate.from('2024-10-04');
      expect(eachYearOfInterval({ start, end }).map(value => value.toString())).toEqual(['2023-09-16[u-ca=hebrew]', '2024-10-03[u-ca=hebrew]']);
    });

    it('week intervals use Mondays in the start calendar', () => {
      const start = Left!.PlainDate.from('2024-02-10[u-ca=hebrew]');
      const end = Right!.PlainDate.from('2024-02-13');
      expect(eachWeekOfInterval({ start, end }).map(value => value.toString())).toEqual(['2024-02-05[u-ca=hebrew]', '2024-02-12[u-ca=hebrew]']);
    });
  });
}

it('rejects mixed date-only and timeline domains in both positions', () => {
  const date = Temporal.PlainDate.from('2025-01-01');
  for (const timeline of [Temporal.Instant.from('2025-01-02T00:00Z'), Temporal.ZonedDateTime.from('2025-01-02T00:00[UTC]')]) {
    for (const difference of [differenceInWeeks, differenceInMonths, differenceInYears, differenceInQuarters]) {
      // @ts-expect-error Explicit conversion is required before mixing domains.
      expect(() => difference(date, timeline)).toThrow(TypeError);
      // @ts-expect-error Explicit conversion is required before mixing domains.
      expect(() => difference(timeline, date)).toThrow(TypeError);
    }
    for (const interval of [eachWeekOfInterval, eachMonthOfInterval, eachYearOfInterval]) {
      // @ts-expect-error Both interval endpoints must have compatible domains.
      expect(() => interval({ start: date, end: timeline })).toThrow(TypeError);
      // @ts-expect-error Both interval endpoints must have compatible domains.
      expect(() => interval({ start: timeline, end: date })).toThrow(TypeError);
    }
  }
});

it('preserves timeline overload extraction and UTC interval output', () => {
  for (const [, difference] of differences) {
    expectTypeOf<Parameters<typeof difference>[0]>().toEqualTypeOf<Temporal.Instant | Temporal.ZonedDateTime>();
  }
  for (const [, interval] of intervals) {
    expectTypeOf<ReturnType<typeof interval>>().toEqualTypeOf<Temporal.ZonedDateTime[]>();
    const start = Temporal.Instant.from('2025-01-01T12:00Z');
    const result = interval({ start, end: start });
    expectTypeOf(result).toEqualTypeOf<Temporal.ZonedDateTime[]>();
    expect(result[0]!.timeZoneId).toBe('UTC');
  }
});

it('quarter intervals reject mixed date-only and timeline bounds explicitly', () => {
  const date = Temporal.PlainDate.from('2025-01-01');
  const instant = Temporal.Instant.from('2025-01-02T00:00Z');
  // @ts-expect-error Endpoints must belong to the same Temporal domain.
  expect(() => eachQuarterOfInterval({ start: date, end: instant })).toThrow('PlainDate intervals require two PlainDate endpoints');
  // @ts-expect-error Endpoints must belong to the same Temporal domain.
  expect(() => eachQuarterOfInterval({ start: instant, end: date })).toThrow('PlainDate intervals require two PlainDate endpoints');
});
