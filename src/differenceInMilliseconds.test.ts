import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { differenceInMilliseconds } from './differenceInMilliseconds';

describe('differenceInMilliseconds', () => {
  describe('with Instant', () => {
    it('returns the number of milliseconds between two instants', () => {
      const later = Temporal.Instant.from('2014-07-02T12:30:21.700Z');
      const earlier = Temporal.Instant.from('2014-07-02T12:30:20.600Z');

      expect(differenceInMilliseconds(later, earlier)).toBe(1100);
    });

    it('returns negative value when laterDate is before earlierDate', () => {
      const later = Temporal.Instant.from('2014-07-02T12:30:20.600Z');
      const earlier = Temporal.Instant.from('2014-07-02T12:30:21.700Z');

      expect(differenceInMilliseconds(later, earlier)).toBe(-1100);
    });

    it('returns 0 when both instants are equal', () => {
      const instant = Temporal.Instant.from('2025-01-20T15:00:00Z');

      expect(differenceInMilliseconds(instant, instant)).toBe(0);
    });

    it('handles large time differences', () => {
      const later = Temporal.Instant.from('2025-01-20T15:00:00Z');
      const earlier = Temporal.Instant.from('2025-01-20T14:00:00Z');

      // 1 hour = 3600000 milliseconds
      expect(differenceInMilliseconds(later, earlier)).toBe(3600000);
    });

    it('handles millisecond precision', () => {
      const later = Temporal.Instant.from('2025-01-20T15:00:00.500Z');
      const earlier = Temporal.Instant.from('2025-01-20T15:00:00.000Z');

      expect(differenceInMilliseconds(later, earlier)).toBe(500);
    });

    it('truncates sub-millisecond precision', () => {
      const later = Temporal.Instant.from('2025-01-20T15:00:00.001999999Z');
      const earlier = Temporal.Instant.from('2025-01-20T15:00:00.000000001Z');

      // Only millisecond precision is returned
      expect(differenceInMilliseconds(later, earlier)).toBe(1);
    });
  });

  describe('with ZonedDateTime', () => {
    it('returns the number of milliseconds between two zoned datetimes', () => {
      const later = Temporal.ZonedDateTime.from(
        '2025-01-20T16:00:00-05:00[America/New_York]'
      );
      const earlier = Temporal.ZonedDateTime.from(
        '2025-01-20T15:00:00-05:00[America/New_York]'
      );

      // 1 hour = 3600000 milliseconds
      expect(differenceInMilliseconds(later, earlier)).toBe(3600000);
    });

    it('returns negative value when laterDate is before earlierDate', () => {
      const later = Temporal.ZonedDateTime.from(
        '2025-01-20T15:00:00-05:00[America/New_York]'
      );
      const earlier = Temporal.ZonedDateTime.from(
        '2025-01-20T16:00:00-05:00[America/New_York]'
      );

      expect(differenceInMilliseconds(later, earlier)).toBe(-3600000);
    });

    it('returns 0 when both zoned datetimes are equal', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T15:00:00-05:00[America/New_York]'
      );

      expect(differenceInMilliseconds(zoned, zoned)).toBe(0);
    });

    it('compares by instant, not calendar datetime', () => {
      // Same calendar time, different timezones
      const tokyo = Temporal.ZonedDateTime.from(
        '2025-01-20T10:00:00+09:00[Asia/Tokyo]'
      );
      const ny = Temporal.ZonedDateTime.from(
        '2025-01-20T10:00:00-05:00[America/New_York]'
      );

      // NY 10:00 is 15:00 UTC
      // Tokyo 10:00 is 01:00 UTC
      // Difference is 14 hours = 50400000 milliseconds
      expect(differenceInMilliseconds(ny, tokyo)).toBe(50400000);
    });

    it('handles dates in different timezones representing same instant', () => {
      const tokyo = Temporal.ZonedDateTime.from(
        '2025-01-21T00:00:00+09:00[Asia/Tokyo]'
      );
      const ny = Temporal.ZonedDateTime.from(
        '2025-01-20T10:00:00-05:00[America/New_York]'
      );

      // Both represent the same instant (15:00 UTC)
      expect(differenceInMilliseconds(tokyo, ny)).toBe(0);
    });

    it('handles millisecond precision with timezones', () => {
      const later = Temporal.ZonedDateTime.from(
        '2025-01-20T10:00:00.500-05:00[America/New_York]'
      );
      const earlier = Temporal.ZonedDateTime.from(
        '2025-01-20T10:00:00.000-05:00[America/New_York]'
      );

      expect(differenceInMilliseconds(later, earlier)).toBe(500);
    });
  });

  describe('with mixed types', () => {
    it('compares Instant with ZonedDateTime', () => {
      const instant = Temporal.Instant.from('2025-01-20T15:00:00Z');
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T10:00:00-05:00[America/New_York]'
      );

      // NY 10:00 is 15:00 UTC - same instant
      expect(differenceInMilliseconds(instant, zoned)).toBe(0);
    });

    it('compares ZonedDateTime with Instant', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T16:00:00-05:00[America/New_York]'
      );
      const instant = Temporal.Instant.from('2025-01-20T15:00:00Z');

      // NY 16:00 is 21:00 UTC
      // Difference is 6 hours = 21600000 milliseconds
      expect(differenceInMilliseconds(zoned, instant)).toBe(21600000);
    });
  });

  describe('edge cases', () => {
    it('handles dates far apart', () => {
      const later = Temporal.Instant.from('2025-01-20T00:00:00Z');
      const earlier = Temporal.Instant.from('1970-01-01T00:00:00Z');

      // Should handle large differences
      expect(differenceInMilliseconds(later, earlier)).toBeGreaterThan(0);
    });

    it('handles DST transitions', () => {
      // March 9, 2025: DST begins in New York (2 AM -> 3 AM)
      const beforeDst = Temporal.ZonedDateTime.from(
        '2025-03-09T01:30:00-05:00[America/New_York]'
      );
      const afterDst = Temporal.ZonedDateTime.from(
        '2025-03-09T03:30:00-04:00[America/New_York]'
      );

      // 1 hour of wall-clock time, 1 hour of actual time
      // = 3600000 milliseconds
      expect(differenceInMilliseconds(afterDst, beforeDst)).toBe(3600000);
    });

    it('handles DST fall back', () => {
      // November 2, 2025: DST ends in New York (2 AM -> 1 AM)
      const firstOccurrence = Temporal.ZonedDateTime.from(
        '2025-11-02T01:30:00-04:00[America/New_York]'
      );
      const secondOccurrence = Temporal.ZonedDateTime.from(
        '2025-11-02T01:30:00-05:00[America/New_York]'
      );

      // Same wall-clock time, but 1 hour apart in actual time
      // = 3600000 milliseconds
      expect(differenceInMilliseconds(secondOccurrence, firstOccurrence)).toBe(
        3600000
      );
    });

    it('handles very small differences', () => {
      const later = Temporal.Instant.from('2025-01-20T15:00:00.001Z');
      const earlier = Temporal.Instant.from('2025-01-20T15:00:00.000Z');

      expect(differenceInMilliseconds(later, earlier)).toBe(1);
    });

    it('handles dates across year boundaries', () => {
      const later = Temporal.Instant.from('2025-01-01T00:00:00Z');
      const earlier = Temporal.Instant.from('2024-12-31T23:59:59.000Z');

      // 1 second = 1000 milliseconds
      expect(differenceInMilliseconds(later, earlier)).toBe(1000);
    });
  });

  describe('real-world scenarios', () => {
    it('calculates duration of an API request', () => {
      const start = Temporal.Instant.from('2025-01-20T15:00:00.123Z');
      const end = Temporal.Instant.from('2025-01-20T15:00:00.456Z');

      expect(differenceInMilliseconds(end, start)).toBe(333);
    });

    it('calculates time until event', () => {
      const now = Temporal.ZonedDateTime.from(
        '2025-01-20T14:00:00-05:00[America/New_York]'
      );
      const event = Temporal.ZonedDateTime.from(
        '2025-01-20T15:30:00-05:00[America/New_York]'
      );

      // 1.5 hours = 5400000 milliseconds
      expect(differenceInMilliseconds(event, now)).toBe(5400000);
    });

    it('calculates time elapsed since past event', () => {
      const event = Temporal.ZonedDateTime.from(
        '2025-01-20T10:00:00-05:00[America/New_York]'
      );
      const now = Temporal.ZonedDateTime.from(
        '2025-01-20T12:30:00-05:00[America/New_York]'
      );

      // 2.5 hours = 9000000 milliseconds
      expect(differenceInMilliseconds(now, event)).toBe(9000000);
    });
  });
});
