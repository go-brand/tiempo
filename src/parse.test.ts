import { describe, expect, it } from 'vitest';
import { Temporal } from './shared/temporal';
import { parse } from './parse';
import { format } from './format';

describe('parse', () => {
  describe('dates', () => {
    it('reads numeric dates in common orders', () => {
      expect(parse('20/01/2025', 'dd/MM/yyyy').toString()).toBe('2025-01-20');
      expect(parse('01/20/2025', 'MM/dd/yyyy').toString()).toBe('2025-01-20');
      expect(parse('2025.1.5', 'yyyy.M.d').toString()).toBe('2025-01-05');
      expect(parse('20250120', 'yyyyMMdd').toString()).toBe('2025-01-20');
      expect(parse('5/1/2025', 'd/M/yyyy').toString()).toBe('2025-01-05');
    });

    it('reads month and weekday names', () => {
      expect(parse('January 20, 2025', 'MMMM d, yyyy').toString()).toBe('2025-01-20');
      expect(parse('20 Jan 2025', 'd MMM yyyy').toString()).toBe('2025-01-20');
      expect(parse('Monday, 20 January 2025', 'EEEE, d MMMM yyyy').toString()).toBe('2025-01-20');
      expect(parse('mon 20 jan 2025', 'EEE d MMM yyyy').toString()).toBe('2025-01-20');
    });

    it('prefers the longest matching name', () => {
      // "Jun" is a prefix of "June"; "Ma" is a prefix of both "March" and "May".
      expect(parse('June 1 2025', 'MMMM d yyyy').toString()).toBe('2025-06-01');
      expect(parse('May 1 2025', 'MMMM d yyyy').toString()).toBe('2025-05-01');
    });

    it('reads names in other locales', () => {
      expect(parse('20 enero 2025', 'd MMMM yyyy', { locale: 'es' }).toString()).toBe('2025-01-20');
      expect(parse('20. Januar 2025', 'd. MMMM yyyy', { locale: 'de' }).toString()).toBe(
        '2025-01-20'
      );
    });

    it('reads quoted literal text', () => {
      expect(parse("Day 20 of 01 '25 in 2025", "'Day' d 'of' MM ''25 'in' yyyy").toString()).toBe(
        '2025-01-20'
      );
    });

    it('reads years with more or fewer than four digits through y', () => {
      expect(parse('12025-01-20', 'y-MM-dd').toString()).toBe('+012025-01-20');
      expect(parse('800-01-20', 'y-MM-dd').toString()).toBe('0800-01-20');
    });
  });

  describe('dates and times', () => {
    const timeZone = 'America/New_York';

    it('reads 24-hour and 12-hour times in the timezone', () => {
      expect(parse('2025-01-20 15:45', 'yyyy-MM-dd HH:mm', { timeZone }).toString()).toBe(
        '2025-01-20T15:45:00-05:00[America/New_York]'
      );
      expect(parse('01/20/2025 3:45 PM', 'MM/dd/yyyy h:mm a', { timeZone }).toString()).toBe(
        '2025-01-20T15:45:00-05:00[America/New_York]'
      );
      expect(parse('01/20/2025 12:05 am', 'MM/dd/yyyy h:mm a', { timeZone }).toString()).toBe(
        '2025-01-20T00:05:00-05:00[America/New_York]'
      );
      expect(parse('01/20/2025 12:05 p.m.', 'MM/dd/yyyy h:mm aaaa', { timeZone }).toString()).toBe(
        '2025-01-20T12:05:00-05:00[America/New_York]'
      );
    });

    it('reads seconds and fractions', () => {
      expect(
        parse('2025-01-20 15:45:30.125', 'yyyy-MM-dd HH:mm:ss.SSS', { timeZone: 'UTC' }).toString()
      ).toBe('2025-01-20T15:45:30.125+00:00[UTC]');
      expect(
        parse('2025-01-20 15:45:30.5', 'yyyy-MM-dd HH:mm:ss.S', { timeZone: 'UTC' }).toString()
      ).toBe('2025-01-20T15:45:30.5+00:00[UTC]');
    });

    it('lets an offset in the text fix the moment', () => {
      expect(
        parse('2025-01-20 15:45 +02:00', 'yyyy-MM-dd HH:mm XXX', { timeZone: 'UTC' }).toString()
      ).toBe('2025-01-20T13:45:00+00:00[UTC]');
      expect(parse('2025-01-20 15:45 Z', 'yyyy-MM-dd HH:mm X', { timeZone }).toString()).toBe(
        '2025-01-20T10:45:00-05:00[America/New_York]'
      );
      expect(
        parse('2025-01-20 15:45 +0530', 'yyyy-MM-dd HH:mm xx', { timeZone: 'UTC' }).toString()
      ).toBe('2025-01-20T10:15:00+00:00[UTC]');
      expect(
        parse('2025-01-20 15:45 -03', 'yyyy-MM-dd HH:mm x', { timeZone: 'UTC' }).toString()
      ).toBe('2025-01-20T18:45:00+00:00[UTC]');
    });

    it('gives the start of the day for a date-only pattern', () => {
      expect(parse('2025-01-20', 'yyyy-MM-dd', { timeZone }).toString()).toBe(
        '2025-01-20T00:00:00-05:00[America/New_York]'
      );
      // Midnight does not exist in Santiago on 2024-09-08; the day starts at 01:00.
      expect(parse('2024-09-08', 'yyyy-MM-dd', { timeZone: 'America/Santiago' }).toString()).toBe(
        '2024-09-08T01:00:00-03:00[America/Santiago]'
      );
    });

    it('moves a time skipped by DST forward', () => {
      expect(parse('2025-03-09 02:30', 'yyyy-MM-dd HH:mm', { timeZone }).toString()).toBe(
        '2025-03-09T03:30:00-04:00[America/New_York]'
      );
    });
  });

  describe('round trips with format', () => {
    const zoned = Temporal.ZonedDateTime.from('2025-11-03T21:07:09.045+01:00[Europe/Madrid]');
    const patterns = [
      'yyyy-MM-dd HH:mm:ss.SSS',
      'dd/MM/yyyy h:mm:ss.SSS a',
      'EEEE, MMMM d, yyyy HH:mm:ss.SSS',
      'EEE d MMM y H:m:s.SSS',
      "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
      'yyyyMMdd HHmmss.SSS xx'
    ];

    it.each(patterns)('reads back %s', (pattern) => {
      const text = format(zoned, pattern);
      expect(parse(text, pattern, { timeZone: 'Europe/Madrid' }).toString()).toBe(zoned.toString());
    });

    it.each(['es', 'de', 'fr', 'ja'])('reads back names in %s', (locale) => {
      const pattern = 'EEEE d MMMM yyyy';
      const date = Temporal.PlainDate.from('2025-02-14');
      expect(parse(format(date, pattern, { locale }), pattern, { locale }).toString()).toBe(
        '2025-02-14'
      );
    });
  });

  describe('errors', () => {
    it('rejects text that does not match the pattern', () => {
      expect(() => parse('2025-01-20', 'dd/MM/yyyy')).toThrow(RangeError);
      expect(() => parse('20/01/2025 extra', 'dd/MM/yyyy')).toThrow(/unexpected " extra"/);
      expect(() => parse('20/01', 'dd/MM/yyyy')).toThrow(RangeError);
      expect(() => parse('Janvier 20 2025', 'MMMM d yyyy')).toThrow(RangeError);
    });

    it('rejects impossible dates and times', () => {
      expect(() => parse('30/02/2025', 'dd/MM/yyyy')).toThrow(RangeError);
      expect(() => parse('2025-13-01', 'yyyy-MM-dd')).toThrow(RangeError);
      expect(() => parse('2025-01-20 24:00', 'yyyy-MM-dd HH:mm', { timeZone: 'UTC' })).toThrow(
        RangeError
      );
      expect(() => parse('2025-01-20 13:00 PM', 'yyyy-MM-dd hh:mm a', { timeZone: 'UTC' })).toThrow(
        RangeError
      );
    });

    it('rejects a weekday that does not match the date', () => {
      expect(() => parse('Tuesday 20 January 2025', 'EEEE d MMMM yyyy')).toThrow(/day of the week/);
    });

    it('requires a year, month, and day', () => {
      expect(() => parse('20/01', 'dd/MM')).toThrow(/year, month, and day/);
      expect(() => parse('15:45', 'HH:mm', { timeZone: 'UTC' })).toThrow(/year, month, and day/);
    });

    it('requires AM/PM with a 12-hour hour', () => {
      expect(() => parse('2025-01-20 3:45', 'yyyy-MM-dd h:mm', { timeZone: 'UTC' })).toThrow(
        /AM\/PM/
      );
    });

    it('requires a timezone for time and offset fields', () => {
      expect(() => {
        // @ts-expect-error without a timeZone the result is a PlainDate
        const zoned: Temporal.ZonedDateTime = parse('2025-01-20 15:45', 'yyyy-MM-dd HH:mm');
        return zoned;
      }).toThrow(TypeError);
      expect(() => parse('2025-01-20 Z', 'yyyy-MM-dd X')).toThrow(TypeError);
    });

    it('rejects tokens it cannot read reliably', () => {
      expect(() => parse('20/01/25', 'dd/MM/yy')).toThrow(/two-digit years/);
      expect(() => parse('1737331200000', 'T')).toThrow(/toInstant/);
      expect(() => parse('Q1 2025', 'QQQ yyyy')).toThrow(/"QQQ"/);
      expect(() => parse('20th 01 2025', 'do MM yyyy')).toThrow(/"do"/);
    });
  });
});
