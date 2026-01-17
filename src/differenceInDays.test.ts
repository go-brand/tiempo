import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { differenceInDays } from './differenceInDays';

describe('differenceInDays', () => {
  describe('with Instant', () => {
    it('returns the number of days between two instants', () => {
      const later = Temporal.Instant.from('2025-01-25T12:00:00Z');
      const earlier = Temporal.Instant.from('2025-01-20T12:00:00Z');

      expect(differenceInDays(later, earlier)).toBe(5);
    });

    it('returns negative value when laterDate is before earlierDate', () => {
      const later = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const earlier = Temporal.Instant.from('2025-01-25T12:00:00Z');

      expect(differenceInDays(later, earlier)).toBe(-5);
    });

    it('returns 0 when both instants are equal', () => {
      const instant = Temporal.Instant.from('2025-01-20T15:00:00Z');

      expect(differenceInDays(instant, instant)).toBe(0);
    });

    it('returns fractional days for partial day differences', () => {
      const later = Temporal.Instant.from('2025-01-21T12:00:00Z');
      const earlier = Temporal.Instant.from('2025-01-20T00:00:00Z');

      // 1.5 days
      expect(differenceInDays(later, earlier)).toBe(1.5);
    });

    it('truncates to whole days when difference is less than 24 hours', () => {
      const later = Temporal.Instant.from('2025-01-20T23:59:59Z');
      const earlier = Temporal.Instant.from('2025-01-20T00:00:00Z');

      expect(differenceInDays(later, earlier)).toBeLessThan(1);
    });
  });

  describe('with ZonedDateTime', () => {
    it('returns the number of days between two zoned datetimes', () => {
      const later = Temporal.ZonedDateTime.from(
        '2025-01-25T15:00:00-05:00[America/New_York]'
      );
      const earlier = Temporal.ZonedDateTime.from(
        '2025-01-20T15:00:00-05:00[America/New_York]'
      );

      expect(differenceInDays(later, earlier)).toBe(5);
    });

    it('returns negative value when laterDate is before earlierDate', () => {
      const later = Temporal.ZonedDateTime.from(
        '2025-01-20T15:00:00-05:00[America/New_York]'
      );
      const earlier = Temporal.ZonedDateTime.from(
        '2025-01-25T15:00:00-05:00[America/New_York]'
      );

      expect(differenceInDays(later, earlier)).toBe(-5);
    });

    it('compares by instant in the timezone', () => {
      const tokyo = Temporal.ZonedDateTime.from(
        '2025-01-21T00:00:00+09:00[Asia/Tokyo]'
      );
      const ny = Temporal.ZonedDateTime.from(
        '2025-01-20T10:00:00-05:00[America/New_York]'
      );

      // Both represent the same instant
      expect(differenceInDays(tokyo, ny)).toBe(0);
    });

    it('handles DST spring forward - day is 23 hours', () => {
      // March 9, 2025: DST begins in New York (2 AM -> 3 AM)
      const afterDst = Temporal.ZonedDateTime.from(
        '2025-03-10T12:00:00[America/New_York]'
      );
      const beforeDst = Temporal.ZonedDateTime.from(
        '2025-03-09T12:00:00[America/New_York]'
      );

      // 1 calendar day (even though it's only 23 hours)
      expect(differenceInDays(afterDst, beforeDst)).toBe(1);
    });

    it('handles DST fall back - day is 25 hours', () => {
      // November 2, 2025: DST ends in New York (2 AM -> 1 AM)
      const afterFallback = Temporal.ZonedDateTime.from(
        '2025-11-03T12:00:00[America/New_York]'
      );
      const beforeFallback = Temporal.ZonedDateTime.from(
        '2025-11-02T12:00:00[America/New_York]'
      );

      // 1 calendar day (even though it's 25 hours)
      expect(differenceInDays(afterFallback, beforeFallback)).toBe(1);
    });
  });

  describe('with mixed types', () => {
    it('compares Instant with ZonedDateTime', () => {
      const instant = Temporal.Instant.from('2025-01-25T15:00:00Z');
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T10:00:00-05:00[America/New_York]'
      );

      // NY 10:00 is 15:00 UTC, so exactly 5 days
      expect(differenceInDays(instant, zoned)).toBe(5);
    });

    it('compares ZonedDateTime with Instant', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-25T15:00:00-05:00[America/New_York]'
      );
      const instant = Temporal.Instant.from('2025-01-20T20:00:00Z');

      // NY 15:00 is 20:00 UTC, so exactly 5 days
      expect(differenceInDays(zoned, instant)).toBe(5);
    });
  });

  describe('real-world scenarios', () => {
    it('calculates days until event', () => {
      const event = Temporal.ZonedDateTime.from(
        '2025-02-14T19:00:00-05:00[America/New_York]'
      );
      const now = Temporal.ZonedDateTime.from(
        '2025-01-20T15:00:00-05:00[America/New_York]'
      );

      expect(differenceInDays(event, now)).toBeCloseTo(25.166, 1);
    });

    it('calculates age in days', () => {
      const today = Temporal.ZonedDateTime.from(
        '2025-01-20T12:00:00Z[UTC]'
      );
      const birthday = Temporal.ZonedDateTime.from(
        '2020-01-20T12:00:00Z[UTC]'
      );

      // 5 years = approximately 1826 or 1827 days (with leap years)
      expect(differenceInDays(today, birthday)).toBeGreaterThan(1825);
    });

    it('calculates project duration', () => {
      const projectEnd = Temporal.ZonedDateTime.from(
        '2025-03-31T17:00:00[America/New_York]'
      );
      const projectStart = Temporal.ZonedDateTime.from(
        '2025-01-01T09:00:00[America/New_York]'
      );

      // Q1 2025: approximately 89-90 days
      expect(differenceInDays(projectEnd, projectStart)).toBeCloseTo(89.3, 0);
    });
  });

  describe('edge cases', () => {
    it('handles dates across year boundaries', () => {
      const later = Temporal.Instant.from('2025-01-05T00:00:00Z');
      const earlier = Temporal.Instant.from('2024-12-30T00:00:00Z');

      expect(differenceInDays(later, earlier)).toBe(6);
    });

    it('handles leap year', () => {
      const afterLeapDay = Temporal.Instant.from('2024-03-01T00:00:00Z');
      const beforeLeapDay = Temporal.Instant.from('2024-02-28T00:00:00Z');

      // Feb 29, 2024 exists (leap year)
      expect(differenceInDays(afterLeapDay, beforeLeapDay)).toBe(2);
    });

    it('handles non-leap year', () => {
      const afterFeb = Temporal.Instant.from('2025-03-01T00:00:00Z');
      const beforeFeb = Temporal.Instant.from('2025-02-28T00:00:00Z');

      // Feb 29, 2025 doesn't exist
      expect(differenceInDays(afterFeb, beforeFeb)).toBe(1);
    });
  });
});
