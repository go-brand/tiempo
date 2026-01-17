import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { differenceInMonths } from './differenceInMonths';

describe('differenceInMonths', () => {
  describe('with Instant', () => {
    it('returns the number of months between two instants', () => {
      const later = Temporal.Instant.from('2025-04-20T12:00:00Z');
      const earlier = Temporal.Instant.from('2025-01-20T12:00:00Z');

      expect(differenceInMonths(later, earlier)).toBe(3);
    });

    it('returns negative value when laterDate is before earlierDate', () => {
      const later = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const earlier = Temporal.Instant.from('2025-04-20T12:00:00Z');

      expect(differenceInMonths(later, earlier)).toBe(-3);
    });

    it('returns 0 when both instants are equal', () => {
      const instant = Temporal.Instant.from('2025-01-20T15:00:00Z');

      expect(differenceInMonths(instant, instant)).toBe(0);
    });

    it('returns fractional months for partial month differences', () => {
      const later = Temporal.Instant.from('2025-02-05T12:00:00Z');
      const earlier = Temporal.Instant.from('2025-01-20T12:00:00Z');

      // About half a month
      const result = differenceInMonths(later, earlier);
      expect(result).toBeGreaterThan(0.4);
      expect(result).toBeLessThan(0.6);
    });

    it('handles year boundaries', () => {
      const later = Temporal.Instant.from('2025-03-15T12:00:00Z');
      const earlier = Temporal.Instant.from('2024-12-15T12:00:00Z');

      // 3 months
      expect(differenceInMonths(later, earlier)).toBe(3);
    });
  });

  describe('with ZonedDateTime', () => {
    it('returns the number of months between two zoned datetimes', () => {
      const later = Temporal.ZonedDateTime.from(
        '2025-06-15T15:00:00[America/New_York]'
      );
      const earlier = Temporal.ZonedDateTime.from(
        '2025-01-15T15:00:00-05:00[America/New_York]'
      );

      expect(differenceInMonths(later, earlier)).toBe(5);
    });

    it('returns negative value when laterDate is before earlierDate', () => {
      const later = Temporal.ZonedDateTime.from(
        '2025-01-15T15:00:00-05:00[America/New_York]'
      );
      const earlier = Temporal.ZonedDateTime.from(
        '2025-06-15T15:00:00[America/New_York]'
      );

      expect(differenceInMonths(later, earlier)).toBe(-5);
    });

    it('compares by instant in the timezone', () => {
      const tokyo = Temporal.ZonedDateTime.from(
        '2025-01-21T00:00:00+09:00[Asia/Tokyo]'
      );
      const ny = Temporal.ZonedDateTime.from(
        '2025-01-20T10:00:00-05:00[America/New_York]'
      );

      // Both represent the same instant
      expect(differenceInMonths(tokyo, ny)).toBe(0);
    });

    it('handles months with different numbers of days', () => {
      // January has 31 days, February has 28 days
      const marchFirst = Temporal.ZonedDateTime.from(
        '2025-03-01T12:00:00Z[UTC]'
      );
      const janFirst = Temporal.ZonedDateTime.from(
        '2025-01-01T12:00:00Z[UTC]'
      );

      expect(differenceInMonths(marchFirst, janFirst)).toBe(2);
    });

    it('handles leap years', () => {
      // 2024 is a leap year
      const marchFirst = Temporal.ZonedDateTime.from(
        '2024-03-01T12:00:00Z[UTC]'
      );
      const janFirst = Temporal.ZonedDateTime.from(
        '2024-01-01T12:00:00Z[UTC]'
      );

      expect(differenceInMonths(marchFirst, janFirst)).toBe(2);
    });
  });

  describe('with mixed types', () => {
    it('compares Instant with ZonedDateTime', () => {
      const instant = Temporal.Instant.from('2025-06-15T15:00:00Z');
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-15T10:00:00-05:00[America/New_York]'
      );

      // NY 10:00 is 15:00 UTC - approximately 5 months
      expect(differenceInMonths(instant, zoned)).toBeCloseTo(5, 1);
    });
  });

  describe('real-world scenarios', () => {
    it('calculates subscription duration', () => {
      const subscriptionEnd = Temporal.ZonedDateTime.from(
        '2025-07-01T00:00:00Z[UTC]'
      );
      const subscriptionStart = Temporal.ZonedDateTime.from(
        '2025-01-01T00:00:00Z[UTC]'
      );

      // 6 months
      expect(differenceInMonths(subscriptionEnd, subscriptionStart)).toBe(6);
    });

    it('calculates baby age', () => {
      const now = Temporal.ZonedDateTime.from(
        '2025-09-15T12:00:00Z[UTC]'
      );
      const birthdate = Temporal.ZonedDateTime.from(
        '2025-01-15T12:00:00Z[UTC]'
      );

      // 8 months old
      expect(differenceInMonths(now, birthdate)).toBe(8);
    });

    it('calculates trial period remaining', () => {
      const trialEnd = Temporal.ZonedDateTime.from(
        '2025-03-01T00:00:00-05:00[America/New_York]'
      );
      const now = Temporal.ZonedDateTime.from(
        '2025-01-15T15:00:00-05:00[America/New_York]'
      );

      // About 1.5 months
      const result = differenceInMonths(trialEnd, now);
      expect(result).toBeGreaterThan(1);
      expect(result).toBeLessThan(2);
    });
  });

  describe('edge cases', () => {
    it('handles same month different years', () => {
      const later = Temporal.Instant.from('2026-01-15T00:00:00Z');
      const earlier = Temporal.Instant.from('2025-01-15T00:00:00Z');

      // 12 months
      expect(differenceInMonths(later, earlier)).toBe(12);
    });

    it('handles end of month edge cases', () => {
      // Jan 31 to Feb 28
      const feb28 = Temporal.ZonedDateTime.from(
        '2025-02-28T12:00:00Z[UTC]'
      );
      const jan31 = Temporal.ZonedDateTime.from(
        '2025-01-31T12:00:00Z[UTC]'
      );

      const result = differenceInMonths(feb28, jan31);
      // About 1 month (28 days in Feb from Jan 31)
      expect(result).toBeGreaterThan(0.9);
    });

    it('handles very small differences', () => {
      const later = Temporal.Instant.from('2025-01-15T12:00:00Z');
      const earlier = Temporal.Instant.from('2025-01-15T00:00:00Z');

      // Less than a day
      expect(differenceInMonths(later, earlier)).toBeLessThan(0.02);
    });
  });
});
