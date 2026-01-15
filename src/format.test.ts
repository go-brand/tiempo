import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { format } from './format';

describe('format', () => {
  const testZoned = Temporal.ZonedDateTime.from('2025-01-20T15:30:45.123-05:00[America/New_York]');
  const testInstant = Temporal.Instant.from('2025-01-20T20:30:45.123Z');

  describe('basic formatting', () => {
    it('formats year tokens', () => {
      expect(format(testZoned, 'yyyy')).toBe('2025');
      expect(format(testZoned, 'yyy')).toBe('2025');
      expect(format(testZoned, 'yy')).toBe('25');
      expect(format(testZoned, 'y')).toBe('2025');
    });

    it('formats month tokens', () => {
      expect(format(testZoned, 'MM')).toBe('01');
      expect(format(testZoned, 'M')).toBe('1');
      expect(format(testZoned, 'MMMM')).toBe('January');
      expect(format(testZoned, 'MMM')).toBe('Jan');
      expect(format(testZoned, 'MMMMM')).toBe('J');
      expect(format(testZoned, 'Mo')).toBe('1st');
    });

    it('formats day tokens', () => {
      expect(format(testZoned, 'dd')).toBe('20');
      expect(format(testZoned, 'd')).toBe('20');
      expect(format(testZoned, 'do')).toBe('20th');
    });

    it('formats weekday tokens', () => {
      expect(format(testZoned, 'EEEE')).toBe('Monday');
      expect(format(testZoned, 'EEE')).toBe('Mon');
      expect(format(testZoned, 'EEEEE')).toBe('M');
    });

    it('formats hour tokens (24-hour)', () => {
      expect(format(testZoned, 'HH')).toBe('15');
      expect(format(testZoned, 'H')).toBe('15');
    });

    it('formats hour tokens (12-hour)', () => {
      expect(format(testZoned, 'hh')).toBe('03');
      expect(format(testZoned, 'h')).toBe('3');
    });

    it('formats minute tokens', () => {
      expect(format(testZoned, 'mm')).toBe('30');
      expect(format(testZoned, 'm')).toBe('30');
    });

    it('formats second tokens', () => {
      expect(format(testZoned, 'ss')).toBe('45');
      expect(format(testZoned, 's')).toBe('45');
    });

    it('formats millisecond tokens', () => {
      expect(format(testZoned, 'SSS')).toBe('123');
      expect(format(testZoned, 'SS')).toBe('12');
      expect(format(testZoned, 'S')).toBe('1');
    });

    it('formats AM/PM tokens', () => {
      expect(format(testZoned, 'a')).toBe('PM');
      expect(format(testZoned, 'aa')).toBe('PM');
      expect(format(testZoned, 'aaa')).toBe('pm');
      expect(format(testZoned, 'aaaa')).toBe('p.m.');
      expect(format(testZoned, 'aaaaa')).toBe('p');
    });
  });

  describe('compound formats', () => {
    it('formats ISO date', () => {
      expect(format(testZoned, 'yyyy-MM-dd')).toBe('2025-01-20');
    });

    it('formats ISO datetime', () => {
      expect(format(testZoned, 'yyyy-MM-dd HH:mm:ss')).toBe('2025-01-20 15:30:45');
    });

    it('formats US date', () => {
      expect(format(testZoned, 'MM/dd/yyyy')).toBe('01/20/2025');
    });

    it('formats long date', () => {
      expect(format(testZoned, 'MMMM d, yyyy')).toBe('January 20, 2025');
    });

    it('formats full date and time', () => {
      expect(format(testZoned, 'EEEE, MMMM do, yyyy h:mm a')).toBe('Monday, January 20th, 2025 3:30 PM');
    });

    it('formats 12-hour time', () => {
      expect(format(testZoned, 'h:mm:ss a')).toBe('3:30:45 PM');
    });

    it('formats 24-hour time', () => {
      expect(format(testZoned, 'HH:mm:ss')).toBe('15:30:45');
    });
  });

  describe('timezone formatting', () => {
    it('formats timezone offset with colon', () => {
      expect(format(testZoned, 'xxx')).toBe('-05:00');
      expect(format(testZoned, 'xxxxx')).toBe('-05:00');
    });

    it('formats timezone offset without colon', () => {
      expect(format(testZoned, 'xx')).toBe('-0500');
      expect(format(testZoned, 'xxxx')).toBe('-0500');
    });

    it('formats timezone offset hour only', () => {
      expect(format(testZoned, 'x')).toBe('-05');
    });

    it('formats timezone offset with Z for UTC', () => {
      const utcZoned = Temporal.ZonedDateTime.from('2025-01-20T20:30:45.123Z[UTC]');
      expect(format(utcZoned, 'XXX')).toBe('Z');
      expect(format(utcZoned, 'XX')).toBe('Z');
      expect(format(utcZoned, 'X')).toBe('Z');
    });

    it('formats timezone offset without Z for non-UTC', () => {
      expect(format(testZoned, 'XXX')).toBe('-05:00');
    });

    it('formats timezone name', () => {
      const result = format(testZoned, 'zzzz');
      expect(result).toContain('Eastern');
    });
  });

  describe('quarter formatting', () => {
    it('formats quarter number', () => {
      expect(format(testZoned, 'Q')).toBe('1');
      expect(format(testZoned, 'QQ')).toBe('01');
      expect(format(testZoned, 'QQQQQ')).toBe('1');
    });

    it('formats quarter text', () => {
      expect(format(testZoned, 'QQQ')).toBe('Q1');
      expect(format(testZoned, 'QQQQ')).toBe('1st quarter');
    });

    it('formats different quarters correctly', () => {
      const q2 = Temporal.ZonedDateTime.from('2025-04-15T12:00:00-04:00[America/New_York]');
      const q3 = Temporal.ZonedDateTime.from('2025-07-15T12:00:00-04:00[America/New_York]');
      const q4 = Temporal.ZonedDateTime.from('2025-10-15T12:00:00-04:00[America/New_York]');

      expect(format(q2, 'Q')).toBe('2');
      expect(format(q3, 'Q')).toBe('3');
      expect(format(q4, 'Q')).toBe('4');
    });
  });

  describe('ordinal suffixes', () => {
    it('formats 1st, 2nd, 3rd correctly', () => {
      const first = Temporal.ZonedDateTime.from('2025-01-01T12:00:00-05:00[America/New_York]');
      const second = Temporal.ZonedDateTime.from('2025-01-02T12:00:00-05:00[America/New_York]');
      const third = Temporal.ZonedDateTime.from('2025-01-03T12:00:00-05:00[America/New_York]');

      expect(format(first, 'do')).toBe('1st');
      expect(format(second, 'do')).toBe('2nd');
      expect(format(third, 'do')).toBe('3rd');
    });

    it('formats 11th, 12th, 13th correctly', () => {
      const eleventh = Temporal.ZonedDateTime.from('2025-01-11T12:00:00-05:00[America/New_York]');
      const twelfth = Temporal.ZonedDateTime.from('2025-01-12T12:00:00-05:00[America/New_York]');
      const thirteenth = Temporal.ZonedDateTime.from('2025-01-13T12:00:00-05:00[America/New_York]');

      expect(format(eleventh, 'do')).toBe('11th');
      expect(format(twelfth, 'do')).toBe('12th');
      expect(format(thirteenth, 'do')).toBe('13th');
    });

    it('formats 21st, 22nd, 23rd correctly', () => {
      const twentyFirst = Temporal.ZonedDateTime.from('2025-01-21T12:00:00-05:00[America/New_York]');
      const twentySecond = Temporal.ZonedDateTime.from('2025-01-22T12:00:00-05:00[America/New_York]');
      const twentyThird = Temporal.ZonedDateTime.from('2025-01-23T12:00:00-05:00[America/New_York]');

      expect(format(twentyFirst, 'do')).toBe('21st');
      expect(format(twentySecond, 'do')).toBe('22nd');
      expect(format(twentyThird, 'do')).toBe('23rd');
    });
  });

  describe('escaped text', () => {
    it('preserves text in single quotes', () => {
      expect(format(testZoned, "yyyy-MM-dd 'at' HH:mm")).toBe('2025-01-20 at 15:30');
    });

    it('handles double single quotes as single quote', () => {
      expect(format(testZoned, "h 'o''clock'")).toBe("3 o'clock");
    });

    it('preserves multiple escaped sequences', () => {
      expect(format(testZoned, "'Year:' yyyy 'Month:' MM")).toBe('Year: 2025 Month: 01');
    });

    it('escapes special tokens', () => {
      expect(format(testZoned, "'yyyy' yyyy")).toBe('yyyy 2025');
    });
  });

  describe('Temporal.Instant input', () => {
    it('formats Instant with default UTC timezone', () => {
      expect(format(testInstant, 'yyyy-MM-dd HH:mm:ss')).toBe('2025-01-20 20:30:45');
    });

    it('formats Instant with custom timezone', () => {
      expect(format(testInstant, 'yyyy-MM-dd HH:mm:ss', { timeZone: 'America/New_York' })).toBe('2025-01-20 15:30:45');
    });

    it('formats Instant with different timezone', () => {
      expect(format(testInstant, 'yyyy-MM-dd HH:mm:ss', { timeZone: 'Asia/Tokyo' })).toBe('2025-01-21 05:30:45');
    });
  });

  describe('locale support', () => {
    it('formats month names in Spanish', () => {
      expect(format(testZoned, 'MMMM', { locale: 'es-ES' })).toBe('enero');
    });

    it('formats weekday names in Spanish', () => {
      expect(format(testZoned, 'EEEE', { locale: 'es-ES' })).toBe('lunes');
    });

    it('formats month names in French', () => {
      expect(format(testZoned, 'MMMM', { locale: 'fr-FR' })).toBe('janvier');
    });

    it('formats weekday names in German', () => {
      expect(format(testZoned, 'EEEE', { locale: 'de-DE' })).toBe('Montag');
    });
  });

  describe('timestamp formatting', () => {
    it('formats milliseconds timestamp', () => {
      expect(format(testZoned, 'T')).toBe(testZoned.epochMilliseconds.toString());
    });

    it('formats seconds timestamp', () => {
      expect(format(testZoned, 't')).toBe(Math.floor(testZoned.epochMilliseconds / 1000).toString());
    });
  });

  describe('edge cases', () => {
    it('handles midnight (00:00)', () => {
      const midnight = Temporal.ZonedDateTime.from('2025-01-20T00:00:00-05:00[America/New_York]');
      expect(format(midnight, 'HH:mm')).toBe('00:00');
      expect(format(midnight, 'h:mm a')).toBe('12:00 AM');
    });

    it('handles noon (12:00)', () => {
      const noon = Temporal.ZonedDateTime.from('2025-01-20T12:00:00-05:00[America/New_York]');
      expect(format(noon, 'HH:mm')).toBe('12:00');
      expect(format(noon, 'h:mm a')).toBe('12:00 PM');
    });

    it('handles single digit values', () => {
      const early = Temporal.ZonedDateTime.from('2025-01-05T03:04:05-05:00[America/New_York]');
      expect(format(early, 'M/d/yyyy')).toBe('1/5/2025');
      expect(format(early, 'H:m:s')).toBe('3:4:5');
    });

    it('formats year 1999 yy token correctly', () => {
      const y1999 = Temporal.ZonedDateTime.from('1999-12-31T23:59:59-05:00[America/New_York]');
      expect(format(y1999, 'yy')).toBe('99');
    });

    it('formats year 2000 yy token correctly', () => {
      const y2000 = Temporal.ZonedDateTime.from('2000-01-01T00:00:00-05:00[America/New_York]');
      expect(format(y2000, 'yy')).toBe('00');
    });
  });

  describe('timezone conversion with format', () => {
    it('converts ZonedDateTime to different timezone while formatting', () => {
      const ny = Temporal.ZonedDateTime.from('2025-01-20T15:00:00-05:00[America/New_York]');
      const formatted = format(ny, 'yyyy-MM-dd HH:mm zzz', { timeZone: 'Asia/Tokyo' });
      expect(formatted).toContain('2025-01-21 05:00');
    });

    it('preserves original timezone when no timeZone option', () => {
      expect(format(testZoned, 'HH:mm')).toBe('15:30');
    });
  });
});
