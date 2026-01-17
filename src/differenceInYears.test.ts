import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { differenceInYears } from './differenceInYears';

describe('differenceInYears', () => {
  describe('with Instant', () => {
    it('returns the number of years between two instants', () => {
      const later = Temporal.Instant.from('2028-01-20T12:00:00Z');
      const earlier = Temporal.Instant.from('2025-01-20T12:00:00Z');

      expect(differenceInYears(later, earlier)).toBe(3);
    });

    it('returns negative value when laterDate is before earlierDate', () => {
      const later = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const earlier = Temporal.Instant.from('2028-01-20T12:00:00Z');

      expect(differenceInYears(later, earlier)).toBe(-3);
    });

    it('returns 0 when both instants are equal', () => {
      const instant = Temporal.Instant.from('2025-01-20T15:00:00Z');

      expect(differenceInYears(instant, instant)).toBe(0);
    });

    it('returns fractional years for partial year differences', () => {
      const later = Temporal.Instant.from('2025-07-20T12:00:00Z');
      const earlier = Temporal.Instant.from('2025-01-20T12:00:00Z');

      // About half a year (6 months)
      const result = differenceInYears(later, earlier);
      expect(result).toBeGreaterThan(0.45);
      expect(result).toBeLessThan(0.55);
    });

    it('handles leap years', () => {
      // 2024 is a leap year
      const endOf2024 = Temporal.Instant.from('2024-12-31T23:59:59Z');
      const startOf2024 = Temporal.Instant.from('2024-01-01T00:00:00Z');

      const result = differenceInYears(endOf2024, startOf2024);
      // Almost 1 year (366 days in leap year)
      expect(result).toBeGreaterThan(0.99);
      expect(result).toBeLessThan(1);
    });
  });

  describe('with ZonedDateTime', () => {
    it('returns the number of years between two zoned datetimes', () => {
      const later = Temporal.ZonedDateTime.from(
        '2030-06-15T15:00:00[America/New_York]'
      );
      const earlier = Temporal.ZonedDateTime.from(
        '2025-06-15T15:00:00[America/New_York]'
      );

      expect(differenceInYears(later, earlier)).toBe(5);
    });

    it('returns negative value when laterDate is before earlierDate', () => {
      const later = Temporal.ZonedDateTime.from(
        '2025-06-15T15:00:00[America/New_York]'
      );
      const earlier = Temporal.ZonedDateTime.from(
        '2030-06-15T15:00:00[America/New_York]'
      );

      expect(differenceInYears(later, earlier)).toBe(-5);
    });

    it('compares by instant in the timezone', () => {
      const tokyo = Temporal.ZonedDateTime.from(
        '2025-01-21T00:00:00+09:00[Asia/Tokyo]'
      );
      const ny = Temporal.ZonedDateTime.from(
        '2025-01-20T10:00:00-05:00[America/New_York]'
      );

      // Both represent the same instant
      expect(differenceInYears(tokyo, ny)).toBe(0);
    });

    it('handles same date different years', () => {
      const later = Temporal.ZonedDateTime.from(
        '2030-01-15T12:00:00Z[UTC]'
      );
      const earlier = Temporal.ZonedDateTime.from(
        '2025-01-15T12:00:00Z[UTC]'
      );

      expect(differenceInYears(later, earlier)).toBe(5);
    });
  });

  describe('with mixed types', () => {
    it('compares Instant with ZonedDateTime', () => {
      const instant = Temporal.Instant.from('2030-06-15T15:00:00Z');
      const zoned = Temporal.ZonedDateTime.from(
        '2025-06-15T10:00:00[America/New_York]'
      );

      // NY 10:00 is 14:00 UTC in June (DST) - approximately 5 years
      expect(differenceInYears(instant, zoned)).toBeCloseTo(5, 1);
    });
  });

  describe('real-world scenarios', () => {
    it('calculates age', () => {
      const today = Temporal.ZonedDateTime.from(
        '2025-01-20T12:00:00Z[UTC]'
      );
      const birthdate = Temporal.ZonedDateTime.from(
        '1990-01-20T12:00:00Z[UTC]'
      );

      // 35 years old
      expect(differenceInYears(today, birthdate)).toBe(35);
    });

    it('calculates company age', () => {
      const now = Temporal.ZonedDateTime.from(
        '2025-01-15T12:00:00Z[UTC]'
      );
      const founded = Temporal.ZonedDateTime.from(
        '2020-01-15T12:00:00Z[UTC]'
      );

      // 5 years
      expect(differenceInYears(now, founded)).toBe(5);
    });

    it('calculates time until retirement', () => {
      const retirement = Temporal.ZonedDateTime.from(
        '2045-12-31T23:59:59Z[UTC]'
      );
      const now = Temporal.ZonedDateTime.from(
        '2025-01-20T12:00:00Z[UTC]'
      );

      // About 20-21 years
      const result = differenceInYears(retirement, now);
      expect(result).toBeGreaterThan(20);
      expect(result).toBeLessThan(21);
    });

    it('calculates loan duration', () => {
      const loanEnd = Temporal.ZonedDateTime.from(
        '2055-01-01T00:00:00Z[UTC]'
      );
      const loanStart = Temporal.ZonedDateTime.from(
        '2025-01-01T00:00:00Z[UTC]'
      );

      // 30-year mortgage
      expect(differenceInYears(loanEnd, loanStart)).toBe(30);
    });
  });

  describe('edge cases', () => {
    it('handles birthdays not yet occurred in the year', () => {
      // Born Jan 20, checking on Jan 15 (birthday hasn't happened yet)
      const today = Temporal.ZonedDateTime.from(
        '2025-01-15T12:00:00Z[UTC]'
      );
      const birthdate = Temporal.ZonedDateTime.from(
        '1990-01-20T12:00:00Z[UTC]'
      );

      const result = differenceInYears(today, birthdate);
      // Should be 34.x (not yet 35)
      expect(result).toBeGreaterThan(34.9);
      expect(result).toBeLessThan(35);
    });

    it('handles birthdays just occurred in the year', () => {
      // Born Jan 20, checking on Jan 21 (birthday just happened)
      const today = Temporal.ZonedDateTime.from(
        '2025-01-21T12:00:00Z[UTC]'
      );
      const birthdate = Temporal.ZonedDateTime.from(
        '1990-01-20T12:00:00Z[UTC]'
      );

      const result = differenceInYears(today, birthdate);
      // Should be 35.x (just turned 35)
      expect(result).toBeGreaterThan(35);
      expect(result).toBeLessThan(35.01);
    });

    it('handles leap day births', () => {
      // Born Feb 29, 2000 (leap year)
      const today = Temporal.ZonedDateTime.from(
        '2025-03-01T12:00:00Z[UTC]'
      );
      const birthdate = Temporal.ZonedDateTime.from(
        '2000-02-29T12:00:00Z[UTC]'
      );

      const result = differenceInYears(today, birthdate);
      // Should be 25.x years
      expect(result).toBeGreaterThan(25);
      expect(result).toBeLessThan(25.01);
    });

    it('handles very small differences', () => {
      const later = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const earlier = Temporal.Instant.from('2025-01-20T00:00:00Z');

      // Less than a day
      expect(differenceInYears(later, earlier)).toBeLessThan(0.002);
    });

    it('handles century differences', () => {
      const later = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const earlier = Temporal.Instant.from('1925-01-20T12:00:00Z');

      // 100 years
      expect(differenceInYears(later, earlier)).toBe(100);
    });
  });
});
