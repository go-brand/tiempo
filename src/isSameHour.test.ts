import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { isSameHour } from './isSameHour';

describe('isSameHour', () => {
  describe('with ZonedDateTime', () => {
    it('returns true for same hour, different minutes', () => {
      const start = Temporal.ZonedDateTime.from(
        '2025-01-20T14:00:00-05:00[America/New_York]'
      );
      const end = Temporal.ZonedDateTime.from(
        '2025-01-20T14:59:00-05:00[America/New_York]'
      );

      expect(isSameHour(start, end)).toBe(true);
    });

    it('returns true for same hour, different seconds', () => {
      const time1 = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:00-05:00[America/New_York]'
      );
      const time2 = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:59-05:00[America/New_York]'
      );

      expect(isSameHour(time1, time2)).toBe(true);
    });

    it('returns true for same hour, different milliseconds', () => {
      const time1 = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:45.123-05:00[America/New_York]'
      );
      const time2 = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:45.999-05:00[America/New_York]'
      );

      expect(isSameHour(time1, time2)).toBe(true);
    });

    it('returns false for different hours', () => {
      const hour14 = Temporal.ZonedDateTime.from(
        '2025-01-20T14:00:00-05:00[America/New_York]'
      );
      const hour15 = Temporal.ZonedDateTime.from(
        '2025-01-20T15:00:00-05:00[America/New_York]'
      );

      expect(isSameHour(hour14, hour15)).toBe(false);
    });

    it('returns true for exact same instant', () => {
      const date1 = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:45-05:00[America/New_York]'
      );
      const date2 = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:45-05:00[America/New_York]'
      );

      expect(isSameHour(date1, date2)).toBe(true);
    });

    it('returns true for start and end of same hour', () => {
      const start = Temporal.ZonedDateTime.from(
        '2025-01-20T14:00:00Z[UTC]'
      );
      const end = Temporal.ZonedDateTime.from(
        '2025-01-20T14:59:59.999999999Z[UTC]'
      );

      expect(isSameHour(start, end)).toBe(true);
    });

    it('compares hours in their respective timezones', () => {
      // Same instant, different local hours
      const ny = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:00-05:00[America/New_York]'
      );
      const tokyo = Temporal.ZonedDateTime.from(
        '2025-01-21T04:30:00+09:00[Asia/Tokyo]'
      );

      // Same instant (both are 19:30 UTC)
      // But different local hours from each person's perspective
      expect(isSameHour(ny, tokyo)).toBe(false);

      // Convert to UTC to compare in UTC timezone
      expect(isSameHour(ny.withTimeZone('UTC'), tokyo.withTimeZone('UTC'))).toBe(true);

      // Convert to NY timezone to compare from NY perspective
      expect(isSameHour(ny, tokyo.withTimeZone('America/New_York'))).toBe(true);
    });

    it('returns true when same hour in same timezone', () => {
      const time1 = Temporal.ZonedDateTime.from(
        '2025-01-20T14:15:00+09:00[Asia/Tokyo]'
      );
      const time2 = Temporal.ZonedDateTime.from(
        '2025-01-20T14:45:00+09:00[Asia/Tokyo]'
      );

      expect(isSameHour(time1, time2)).toBe(true);
    });
  });

  describe('with Instant', () => {
    it('returns true for same hour in UTC', () => {
      const instant1 = Temporal.Instant.from('2025-01-20T14:10:00Z');
      const instant2 = Temporal.Instant.from('2025-01-20T14:50:00Z');

      expect(isSameHour(instant1, instant2)).toBe(true);
    });

    it('returns false for different hours in UTC', () => {
      const instant1 = Temporal.Instant.from('2025-01-20T14:59:59Z');
      const instant2 = Temporal.Instant.from('2025-01-20T15:00:00Z');

      expect(isSameHour(instant1, instant2)).toBe(false);
    });

    it('returns true for start and end of same hour', () => {
      const start = Temporal.Instant.from('2025-01-20T14:00:00Z');
      const end = Temporal.Instant.from('2025-01-20T14:59:59.999999999Z');

      expect(isSameHour(start, end)).toBe(true);
    });
  });

  describe('with mixed types', () => {
    it('compares Instant (UTC) with ZonedDateTime', () => {
      const instant = Temporal.Instant.from('2025-01-20T14:30:00Z');
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T14:45:00Z[UTC]'
      );

      // instant: 14:30 UTC
      // zoned: 14:45 UTC
      // Both are 14:xx in UTC
      expect(isSameHour(instant, zoned)).toBe(true);
    });

    it('compares ZonedDateTime with Instant across hour boundary', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:00-05:00[America/New_York]'
      );
      const instant = Temporal.Instant.from('2025-01-20T20:15:00Z');

      // zoned: 14:30 NY = 19:30 UTC
      // instant: 20:15 UTC
      // Different hours (19:xx vs 20:xx in UTC)
      expect(isSameHour(zoned, instant)).toBe(false);
    });

    it('handles timezone differences correctly', () => {
      const nyTime = Temporal.ZonedDateTime.from(
        '2025-01-20T14:00:00-05:00[America/New_York]'
      );
      const utcInstant = Temporal.Instant.from('2025-01-20T14:30:00Z');

      // nyTime: 14:00 in NY timezone
      // utcInstant converts to UTC: 14:30 in UTC
      // Both are hour 14 in their respective timezones
      expect(isSameHour(nyTime, utcInstant)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('handles midnight hour', () => {
      const midnight = Temporal.ZonedDateTime.from(
        '2025-01-20T00:00:00Z[UTC]'
      );
      const almostOne = Temporal.ZonedDateTime.from(
        '2025-01-20T00:59:59Z[UTC]'
      );

      expect(isSameHour(midnight, almostOne)).toBe(true);
    });

    it('handles 23:00 hour', () => {
      const hour23 = Temporal.ZonedDateTime.from(
        '2025-01-20T23:00:00Z[UTC]'
      );
      const almostMidnight = Temporal.ZonedDateTime.from(
        '2025-01-20T23:59:59Z[UTC]'
      );

      expect(isSameHour(hour23, almostMidnight)).toBe(true);
    });

    it('returns false across midnight boundary', () => {
      const beforeMidnight = Temporal.ZonedDateTime.from(
        '2025-01-20T23:59:59Z[UTC]'
      );
      const afterMidnight = Temporal.ZonedDateTime.from(
        '2025-01-21T00:00:00Z[UTC]'
      );

      expect(isSameHour(beforeMidnight, afterMidnight)).toBe(false);
    });

    it('handles hour boundaries', () => {
      const endOfHour = Temporal.ZonedDateTime.from(
        '2025-01-20T14:59:59.999999999Z[UTC]'
      );
      const startOfNextHour = Temporal.ZonedDateTime.from(
        '2025-01-20T15:00:00Z[UTC]'
      );

      expect(isSameHour(endOfHour, startOfNextHour)).toBe(false);
    });

    it('handles DST spring forward transition', () => {
      // March 9, 2025: DST begins in New York (2 AM -> 3 AM)
      // 01:30 EST becomes 03:30 EDT (hour 02:00-02:59 doesn't exist)
      const beforeDst = Temporal.ZonedDateTime.from(
        '2025-03-09T01:30:00-05:00[America/New_York]'
      );
      const afterDst = Temporal.ZonedDateTime.from(
        '2025-03-09T03:30:00-04:00[America/New_York]'
      );

      // Different local hours (01:xx vs 03:xx)
      expect(isSameHour(beforeDst, afterDst)).toBe(false);
    });

    it('handles DST fall back transition', () => {
      // November 2, 2025: DST ends in New York (2 AM -> 1 AM)
      // 01:30 occurs twice
      const firstOccurrence = Temporal.ZonedDateTime.from(
        '2025-11-02T01:30:00-04:00[America/New_York]'
      );
      const secondOccurrence = Temporal.ZonedDateTime.from(
        '2025-11-02T01:30:00-05:00[America/New_York]'
      );

      // Same local hour (01:xx) but different instants
      expect(isSameHour(firstOccurrence, secondOccurrence)).toBe(true);
    });

    it('handles dates far in the past', () => {
      const past1 = Temporal.ZonedDateTime.from(
        '1970-01-01T10:15:00Z[UTC]'
      );
      const past2 = Temporal.ZonedDateTime.from(
        '1970-01-01T10:45:00Z[UTC]'
      );

      expect(isSameHour(past1, past2)).toBe(true);
    });

    it('handles dates far in the future', () => {
      const future1 = Temporal.ZonedDateTime.from(
        '2100-12-31T23:00:00Z[UTC]'
      );
      const future2 = Temporal.ZonedDateTime.from(
        '2100-12-31T23:59:59Z[UTC]'
      );

      expect(isSameHour(future1, future2)).toBe(true);
    });

    it('handles sub-second precision (microseconds)', () => {
      const time1 = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:45.123456Z[UTC]'
      );
      const time2 = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:45.999999Z[UTC]'
      );

      expect(isSameHour(time1, time2)).toBe(true);
    });

    it('handles sub-second precision (nanoseconds)', () => {
      const time1 = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:45.123456789Z[UTC]'
      );
      const time2 = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:45.987654321Z[UTC]'
      );

      expect(isSameHour(time1, time2)).toBe(true);
    });
  });

  describe('same timezone, different hours', () => {
    it('returns false for consecutive hours', () => {
      const hour1 = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:00-05:00[America/New_York]'
      );
      const hour2 = Temporal.ZonedDateTime.from(
        '2025-01-20T15:30:00-05:00[America/New_York]'
      );

      expect(isSameHour(hour1, hour2)).toBe(false);
    });

    it('returns false for hours far apart', () => {
      const morning = Temporal.ZonedDateTime.from(
        '2025-01-20T08:30:00-05:00[America/New_York]'
      );
      const evening = Temporal.ZonedDateTime.from(
        '2025-01-20T20:30:00-05:00[America/New_York]'
      );

      expect(isSameHour(morning, evening)).toBe(false);
    });
  });
});
