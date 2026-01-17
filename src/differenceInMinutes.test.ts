import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { differenceInMinutes } from './differenceInMinutes';

describe('differenceInMinutes', () => {
  describe('with Instant', () => {
    it('returns the number of minutes between two instants', () => {
      const later = Temporal.Instant.from('2025-01-20T12:45:00Z');
      const earlier = Temporal.Instant.from('2025-01-20T12:30:00Z');

      expect(differenceInMinutes(later, earlier)).toBe(15);
    });

    it('returns negative value when laterDate is before earlierDate', () => {
      const later = Temporal.Instant.from('2025-01-20T12:30:00Z');
      const earlier = Temporal.Instant.from('2025-01-20T12:45:00Z');

      expect(differenceInMinutes(later, earlier)).toBe(-15);
    });

    it('returns 0 when both instants are equal', () => {
      const instant = Temporal.Instant.from('2025-01-20T15:00:00Z');

      expect(differenceInMinutes(instant, instant)).toBe(0);
    });

    it('handles large time differences', () => {
      const later = Temporal.Instant.from('2025-01-20T16:00:00Z');
      const earlier = Temporal.Instant.from('2025-01-20T15:00:00Z');

      // 1 hour = 60 minutes
      expect(differenceInMinutes(later, earlier)).toBe(60);
    });

    it('truncates sub-minute precision', () => {
      const later = Temporal.Instant.from('2025-01-20T15:01:59.999Z');
      const earlier = Temporal.Instant.from('2025-01-20T15:00:00.001Z');

      // Only full minutes are returned
      expect(differenceInMinutes(later, earlier)).toBe(1);
    });
  });

  describe('with ZonedDateTime', () => {
    it('returns the number of minutes between two zoned datetimes', () => {
      const later = Temporal.ZonedDateTime.from(
        '2025-01-20T16:00:00-05:00[America/New_York]'
      );
      const earlier = Temporal.ZonedDateTime.from(
        '2025-01-20T15:00:00-05:00[America/New_York]'
      );

      expect(differenceInMinutes(later, earlier)).toBe(60);
    });

    it('returns negative value when laterDate is before earlierDate', () => {
      const later = Temporal.ZonedDateTime.from(
        '2025-01-20T15:00:00-05:00[America/New_York]'
      );
      const earlier = Temporal.ZonedDateTime.from(
        '2025-01-20T16:00:00-05:00[America/New_York]'
      );

      expect(differenceInMinutes(later, earlier)).toBe(-60);
    });

    it('compares by instant, not calendar datetime', () => {
      const tokyo = Temporal.ZonedDateTime.from(
        '2025-01-21T00:00:00+09:00[Asia/Tokyo]'
      );
      const ny = Temporal.ZonedDateTime.from(
        '2025-01-20T10:00:00-05:00[America/New_York]'
      );

      // Both represent the same instant
      expect(differenceInMinutes(tokyo, ny)).toBe(0);
    });

    it('handles DST transitions', () => {
      // March 9, 2025: DST begins in New York (2 AM -> 3 AM)
      const beforeDst = Temporal.ZonedDateTime.from(
        '2025-03-09T01:30:00-05:00[America/New_York]'
      );
      const afterDst = Temporal.ZonedDateTime.from(
        '2025-03-09T03:30:00-04:00[America/New_York]'
      );

      // 1 hour of wall-clock time, 1 hour of actual time = 60 minutes
      expect(differenceInMinutes(afterDst, beforeDst)).toBe(60);
    });
  });

  describe('with mixed types', () => {
    it('compares Instant with ZonedDateTime', () => {
      const instant = Temporal.Instant.from('2025-01-20T15:00:00Z');
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T10:00:00-05:00[America/New_York]'
      );

      // NY 10:00 is 15:00 UTC - same instant
      expect(differenceInMinutes(instant, zoned)).toBe(0);
    });

    it('compares ZonedDateTime with Instant', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T16:00:00-05:00[America/New_York]'
      );
      const instant = Temporal.Instant.from('2025-01-20T15:00:00Z');

      // NY 16:00 is 21:00 UTC
      // Difference is 6 hours = 360 minutes
      expect(differenceInMinutes(zoned, instant)).toBe(360);
    });
  });

  describe('real-world scenarios', () => {
    it('calculates meeting duration', () => {
      const meetingEnd = Temporal.ZonedDateTime.from(
        '2025-01-20T15:30:00-05:00[America/New_York]'
      );
      const meetingStart = Temporal.ZonedDateTime.from(
        '2025-01-20T14:00:00-05:00[America/New_York]'
      );

      expect(differenceInMinutes(meetingEnd, meetingStart)).toBe(90);
    });

    it('calculates time until event', () => {
      const event = Temporal.ZonedDateTime.from(
        '2025-01-20T18:00:00-05:00[America/New_York]'
      );
      const now = Temporal.ZonedDateTime.from(
        '2025-01-20T16:15:00-05:00[America/New_York]'
      );

      expect(differenceInMinutes(event, now)).toBe(105);
    });
  });
});
