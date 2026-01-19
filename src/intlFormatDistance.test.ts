import { describe, it, expect } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { intlFormatDistance } from './intlFormatDistance.js';

describe('intlFormatDistance', () => {
  describe('basic functionality', () => {
    it('returns "in 1 hour" for hour difference with Instant inputs', () => {
      const earlier = Temporal.Instant.from('2024-01-01T10:00:00Z');
      const later = Temporal.Instant.from('2024-01-01T11:00:00Z');

      const result = intlFormatDistance(later, earlier);
      expect(result).toBe('in 1 hour');
    });

    it('returns "1 hour ago" when laterDate is before earlierDate', () => {
      const earlier = Temporal.Instant.from('2024-01-01T10:00:00Z');
      const later = Temporal.Instant.from('2024-01-01T11:00:00Z');

      const result = intlFormatDistance(earlier, later);
      expect(result).toBe('1 hour ago');
    });

    it('returns "in X days" for day difference', () => {
      const earlier = Temporal.Instant.from('2024-01-01T00:00:00Z');
      const later = Temporal.Instant.from('2024-01-05T00:00:00Z');

      const result = intlFormatDistance(later, earlier);
      expect(result).toBe('in 4 days');
    });

    it('returns "in X months" for month difference', () => {
      const earlier = Temporal.Instant.from('2024-01-01T00:00:00Z');
      const later = Temporal.Instant.from('2024-06-01T00:00:00Z');

      const result = intlFormatDistance(later, earlier);
      expect(result).toBe('in 5 months');
    });

    it('returns "in X years" for year difference', () => {
      const earlier = Temporal.Instant.from('2024-01-01T00:00:00Z');
      const later = Temporal.Instant.from('2026-01-01T00:00:00Z');

      const result = intlFormatDistance(later, earlier);
      expect(result).toBe('in 2 years');
    });
  });

  describe('automatic unit selection', () => {
    it('uses seconds for < 60 seconds', () => {
      const earlier = Temporal.Instant.from('2024-01-01T10:00:00Z');
      const later = Temporal.Instant.from('2024-01-01T10:00:45Z');

      const result = intlFormatDistance(later, earlier);
      expect(result).toBe('in 45 seconds');
    });

    it('uses minutes for < 60 minutes', () => {
      const earlier = Temporal.Instant.from('2024-01-01T10:00:00Z');
      const later = Temporal.Instant.from('2024-01-01T10:45:00Z');

      const result = intlFormatDistance(later, earlier);
      expect(result).toBe('in 45 minutes');
    });

    it('uses hours for < 24 hours', () => {
      const earlier = Temporal.Instant.from('2024-01-01T10:00:00Z');
      const later = Temporal.Instant.from('2024-01-01T20:00:00Z');

      const result = intlFormatDistance(later, earlier);
      expect(result).toBe('in 10 hours');
    });

    it('uses days for < 7 days', () => {
      const earlier = Temporal.Instant.from('2024-01-01T00:00:00Z');
      const later = Temporal.Instant.from('2024-01-05T00:00:00Z');

      const result = intlFormatDistance(later, earlier);
      expect(result).toBe('in 4 days');
    });

    it('uses "tomorrow" for 1 day with numeric: auto', () => {
      const earlier = Temporal.Instant.from('2024-01-01T00:00:00Z');
      const later = Temporal.Instant.from('2024-01-02T00:00:00Z');

      const result = intlFormatDistance(later, earlier);
      expect(result).toBe('tomorrow');
    });

    it('uses weeks for < 4 weeks', () => {
      const earlier = Temporal.Instant.from('2024-01-01T00:00:00Z');
      const later = Temporal.Instant.from('2024-01-15T00:00:00Z');

      const result = intlFormatDistance(later, earlier);
      expect(result).toBe('in 2 weeks');
    });

    it('uses "next week" for 1 week with numeric: auto', () => {
      const earlier = Temporal.Instant.from('2024-01-01T00:00:00Z');
      const later = Temporal.Instant.from('2024-01-08T00:00:00Z');

      const result = intlFormatDistance(later, earlier);
      expect(result).toBe('next week');
    });

    it('uses months for < 12 months', () => {
      const earlier = Temporal.Instant.from('2024-01-01T00:00:00Z');
      const later = Temporal.Instant.from('2024-06-01T00:00:00Z');

      const result = intlFormatDistance(later, earlier);
      expect(result).toBe('in 5 months');
    });

    it('uses "next month" for 1 month with numeric: auto', () => {
      const earlier = Temporal.Instant.from('2024-01-01T00:00:00Z');
      const later = Temporal.Instant.from('2024-02-01T00:00:00Z');

      const result = intlFormatDistance(later, earlier);
      expect(result).toBe('next month');
    });

    it('uses years for >= 12 months', () => {
      const earlier = Temporal.Instant.from('2024-01-01T00:00:00Z');
      const later = Temporal.Instant.from('2026-01-01T00:00:00Z');

      const result = intlFormatDistance(later, earlier);
      expect(result).toBe('in 2 years');
    });

    it('uses "next year" for 1 year with numeric: auto', () => {
      const earlier = Temporal.Instant.from('2024-01-01T00:00:00Z');
      const later = Temporal.Instant.from('2025-01-01T00:00:00Z');

      const result = intlFormatDistance(later, earlier);
      expect(result).toBe('next year');
    });
  });

  describe('forced unit option', () => {
    it('forces quarters when specified', () => {
      const earlier = Temporal.Instant.from('2024-01-01T00:00:00Z');
      const later = Temporal.Instant.from('2025-04-01T00:00:00Z');

      const result = intlFormatDistance(later, earlier, { unit: 'quarter' });
      expect(result).toBe('in 5 quarters');
    });

    it('forces seconds for large differences', () => {
      const earlier = Temporal.Instant.from('2024-01-01T00:00:00Z');
      const later = Temporal.Instant.from('2024-01-01T10:00:00Z');

      const result = intlFormatDistance(later, earlier, { unit: 'second' });
      expect(result).toBe('in 36,000 seconds');
    });

    it('forces minutes when specified', () => {
      const earlier = Temporal.Instant.from('2024-01-01T00:00:00Z');
      const later = Temporal.Instant.from('2024-01-01T02:00:00Z');

      const result = intlFormatDistance(later, earlier, { unit: 'minute' });
      expect(result).toBe('in 120 minutes');
    });
  });

  describe('locale option', () => {
    it('formats in Spanish when locale is "es"', () => {
      const earlier = Temporal.Instant.from('2024-01-01T10:00:00Z');
      const later = Temporal.Instant.from('2024-01-01T11:00:00Z');

      const result = intlFormatDistance(later, earlier, { locale: 'es' });
      expect(result).toBe('dentro de 1 hora');
    });

    it('formats in Japanese when locale is "ja"', () => {
      const earlier = Temporal.Instant.from('2024-01-01T10:00:00Z');
      const later = Temporal.Instant.from('2024-01-01T11:00:00Z');

      const result = intlFormatDistance(later, earlier, { locale: 'ja' });
      expect(result).toBe('1 時間後');
    });

    it('uses system default locale when not specified', () => {
      const earlier = Temporal.Instant.from('2024-01-01T10:00:00Z');
      const later = Temporal.Instant.from('2024-01-01T11:00:00Z');

      const result = intlFormatDistance(later, earlier);
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('numeric option', () => {
    it('uses "tomorrow" with numeric: auto (default)', () => {
      const earlier = Temporal.Instant.from('2024-01-01T00:00:00Z');
      const later = Temporal.Instant.from('2024-01-02T00:00:00Z');

      const result = intlFormatDistance(later, earlier);
      expect(result).toBe('tomorrow');
    });

    it('uses "in 1 day" with numeric: always', () => {
      const earlier = Temporal.Instant.from('2024-01-01T00:00:00Z');
      const later = Temporal.Instant.from('2024-01-02T00:00:00Z');

      const result = intlFormatDistance(later, earlier, { numeric: 'always' });
      expect(result).toBe('in 1 day');
    });

    it('uses "yesterday" with numeric: auto for -1 day', () => {
      const earlier = Temporal.Instant.from('2024-01-01T00:00:00Z');
      const later = Temporal.Instant.from('2024-01-02T00:00:00Z');

      const result = intlFormatDistance(earlier, later);
      expect(result).toBe('yesterday');
    });

    it('uses "1 day ago" with numeric: always for -1 day', () => {
      const earlier = Temporal.Instant.from('2024-01-01T00:00:00Z');
      const later = Temporal.Instant.from('2024-01-02T00:00:00Z');

      const result = intlFormatDistance(earlier, later, { numeric: 'always' });
      expect(result).toBe('1 day ago');
    });
  });

  describe('style option', () => {
    it('uses long style by default', () => {
      const earlier = Temporal.Instant.from('2024-01-01T00:00:00Z');
      const later = Temporal.Instant.from('2026-01-01T00:00:00Z');

      const result = intlFormatDistance(later, earlier);
      expect(result).toBe('in 2 years');
    });

    it('uses short style when specified', () => {
      const earlier = Temporal.Instant.from('2024-01-01T00:00:00Z');
      const later = Temporal.Instant.from('2026-01-01T00:00:00Z');

      const result = intlFormatDistance(later, earlier, { style: 'short' });
      expect(result).toBe('in 2 yr.');
    });

    it('uses narrow style when specified', () => {
      const earlier = Temporal.Instant.from('2024-01-01T00:00:00Z');
      const later = Temporal.Instant.from('2026-01-01T00:00:00Z');

      const result = intlFormatDistance(later, earlier, { style: 'narrow' });
      expect(result).toBe('in 2y');
    });
  });

  describe('edge cases', () => {
    it('handles zero difference (same instant)', () => {
      const instant = Temporal.Instant.from('2024-01-01T00:00:00Z');

      const result = intlFormatDistance(instant, instant);
      // With numeric: 'auto' (default), 0 seconds is formatted as "now"
      expect(result).toBe('now');
    });

    it('handles very small differences (< 1 second)', () => {
      const earlier = Temporal.Instant.from('2024-01-01T00:00:00.000Z');
      const later = Temporal.Instant.from('2024-01-01T00:00:00.500Z');

      const result = intlFormatDistance(later, earlier);
      // With numeric: 'auto' (default), 0 seconds is formatted as "now"
      expect(result).toBe('now');
    });

    it('compares by instant, not wall-clock time (cross-timezone)', () => {
      const instant1 = Temporal.Instant.from('2024-01-01T10:00:00Z');
      const instant2 = Temporal.Instant.from('2024-01-01T11:00:00Z');

      const zoned1 = instant1.toZonedDateTimeISO('America/New_York');
      const zoned2 = instant2.toZonedDateTimeISO('Asia/Tokyo');

      const result = intlFormatDistance(zoned2, zoned1);
      expect(result).toBe('in 1 hour');
    });
  });

  describe('with ZonedDateTime inputs', () => {
    it('works with both ZonedDateTime in same timezone', () => {
      const earlier = Temporal.ZonedDateTime.from(
        '2024-01-01T10:00:00-05:00[America/New_York]'
      );
      const later = Temporal.ZonedDateTime.from(
        '2024-01-01T11:00:00-05:00[America/New_York]'
      );

      const result = intlFormatDistance(later, earlier);
      expect(result).toBe('in 1 hour');
    });

    it('works with ZonedDateTime in different timezones', () => {
      const earlier = Temporal.ZonedDateTime.from(
        '2024-01-01T10:00:00-05:00[America/New_York]'
      );
      const later = Temporal.ZonedDateTime.from(
        '2024-01-01T17:00:00+01:00[Europe/Paris]'
      );

      const result = intlFormatDistance(later, earlier);
      expect(result).toBe('in 1 hour');
    });

    it('works with mixed Instant and ZonedDateTime', () => {
      const earlier = Temporal.Instant.from('2024-01-01T10:00:00Z');
      const later = Temporal.ZonedDateTime.from(
        '2024-01-01T11:00:00+00:00[UTC]'
      );

      const result = intlFormatDistance(later, earlier);
      expect(result).toBe('in 1 hour');
    });
  });
});
