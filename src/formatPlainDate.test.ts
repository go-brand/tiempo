import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { formatPlainDate } from './formatPlainDate';

describe('formatPlainDate', () => {
  const testDate = Temporal.PlainDate.from('2025-01-20');

  describe('basic formatting', () => {
    it('formats year tokens', () => {
      expect(formatPlainDate(testDate, 'yyyy')).toBe('2025');
      expect(formatPlainDate(testDate, 'yyy')).toBe('2025');
      expect(formatPlainDate(testDate, 'yy')).toBe('25');
      expect(formatPlainDate(testDate, 'y')).toBe('2025');
    });

    it('formats month tokens', () => {
      expect(formatPlainDate(testDate, 'MM')).toBe('01');
      expect(formatPlainDate(testDate, 'M')).toBe('1');
      expect(formatPlainDate(testDate, 'MMMM')).toBe('January');
      expect(formatPlainDate(testDate, 'MMM')).toBe('Jan');
      expect(formatPlainDate(testDate, 'MMMMM')).toBe('J');
      expect(formatPlainDate(testDate, 'Mo')).toBe('1st');
    });

    it('formats day tokens', () => {
      expect(formatPlainDate(testDate, 'dd')).toBe('20');
      expect(formatPlainDate(testDate, 'd')).toBe('20');
      expect(formatPlainDate(testDate, 'do')).toBe('20th');
    });

    it('formats weekday tokens', () => {
      expect(formatPlainDate(testDate, 'EEEE')).toBe('Monday');
      expect(formatPlainDate(testDate, 'EEE')).toBe('Mon');
      expect(formatPlainDate(testDate, 'EEEEE')).toBe('M');
    });
  });

  describe('compound formats', () => {
    it('formats ISO date', () => {
      expect(formatPlainDate(testDate, 'yyyy-MM-dd')).toBe('2025-01-20');
    });

    it('formats US date', () => {
      expect(formatPlainDate(testDate, 'MM/dd/yyyy')).toBe('01/20/2025');
    });

    it('formats long date', () => {
      expect(formatPlainDate(testDate, 'MMMM d, yyyy')).toBe('January 20, 2025');
    });

    it('formats full date', () => {
      expect(formatPlainDate(testDate, 'EEEE, MMMM do, yyyy')).toBe('Monday, January 20th, 2025');
    });

    it('formats European date', () => {
      expect(formatPlainDate(testDate, 'dd/MM/yyyy')).toBe('20/01/2025');
    });
  });

  describe('quarter formatting', () => {
    it('formats quarter number', () => {
      expect(formatPlainDate(testDate, 'Q')).toBe('1');
      expect(formatPlainDate(testDate, 'QQ')).toBe('01');
      expect(formatPlainDate(testDate, 'QQQQQ')).toBe('1');
    });

    it('formats quarter text', () => {
      expect(formatPlainDate(testDate, 'QQQ')).toBe('Q1');
      expect(formatPlainDate(testDate, 'QQQQ')).toBe('1st quarter');
    });

    it('formats different quarters correctly', () => {
      const q2 = Temporal.PlainDate.from('2025-04-15');
      const q3 = Temporal.PlainDate.from('2025-07-15');
      const q4 = Temporal.PlainDate.from('2025-10-15');

      expect(formatPlainDate(q2, 'Q')).toBe('2');
      expect(formatPlainDate(q3, 'Q')).toBe('3');
      expect(formatPlainDate(q4, 'Q')).toBe('4');
    });
  });

  describe('ordinal suffixes', () => {
    it('formats 1st, 2nd, 3rd correctly', () => {
      const first = Temporal.PlainDate.from('2025-01-01');
      const second = Temporal.PlainDate.from('2025-01-02');
      const third = Temporal.PlainDate.from('2025-01-03');

      expect(formatPlainDate(first, 'do')).toBe('1st');
      expect(formatPlainDate(second, 'do')).toBe('2nd');
      expect(formatPlainDate(third, 'do')).toBe('3rd');
    });

    it('formats 11th, 12th, 13th correctly', () => {
      const eleventh = Temporal.PlainDate.from('2025-01-11');
      const twelfth = Temporal.PlainDate.from('2025-01-12');
      const thirteenth = Temporal.PlainDate.from('2025-01-13');

      expect(formatPlainDate(eleventh, 'do')).toBe('11th');
      expect(formatPlainDate(twelfth, 'do')).toBe('12th');
      expect(formatPlainDate(thirteenth, 'do')).toBe('13th');
    });

    it('formats 21st, 22nd, 23rd correctly', () => {
      const twentyFirst = Temporal.PlainDate.from('2025-01-21');
      const twentySecond = Temporal.PlainDate.from('2025-01-22');
      const twentyThird = Temporal.PlainDate.from('2025-01-23');

      expect(formatPlainDate(twentyFirst, 'do')).toBe('21st');
      expect(formatPlainDate(twentySecond, 'do')).toBe('22nd');
      expect(formatPlainDate(twentyThird, 'do')).toBe('23rd');
    });
  });

  describe('escaped text', () => {
    it('preserves text in single quotes', () => {
      expect(formatPlainDate(testDate, "yyyy-MM-dd 'is the date'")).toBe('2025-01-20 is the date');
    });

    it('handles double single quotes as single quote', () => {
      expect(formatPlainDate(testDate, "MMMM ''yy")).toBe("January '25");
    });

    it('preserves multiple escaped sequences', () => {
      expect(formatPlainDate(testDate, "'Year:' yyyy 'Month:' MM")).toBe('Year: 2025 Month: 01');
    });

    it('escapes special tokens', () => {
      expect(formatPlainDate(testDate, "'yyyy' yyyy")).toBe('yyyy 2025');
    });
  });

  describe('locale support', () => {
    it('formats month names in Spanish', () => {
      expect(formatPlainDate(testDate, 'MMMM', { locale: 'es-ES' })).toBe('enero');
    });

    it('formats weekday names in Spanish', () => {
      expect(formatPlainDate(testDate, 'EEEE', { locale: 'es-ES' })).toBe('lunes');
    });

    it('formats month names in French', () => {
      expect(formatPlainDate(testDate, 'MMMM', { locale: 'fr-FR' })).toBe('janvier');
    });

    it('formats weekday names in German', () => {
      expect(formatPlainDate(testDate, 'EEEE', { locale: 'de-DE' })).toBe('Montag');
    });
  });

  describe('edge cases', () => {
    it('handles single digit values', () => {
      const early = Temporal.PlainDate.from('2025-01-05');
      expect(formatPlainDate(early, 'M/d/yyyy')).toBe('1/5/2025');
    });

    it('formats year 1999 yy token correctly', () => {
      const y1999 = Temporal.PlainDate.from('1999-12-31');
      expect(formatPlainDate(y1999, 'yy')).toBe('99');
    });

    it('formats year 2000 yy token correctly', () => {
      const y2000 = Temporal.PlainDate.from('2000-01-01');
      expect(formatPlainDate(y2000, 'yy')).toBe('00');
    });

    it('handles leap year date', () => {
      const leapDay = Temporal.PlainDate.from('2024-02-29');
      expect(formatPlainDate(leapDay, 'yyyy-MM-dd')).toBe('2024-02-29');
      expect(formatPlainDate(leapDay, 'MMMM do, yyyy')).toBe('February 29th, 2024');
    });

    it('handles end of year', () => {
      const endOfYear = Temporal.PlainDate.from('2025-12-31');
      expect(formatPlainDate(endOfYear, 'yyyy-MM-dd')).toBe('2025-12-31');
      expect(formatPlainDate(endOfYear, 'Q')).toBe('4');
    });
  });

  describe('non-token characters', () => {
    it('preserves spaces and punctuation', () => {
      expect(formatPlainDate(testDate, 'yyyy.MM.dd')).toBe('2025.01.20');
      expect(formatPlainDate(testDate, 'yyyy, MM, dd')).toBe('2025, 01, 20');
    });

    it('preserves non-token letters', () => {
      expect(formatPlainDate(testDate, 'yyyy@MM@dd')).toBe('2025@01@20');
    });
  });
});
