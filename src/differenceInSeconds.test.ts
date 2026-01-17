import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { differenceInSeconds } from './differenceInSeconds';

describe('differenceInSeconds', () => {
  describe('with Instant', () => {
    it('returns the number of seconds between two instants', () => {
      const later = Temporal.Instant.from('2025-01-20T12:30:25Z');
      const earlier = Temporal.Instant.from('2025-01-20T12:30:20Z');

      expect(differenceInSeconds(later, earlier)).toBe(5);
    });

    it('returns negative value when laterDate is before earlierDate', () => {
      const later = Temporal.Instant.from('2025-01-20T12:30:20Z');
      const earlier = Temporal.Instant.from('2025-01-20T12:30:25Z');

      expect(differenceInSeconds(later, earlier)).toBe(-5);
    });

    it('returns 0 when both instants are equal', () => {
      const instant = Temporal.Instant.from('2025-01-20T15:00:00Z');

      expect(differenceInSeconds(instant, instant)).toBe(0);
    });

    it('handles large time differences', () => {
      const later = Temporal.Instant.from('2025-01-20T16:00:00Z');
      const earlier = Temporal.Instant.from('2025-01-20T15:00:00Z');

      // 1 hour = 3600 seconds
      expect(differenceInSeconds(later, earlier)).toBe(3600);
    });

    it('truncates sub-second precision', () => {
      const later = Temporal.Instant.from('2025-01-20T15:00:01.999Z');
      const earlier = Temporal.Instant.from('2025-01-20T15:00:00.001Z');

      // Only full seconds are returned
      expect(differenceInSeconds(later, earlier)).toBe(1);
    });
  });

  describe('with ZonedDateTime', () => {
    it('returns the number of seconds between two zoned datetimes', () => {
      const later = Temporal.ZonedDateTime.from(
        '2025-01-20T15:01:00-05:00[America/New_York]'
      );
      const earlier = Temporal.ZonedDateTime.from(
        '2025-01-20T15:00:00-05:00[America/New_York]'
      );

      expect(differenceInSeconds(later, earlier)).toBe(60);
    });

    it('returns negative value when laterDate is before earlierDate', () => {
      const later = Temporal.ZonedDateTime.from(
        '2025-01-20T15:00:00-05:00[America/New_York]'
      );
      const earlier = Temporal.ZonedDateTime.from(
        '2025-01-20T15:01:00-05:00[America/New_York]'
      );

      expect(differenceInSeconds(later, earlier)).toBe(-60);
    });

    it('compares by instant, not calendar datetime', () => {
      const tokyo = Temporal.ZonedDateTime.from(
        '2025-01-21T00:00:00+09:00[Asia/Tokyo]'
      );
      const ny = Temporal.ZonedDateTime.from(
        '2025-01-20T10:00:00-05:00[America/New_York]'
      );

      // Both represent the same instant
      expect(differenceInSeconds(tokyo, ny)).toBe(0);
    });

    it('handles DST transitions', () => {
      // March 9, 2025: DST begins in New York (2 AM -> 3 AM)
      const beforeDst = Temporal.ZonedDateTime.from(
        '2025-03-09T01:30:00-05:00[America/New_York]'
      );
      const afterDst = Temporal.ZonedDateTime.from(
        '2025-03-09T03:30:00-04:00[America/New_York]'
      );

      // 1 hour of wall-clock time, 1 hour of actual time = 3600 seconds
      expect(differenceInSeconds(afterDst, beforeDst)).toBe(3600);
    });
  });

  describe('with mixed types', () => {
    it('compares Instant with ZonedDateTime', () => {
      const instant = Temporal.Instant.from('2025-01-20T15:00:00Z');
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T10:00:00-05:00[America/New_York]'
      );

      // NY 10:00 is 15:00 UTC - same instant
      expect(differenceInSeconds(instant, zoned)).toBe(0);
    });

    it('compares ZonedDateTime with Instant', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T15:00:00-05:00[America/New_York]'
      );
      const instant = Temporal.Instant.from('2025-01-20T15:00:00Z');

      // NY 15:00 is 20:00 UTC
      // zoned is LATER, so difference is positive 5 hours = 18000 seconds
      expect(differenceInSeconds(zoned, instant)).toBe(18000);
    });
  });

  describe('real-world scenarios', () => {
    it('calculates countdown timer', () => {
      const event = Temporal.ZonedDateTime.from(
        '2025-01-20T18:00:00-05:00[America/New_York]'
      );
      const now = Temporal.ZonedDateTime.from(
        '2025-01-20T17:45:00-05:00[America/New_York]'
      );

      // 15 minutes = 900 seconds
      expect(differenceInSeconds(event, now)).toBe(900);
    });
  });
});
