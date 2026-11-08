import { Temporal as Polyfill } from '@js-temporal/polyfill';
import { describe, expect, it } from 'vitest';
import * as tiempo from './index';
import { Temporal as Selected } from './shared/temporal';

const Native = (globalThis as unknown as { Temporal?: typeof Polyfill }).Temporal;

for (const [name, Caller] of [['polyfill', Polyfill], ['native', Native]] as const) {
  describe.skipIf(!Caller)(`${name} caller at public input boundaries`, () => {
    it.each(['iso8601', 'hebrew', 'japanese', 'islamic-civil'])('toPlainDate preserves the %s calendar and ISO date', calendar => {
      const date = Caller!.PlainDate.from(`2024-02-10[u-ca=${calendar}]`);
      const result = tiempo.toPlainDate(date);
      expect(result.toString()).toBe(date.toString());
      expect(result.calendarId).toBe(calendar);
      expect(Object.is(result, date)).toBe(false);
      expect(Selected.PlainDate.prototype.isPrototypeOf(result)).toBe(true);
    });

    it('plain property bags retain their explicit calendars', () => {
      expect(tiempo.toPlainDate({ year: 5784, monthCode: 'M05L', day: 1, calendar: 'hebrew' }).toString()).toBe('2024-02-10[u-ca=hebrew]');
    });

    it('PlainTime conversion and all specialized comparisons preserve nanoseconds', () => {
      const time = Caller!.PlainTime.from('12:30:45.123456789');
      const later = Selected.PlainTime.from('12:30:45.123456790');
      const converted = tiempo.toPlainTime(time);
      expect(converted.toString()).toBe(time.toString());
      expect(converted).not.toBe(time);
      expect(Selected.PlainTime.prototype.isPrototypeOf(converted)).toBe(true);
      expect(tiempo.isPlainTimeBefore(time, later)).toBe(true);
      expect(tiempo.isPlainTimeAfter(later, time)).toBe(true);
      expect(tiempo.isPlainTimeEqual(time, converted)).toBe(true);
    });

    it('timeline conversions preserve exact instants and existing calendar projection behavior', () => {
      const zoned = Caller!.ZonedDateTime.from('2024-02-10T23:30:45.123456789[UTC][u-ca=hebrew]');
      const instant = zoned.toInstant();
      expect(tiempo.toInstant(instant)).toBe(instant);
      expect(tiempo.toInstant(zoned).epochNanoseconds).toBe(instant.epochNanoseconds);
      const tokyo = tiempo.toZonedTime(zoned, 'Asia/Tokyo');
      expect(tokyo.epochNanoseconds).toBe(instant.epochNanoseconds);
      expect(tokyo.calendarId).toBe('iso8601');
      expect(tiempo.toPlainDate(zoned).toString()).toBe('2024-02-10[u-ca=hebrew]');
      expect(tiempo.toPlainDate(zoned, 'Asia/Tokyo').toString()).toBe('2024-02-11');
      expect(tiempo.toPlainDate(instant, 'Asia/Tokyo').toString()).toBe('2024-02-11');
      expect(tiempo.toPlainTime(zoned).toString()).toBe('23:30:45.123456789');
      expect(tiempo.toPlainTime(zoned, 'Asia/Tokyo').toString()).toBe('08:30:45.123456789');
      expect(tiempo.toPlainTime(instant, 'Asia/Tokyo').toString()).toBe('08:30:45.123456789');
      expect(Caller!.ZonedDateTime.prototype.isPrototypeOf(tokyo)).toBe(true);
    });

    const boundaries = { startOfWeek: tiempo.startOfWeek, endOfWeek: tiempo.endOfWeek, startOfMonth: tiempo.startOfMonth, endOfMonth: tiempo.endOfMonth, startOfQuarter: tiempo.startOfQuarter, endOfQuarter: tiempo.endOfQuarter, startOfYear: tiempo.startOfYear, endOfYear: tiempo.endOfYear };
    for (const [boundaryName, boundary] of Object.entries(boundaries)) {
      it(`${boundaryName} handles foreign PlainDate with and without a timezone`, () => {
        const date = Caller!.PlainDate.from('2024-02-10[u-ca=hebrew]');
        const ownDate = Selected.PlainDate.from(date.toString());
        expect(boundary(date).toString()).toBe(boundary(ownDate).toString());
        expect(boundary(date, 'America/New_York').toString()).toBe(boundary(ownDate, 'America/New_York').toString());
      });
    }

    it('day boundaries bridge foreign PlainDate inputs with the required timezone', () => {
      const date = Caller!.PlainDate.from('2024-02-10[u-ca=hebrew]');
      const ownDate = Selected.PlainDate.from(date.toString());
      for (const boundary of [tiempo.startOfDay, tiempo.endOfDay]) {
        expect(boundary(date, 'America/New_York').toString()).toBe(boundary(ownDate, 'America/New_York').toString());
      }
    });

    const intervals = { eachMinuteOfInterval: tiempo.eachMinuteOfInterval, eachHourOfInterval: tiempo.eachHourOfInterval, eachDayOfInterval: tiempo.eachDayOfInterval, eachWeekOfInterval: tiempo.eachWeekOfInterval, eachMonthOfInterval: tiempo.eachMonthOfInterval, eachQuarterOfInterval: tiempo.eachQuarterOfInterval, eachYearOfInterval: tiempo.eachYearOfInterval };
    for (const [intervalName, interval] of Object.entries(intervals)) {
      it(`${intervalName} accepts foreign timeline endpoints in either position`, () => {
        const foreignStart = Caller!.ZonedDateTime.from('2025-01-01T00:00[America/New_York]');
        const foreignEnd = Caller!.ZonedDateTime.from('2025-01-01T01:00[America/New_York]');
        const ownStart = Selected.ZonedDateTime.from(foreignStart.toString());
        const ownEnd = Selected.ZonedDateTime.from(foreignEnd.toString());
        const expected = interval({ start: ownStart, end: ownEnd }).map(value => value.toString());
        for (const [start, end] of [[foreignStart, ownEnd], [ownStart, foreignEnd], [foreignStart, foreignEnd]] as const) {
          expect(interval({ start, end }).map(value => value.toString())).toEqual(expected);
          expect(interval({ start: end, end: start })).toEqual([]);
        }
      });
    }

    it('PlainDate quarter intervals accept mixed ISO dates', () => {
      const start = Caller!.PlainDate.from('2025-02-15');
      const end = Selected.PlainDate.from('2025-08-20');
      expect(tiempo.eachQuarterOfInterval({ start, end }).map(value => value.toString())).toEqual(['2025-01-01', '2025-04-01', '2025-07-01']);
    });

    it('reversed non-ISO PlainDate quarter intervals return an empty array across implementations', () => {
      const start = Caller!.PlainDate.from('2024-02-10[u-ca=hebrew]');
      const end = Selected.PlainDate.from('2024-02-09[u-ca=hebrew]');
      expect(tiempo.eachQuarterOfInterval({ start, end })).toEqual([]);
      expect(tiempo.eachQuarterOfInterval({ start: Selected.PlainDate.from(start.toString()), end: Caller!.PlainDate.from(end.toString()) })).toEqual([]);
    });

    it.each(['hebrew', 'japanese', 'islamic-civil'])('calendar intervals preserve %s dates and use the start calendar', calendar => {
      const start = Caller!.ZonedDateTime.from(`2024-02-10T12:00[UTC][u-ca=${calendar}]`);
      const end = Selected.ZonedDateTime.from(start.add({ months: 2 }).toString());
      const isoEnd = end.withCalendar('iso8601');
      const expectedMonths = [0, 1, 2].map(months => start.with({ day: 1 }).add({ months }).startOfDay().toString());
      expect(tiempo.eachMonthOfInterval({ start, end }).map(value => value.toString())).toEqual(expectedMonths);
      expect(tiempo.eachMonthOfInterval({ start, end: isoEnd }).map(value => value.toString())).toEqual(expectedMonths);
      const expectedYear = tiempo.startOfYear(start).toString();
      expect(tiempo.eachYearOfInterval({ start, end }).map(value => value.toString())).toEqual([expectedYear]);
      expect(tiempo.eachYearOfInterval({ start, end: isoEnd }).map(value => value.toString())).toEqual([expectedYear]);
      const firstQuarter = tiempo.startOfQuarter(start);
      const nextQuarter = tiempo.startOfQuarter(firstQuarter.add({ months: 3 }));
      const expectedQuarters = [firstQuarter, nextQuarter].filter(value => value.epochNanoseconds <= end.epochNanoseconds).map(value => value.toString());
      expect(tiempo.eachQuarterOfInterval({ start, end }).map(value => value.toString())).toEqual(expectedQuarters);
      expect(tiempo.eachQuarterOfInterval({ start, end: isoEnd }).map(value => value.toString())).toEqual(expectedQuarters);
      expect(tiempo.eachQuarterOfInterval({ start: start.toPlainDate(), end: end.toPlainDate() }).map(value => value.toString())).toEqual(expectedQuarters.map(value => Selected.ZonedDateTime.from(value).toPlainDate().toString()));
    });

    it('quarter intervals realign at a calendar year boundary after a thirteenth month', () => {
      const start = Caller!.PlainDate.from('2024-09-10[u-ca=hebrew]');
      const end = Selected.PlainDate.from('2025-05-01[u-ca=hebrew]');
      const quarters = tiempo.eachQuarterOfInterval({ start, end });
      expect(quarters.map(value => [value.year, value.month, value.day])).toEqual([[5784, 13, 1], [5785, 1, 1], [5785, 4, 1], [5785, 7, 1]]);
      expect(quarters.every(value => value.calendarId === 'hebrew')).toBe(true);
    });

    it('formatting and relative formatting accept foreign objects', () => {
      const date = Caller!.PlainDate.from('2025-01-01');
      const zoned = Caller!.ZonedDateTime.from('2025-01-01T12:00[UTC]');
      const later = Selected.ZonedDateTime.from('2025-01-03T12:00[UTC]');
      expect(tiempo.simpleFormat(date, { date: 'full', locale: 'en-US' })).toBe(tiempo.simpleFormat(Selected.PlainDate.from(date.toString()), { date: 'full', locale: 'en-US' }));
      expect(tiempo.format(zoned, 'yyyy-MM-dd HH:mm')).toBe('2025-01-01 12:00');
      expect(tiempo.intlFormatDistance(later, zoned, { locale: 'en-US', numeric: 'always' })).toBe('in 2 days');
    });
  });
}
