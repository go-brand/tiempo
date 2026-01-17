import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { differenceInHours } from './differenceInHours';

describe('differenceInHours', () => {
  describe('with Instant', () => {
    it('returns the number of hours between two instants', () => {
      const later = Temporal.Instant.from('2025-01-20T18:00:00Z');
      const earlier = Temporal.Instant.from('2025-01-20T15:00:00Z');

      expect(differenceInHours(later, earlier)).toBe(3);
    });

    it('returns negative value when laterDate is before earlierDate', () => {
      const later = Temporal.Instant.from('2025-01-20T15:00:00Z');
      const earlier = Temporal.Instant.from('2025-01-20T18:00:00Z');

      expect(differenceInHours(later, earlier)).toBe(-3);
    });

    it('returns 0 when both instants are equal', () => {
      const instant = Temporal.Instant.from('2025-01-20T15:00:00Z');

      expect(differenceInHours(instant, instant)).toBe(0);
    });

    it('handles large time differences', () => {
      const later = Temporal.Instant.from('2025-01-22T15:00:00Z');
      const earlier = Temporal.Instant.from('2025-01-20T15:00:00Z');

      // 2 days = 48 hours
      expect(differenceInHours(later, earlier)).toBe(48);
    });

    it('truncates sub-hour precision', () => {
      const later = Temporal.Instant.from('2025-01-20T16:59:59.999Z');
      const earlier = Temporal.Instant.from('2025-01-20T15:00:00.001Z');

      // Only full hours are returned
      expect(differenceInHours(later, earlier)).toBe(1);
    });
  });

  describe('with ZonedDateTime', () => {
    it('returns the number of hours between two zoned datetimes', () => {
      const later = Temporal.ZonedDateTime.from(
        '2025-01-21T00:00:00-05:00[America/New_York]'
      );
      const earlier = Temporal.ZonedDateTime.from(
        '2025-01-20T15:00:00-05:00[America/New_York]'
      );

      expect(differenceInHours(later, earlier)).toBe(9);
    });

    it('returns negative value when laterDate is before earlierDate', () => {
      const later = Temporal.ZonedDateTime.from(
        '2025-01-20T15:00:00-05:00[America/New_York]'
      );
      const earlier = Temporal.ZonedDateTime.from(
        '2025-01-21T00:00:00-05:00[America/New_York]'
      );

      expect(differenceInHours(later, earlier)).toBe(-9);
    });

    it('compares by instant, not calendar datetime', () => {
      const tokyo = Temporal.ZonedDateTime.from(
        '2025-01-21T00:00:00+09:00[Asia/Tokyo]'
      );
      const ny = Temporal.ZonedDateTime.from(
        '2025-01-20T10:00:00-05:00[America/New_York]'
      );

      // Both represent the same instant
      expect(differenceInHours(tokyo, ny)).toBe(0);
    });

    it('handles DST transitions', () => {
      // March 9, 2025: DST begins in New York (2 AM -> 3 AM)
      const beforeDst = Temporal.ZonedDateTime.from(
        '2025-03-09T01:00:00-05:00[America/New_York]'
      );
      const afterDst = Temporal.ZonedDateTime.from(
        '2025-03-09T04:00:00-04:00[America/New_York]'
      );

      // 3 hours of wall-clock time, but only 2 hours of actual time
      expect(differenceInHours(afterDst, beforeDst)).toBe(2);
    });

    it('handles DST fall back', () => {
      // November 2, 2025: DST ends in New York (2 AM -> 1 AM)
      const beforeFallback = Temporal.ZonedDateTime.from(
        '2025-11-02T00:00:00-04:00[America/New_York]'
      );
      const afterFallback = Temporal.ZonedDateTime.from(
        '2025-11-02T02:00:00-05:00[America/New_York]'
      );

      // 2 hours of wall-clock time, but 3 hours of actual time
      expect(differenceInHours(afterFallback, beforeFallback)).toBe(3);
    });
  });

  describe('with mixed types', () => {
    it('compares Instant with ZonedDateTime', () => {
      const instant = Temporal.Instant.from('2025-01-20T15:00:00Z');
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T10:00:00-05:00[America/New_York]'
      );

      // NY 10:00 is 15:00 UTC - same instant
      expect(differenceInHours(instant, zoned)).toBe(0);
    });

    it('compares ZonedDateTime with Instant', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-21T00:00:00-05:00[America/New_York]'
      );
      const instant = Temporal.Instant.from('2025-01-20T15:00:00Z');

      // NY midnight is 05:00 UTC next day
      // Difference is 14 hours
      expect(differenceInHours(zoned, instant)).toBe(14);
    });
  });

  describe('real-world scenarios', () => {
    it('calculates work day duration', () => {
      const endOfDay = Temporal.ZonedDateTime.from(
        '2025-01-20T17:00:00-05:00[America/New_York]'
      );
      const startOfDay = Temporal.ZonedDateTime.from(
        '2025-01-20T09:00:00-05:00[America/New_York]'
      );

      expect(differenceInHours(endOfDay, startOfDay)).toBe(8);
    });

    it('calculates time until deadline', () => {
      const deadline = Temporal.ZonedDateTime.from(
        '2025-01-22T23:59:59-05:00[America/New_York]'
      );
      const now = Temporal.ZonedDateTime.from(
        '2025-01-20T15:00:00-05:00[America/New_York]'
      );

      // Approximately 57 hours
      expect(differenceInHours(deadline, now)).toBe(56);
    });
  });
});
