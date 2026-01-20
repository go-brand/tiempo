import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { isSameMinute } from './isSameMinute';

describe('isSameMinute', () => {
  describe('with ZonedDateTime', () => {
    it('returns true for same minute, different seconds', () => {
      const start = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:00-05:00[America/New_York]'
      );
      const end = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:59-05:00[America/New_York]'
      );

      expect(isSameMinute(start, end)).toBe(true);
    });

    it('returns true for same minute, different milliseconds', () => {
      const time1 = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:45.123-05:00[America/New_York]'
      );
      const time2 = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:45.999-05:00[America/New_York]'
      );

      expect(isSameMinute(time1, time2)).toBe(true);
    });

    it('returns false for different minutes', () => {
      const min30 = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:00-05:00[America/New_York]'
      );
      const min31 = Temporal.ZonedDateTime.from(
        '2025-01-20T14:31:00-05:00[America/New_York]'
      );

      expect(isSameMinute(min30, min31)).toBe(false);
    });

    it('returns true for exact same instant', () => {
      const date1 = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:45-05:00[America/New_York]'
      );
      const date2 = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:45-05:00[America/New_York]'
      );

      expect(isSameMinute(date1, date2)).toBe(true);
    });

    it('returns true for start and end of same minute', () => {
      const start = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:00Z[UTC]'
      );
      const end = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:59.999999999Z[UTC]'
      );

      expect(isSameMinute(start, end)).toBe(true);
    });

    it('compares minutes in their respective timezones', () => {
      // Same instant, different local minutes
      const ny = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:45-05:00[America/New_York]'
      );
      const tokyo = Temporal.ZonedDateTime.from(
        '2025-01-21T04:30:45+09:00[Asia/Tokyo]'
      );

      // Same instant (both are 19:30:45 UTC)
      // But different local minutes from each person's perspective
      expect(isSameMinute(ny, tokyo)).toBe(false);

      // Convert to UTC to compare in UTC timezone
      expect(isSameMinute(ny.withTimeZone('UTC'), tokyo.withTimeZone('UTC'))).toBe(true);

      // Convert to NY timezone to compare from NY perspective
      expect(isSameMinute(ny, tokyo.withTimeZone('America/New_York'))).toBe(true);
    });

    it('returns true when same minute in same timezone', () => {
      const time1 = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:15+09:00[Asia/Tokyo]'
      );
      const time2 = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:45+09:00[Asia/Tokyo]'
      );

      expect(isSameMinute(time1, time2)).toBe(true);
    });
  });

  describe('with Instant', () => {
    it('returns true for same minute in UTC', () => {
      const instant1 = Temporal.Instant.from('2025-01-20T14:30:10Z');
      const instant2 = Temporal.Instant.from('2025-01-20T14:30:50Z');

      expect(isSameMinute(instant1, instant2)).toBe(true);
    });

    it('returns false for different minutes in UTC', () => {
      const instant1 = Temporal.Instant.from('2025-01-20T14:30:59Z');
      const instant2 = Temporal.Instant.from('2025-01-20T14:31:00Z');

      expect(isSameMinute(instant1, instant2)).toBe(false);
    });

    it('returns true for start and end of same minute', () => {
      const start = Temporal.Instant.from('2025-01-20T14:30:00Z');
      const end = Temporal.Instant.from('2025-01-20T14:30:59.999999999Z');

      expect(isSameMinute(start, end)).toBe(true);
    });
  });

  describe('with mixed types', () => {
    it('compares Instant (UTC) with ZonedDateTime', () => {
      const instant = Temporal.Instant.from('2025-01-20T14:30:15Z');
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:45Z[UTC]'
      );

      // instant: 14:30:15 UTC
      // zoned: 14:30:45 UTC
      // Both are 14:30:xx in UTC
      expect(isSameMinute(instant, zoned)).toBe(true);
    });

    it('compares ZonedDateTime with Instant across minute boundary', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:45-05:00[America/New_York]'
      );
      const instant = Temporal.Instant.from('2025-01-20T19:31:15Z');

      // zoned: 14:30 NY = 19:30 UTC
      // instant: 19:31 UTC
      // Different minutes (19:30:xx vs 19:31:xx in UTC)
      expect(isSameMinute(zoned, instant)).toBe(false);
    });

    it('handles timezone differences correctly', () => {
      const nyTime = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:00-05:00[America/New_York]'
      );
      const utcInstant = Temporal.Instant.from('2025-01-20T14:30:45Z');

      // nyTime: 14:30:00 in NY timezone
      // utcInstant converts to UTC: 14:30:45 in UTC
      // Both are minute 14:30 in their respective timezones
      expect(isSameMinute(nyTime, utcInstant)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('handles midnight minute', () => {
      const midnight = Temporal.ZonedDateTime.from(
        '2025-01-20T00:00:00Z[UTC]'
      );
      const almostNextMin = Temporal.ZonedDateTime.from(
        '2025-01-20T00:00:59Z[UTC]'
      );

      expect(isSameMinute(midnight, almostNextMin)).toBe(true);
    });

    it('handles 23:59 minute', () => {
      const lastMin = Temporal.ZonedDateTime.from(
        '2025-01-20T23:59:00Z[UTC]'
      );
      const almostMidnight = Temporal.ZonedDateTime.from(
        '2025-01-20T23:59:59Z[UTC]'
      );

      expect(isSameMinute(lastMin, almostMidnight)).toBe(true);
    });

    it('returns false across midnight boundary', () => {
      const beforeMidnight = Temporal.ZonedDateTime.from(
        '2025-01-20T23:59:59Z[UTC]'
      );
      const afterMidnight = Temporal.ZonedDateTime.from(
        '2025-01-21T00:00:00Z[UTC]'
      );

      expect(isSameMinute(beforeMidnight, afterMidnight)).toBe(false);
    });

    it('handles minute boundaries', () => {
      const endOfMinute = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:59.999999999Z[UTC]'
      );
      const startOfNextMinute = Temporal.ZonedDateTime.from(
        '2025-01-20T14:31:00Z[UTC]'
      );

      expect(isSameMinute(endOfMinute, startOfNextMinute)).toBe(false);
    });

    it('handles DST spring forward transition', () => {
      // March 9, 2025: DST begins in New York (2 AM -> 3 AM)
      const beforeDst = Temporal.ZonedDateTime.from(
        '2025-03-09T01:30:15-05:00[America/New_York]'
      );
      const afterDst = Temporal.ZonedDateTime.from(
        '2025-03-09T03:30:45-04:00[America/New_York]'
      );

      // Different local minutes (01:30 vs 03:30)
      expect(isSameMinute(beforeDst, afterDst)).toBe(false);
    });

    it('handles DST fall back transition', () => {
      // November 2, 2025: DST ends in New York (2 AM -> 1 AM)
      // 01:30 occurs twice
      const firstOccurrence = Temporal.ZonedDateTime.from(
        '2025-11-02T01:30:15-04:00[America/New_York]'
      );
      const secondOccurrence = Temporal.ZonedDateTime.from(
        '2025-11-02T01:30:45-05:00[America/New_York]'
      );

      // Same local minute (01:30) but different instants
      expect(isSameMinute(firstOccurrence, secondOccurrence)).toBe(true);
    });

    it('handles dates far in the past', () => {
      const past1 = Temporal.ZonedDateTime.from(
        '1970-01-01T10:30:15Z[UTC]'
      );
      const past2 = Temporal.ZonedDateTime.from(
        '1970-01-01T10:30:45Z[UTC]'
      );

      expect(isSameMinute(past1, past2)).toBe(true);
    });

    it('handles dates far in the future', () => {
      const future1 = Temporal.ZonedDateTime.from(
        '2100-12-31T23:59:00Z[UTC]'
      );
      const future2 = Temporal.ZonedDateTime.from(
        '2100-12-31T23:59:59Z[UTC]'
      );

      expect(isSameMinute(future1, future2)).toBe(true);
    });

    it('handles sub-second precision (microseconds)', () => {
      const time1 = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:45.123456Z[UTC]'
      );
      const time2 = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:45.999999Z[UTC]'
      );

      expect(isSameMinute(time1, time2)).toBe(true);
    });

    it('handles sub-second precision (nanoseconds)', () => {
      const time1 = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:45.123456789Z[UTC]'
      );
      const time2 = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:45.987654321Z[UTC]'
      );

      expect(isSameMinute(time1, time2)).toBe(true);
    });
  });

  describe('same timezone, different minutes', () => {
    it('returns false for consecutive minutes', () => {
      const min1 = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:00-05:00[America/New_York]'
      );
      const min2 = Temporal.ZonedDateTime.from(
        '2025-01-20T14:31:00-05:00[America/New_York]'
      );

      expect(isSameMinute(min1, min2)).toBe(false);
    });

    it('returns false for minutes far apart', () => {
      const early = Temporal.ZonedDateTime.from(
        '2025-01-20T14:00:00-05:00[America/New_York]'
      );
      const late = Temporal.ZonedDateTime.from(
        '2025-01-20T14:59:00-05:00[America/New_York]'
      );

      expect(isSameMinute(early, late)).toBe(false);
    });
  });
});
