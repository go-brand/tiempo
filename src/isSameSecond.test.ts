import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { isSameSecond } from './isSameSecond';

describe('isSameSecond', () => {
  describe('with ZonedDateTime', () => {
    it('returns true for same second, different milliseconds', () => {
      const time1 = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:45.000-05:00[America/New_York]'
      );
      const time2 = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:45.999-05:00[America/New_York]'
      );

      expect(isSameSecond(time1, time2)).toBe(true);
    });

    it('returns true for same second, different microseconds', () => {
      const time1 = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:45.123456-05:00[America/New_York]'
      );
      const time2 = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:45.999999-05:00[America/New_York]'
      );

      expect(isSameSecond(time1, time2)).toBe(true);
    });

    it('returns true for same second, different nanoseconds', () => {
      const time1 = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:45.123456789-05:00[America/New_York]'
      );
      const time2 = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:45.987654321-05:00[America/New_York]'
      );

      expect(isSameSecond(time1, time2)).toBe(true);
    });

    it('returns false for different seconds', () => {
      const sec45 = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:45-05:00[America/New_York]'
      );
      const sec46 = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:46-05:00[America/New_York]'
      );

      expect(isSameSecond(sec45, sec46)).toBe(false);
    });

    it('returns true for exact same instant', () => {
      const date1 = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:45.123-05:00[America/New_York]'
      );
      const date2 = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:45.123-05:00[America/New_York]'
      );

      expect(isSameSecond(date1, date2)).toBe(true);
    });

    it('returns true for start and end of same second', () => {
      const start = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:45.000Z[UTC]'
      );
      const end = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:45.999999999Z[UTC]'
      );

      expect(isSameSecond(start, end)).toBe(true);
    });

    it('compares seconds in their respective timezones', () => {
      // Same instant, different local seconds
      const ny = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:45.123-05:00[America/New_York]'
      );
      const tokyo = Temporal.ZonedDateTime.from(
        '2025-01-21T04:30:45.987+09:00[Asia/Tokyo]'
      );

      // Same instant (both are 19:30:45 UTC)
      // But different local seconds from each person's perspective
      expect(isSameSecond(ny, tokyo)).toBe(false);

      // Convert to UTC to compare in UTC timezone
      expect(isSameSecond(ny.withTimeZone('UTC'), tokyo.withTimeZone('UTC'))).toBe(true);

      // Convert to NY timezone to compare from NY perspective
      expect(isSameSecond(ny, tokyo.withTimeZone('America/New_York'))).toBe(true);
    });

    it('returns true when same second in same timezone', () => {
      const time1 = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:45.100+09:00[Asia/Tokyo]'
      );
      const time2 = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:45.900+09:00[Asia/Tokyo]'
      );

      expect(isSameSecond(time1, time2)).toBe(true);
    });
  });

  describe('with Instant', () => {
    it('returns true for same second in UTC', () => {
      const instant1 = Temporal.Instant.from('2025-01-20T14:30:45.100Z');
      const instant2 = Temporal.Instant.from('2025-01-20T14:30:45.900Z');

      expect(isSameSecond(instant1, instant2)).toBe(true);
    });

    it('returns false for different seconds in UTC', () => {
      const instant1 = Temporal.Instant.from('2025-01-20T14:30:45.999Z');
      const instant2 = Temporal.Instant.from('2025-01-20T14:30:46.000Z');

      expect(isSameSecond(instant1, instant2)).toBe(false);
    });

    it('returns true for start and end of same second', () => {
      const start = Temporal.Instant.from('2025-01-20T14:30:45.000000000Z');
      const end = Temporal.Instant.from('2025-01-20T14:30:45.999999999Z');

      expect(isSameSecond(start, end)).toBe(true);
    });

    it('handles nanosecond precision', () => {
      const nano1 = Temporal.Instant.from('2025-01-20T14:30:45.000000001Z');
      const nano2 = Temporal.Instant.from('2025-01-20T14:30:45.999999999Z');

      expect(isSameSecond(nano1, nano2)).toBe(true);
    });
  });

  describe('with mixed types', () => {
    it('compares Instant (UTC) with ZonedDateTime', () => {
      const instant = Temporal.Instant.from('2025-01-20T14:30:45.123Z');
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:45.999Z[UTC]'
      );

      // instant: 14:30:45.123 UTC
      // zoned: 14:30:45.999 UTC
      // Both are 14:30:45 in UTC
      expect(isSameSecond(instant, zoned)).toBe(true);
    });

    it('compares ZonedDateTime with Instant across second boundary', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:45.999-05:00[America/New_York]'
      );
      const instant = Temporal.Instant.from('2025-01-20T19:30:46.001Z');

      // zoned: 14:30:45 NY = 19:30:45 UTC
      // instant: 19:30:46 UTC
      // Different seconds (19:30:45 vs 19:30:46 in UTC)
      expect(isSameSecond(zoned, instant)).toBe(false);
    });

    it('handles timezone differences correctly', () => {
      const nyTime = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:45.000-05:00[America/New_York]'
      );
      const utcInstant = Temporal.Instant.from('2025-01-20T14:30:45.999Z');

      // nyTime: 14:30:45 in NY timezone
      // utcInstant converts to UTC: 14:30:45 in UTC
      // Both are second 14:30:45 in their respective timezones
      expect(isSameSecond(nyTime, utcInstant)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('handles midnight second', () => {
      const midnight = Temporal.ZonedDateTime.from(
        '2025-01-20T00:00:00.000Z[UTC]'
      );
      const almostNextSec = Temporal.ZonedDateTime.from(
        '2025-01-20T00:00:00.999Z[UTC]'
      );

      expect(isSameSecond(midnight, almostNextSec)).toBe(true);
    });

    it('handles 23:59:59 second', () => {
      const lastSec = Temporal.ZonedDateTime.from(
        '2025-01-20T23:59:59.000Z[UTC]'
      );
      const almostMidnight = Temporal.ZonedDateTime.from(
        '2025-01-20T23:59:59.999Z[UTC]'
      );

      expect(isSameSecond(lastSec, almostMidnight)).toBe(true);
    });

    it('returns false across midnight boundary', () => {
      const beforeMidnight = Temporal.ZonedDateTime.from(
        '2025-01-20T23:59:59.999Z[UTC]'
      );
      const afterMidnight = Temporal.ZonedDateTime.from(
        '2025-01-21T00:00:00.000Z[UTC]'
      );

      expect(isSameSecond(beforeMidnight, afterMidnight)).toBe(false);
    });

    it('handles second boundaries', () => {
      const endOfSecond = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:45.999999999Z[UTC]'
      );
      const startOfNextSecond = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:46.000000000Z[UTC]'
      );

      expect(isSameSecond(endOfSecond, startOfNextSecond)).toBe(false);
    });

    it('handles DST spring forward transition', () => {
      // March 9, 2025: DST begins in New York (2 AM -> 3 AM)
      const beforeDst = Temporal.ZonedDateTime.from(
        '2025-03-09T01:30:45.123-05:00[America/New_York]'
      );
      const afterDst = Temporal.ZonedDateTime.from(
        '2025-03-09T03:30:45.987-04:00[America/New_York]'
      );

      // Different local seconds (01:30:45 vs 03:30:45)
      expect(isSameSecond(beforeDst, afterDst)).toBe(false);
    });

    it('handles DST fall back transition', () => {
      // November 2, 2025: DST ends in New York (2 AM -> 1 AM)
      // 01:30:45 occurs twice
      const firstOccurrence = Temporal.ZonedDateTime.from(
        '2025-11-02T01:30:45.123-04:00[America/New_York]'
      );
      const secondOccurrence = Temporal.ZonedDateTime.from(
        '2025-11-02T01:30:45.987-05:00[America/New_York]'
      );

      // Same local second (01:30:45) but different instants
      expect(isSameSecond(firstOccurrence, secondOccurrence)).toBe(true);
    });

    it('handles dates far in the past', () => {
      const past1 = Temporal.ZonedDateTime.from(
        '1970-01-01T10:30:45.100Z[UTC]'
      );
      const past2 = Temporal.ZonedDateTime.from(
        '1970-01-01T10:30:45.900Z[UTC]'
      );

      expect(isSameSecond(past1, past2)).toBe(true);
    });

    it('handles dates far in the future', () => {
      const future1 = Temporal.ZonedDateTime.from(
        '2100-12-31T23:59:59.000Z[UTC]'
      );
      const future2 = Temporal.ZonedDateTime.from(
        '2100-12-31T23:59:59.999Z[UTC]'
      );

      expect(isSameSecond(future1, future2)).toBe(true);
    });

    it('handles leap second boundaries (theoretical)', () => {
      // While leap seconds are handled differently in different systems,
      // we test that sub-second precision is properly ignored
      const time1 = Temporal.ZonedDateTime.from(
        '2025-06-30T23:59:59.000Z[UTC]'
      );
      const time2 = Temporal.ZonedDateTime.from(
        '2025-06-30T23:59:59.999Z[UTC]'
      );

      expect(isSameSecond(time1, time2)).toBe(true);
    });

    it('handles zero milliseconds explicitly', () => {
      const time1 = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:45.000Z[UTC]'
      );
      const time2 = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:45.001Z[UTC]'
      );

      expect(isSameSecond(time1, time2)).toBe(true);
    });

    it('handles maximum sub-second precision', () => {
      const time1 = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:45.000000000Z[UTC]'
      );
      const time2 = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:45.999999999Z[UTC]'
      );

      expect(isSameSecond(time1, time2)).toBe(true);
    });
  });

  describe('same timezone, different seconds', () => {
    it('returns false for consecutive seconds', () => {
      const sec1 = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:45-05:00[America/New_York]'
      );
      const sec2 = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:46-05:00[America/New_York]'
      );

      expect(isSameSecond(sec1, sec2)).toBe(false);
    });

    it('returns false for seconds far apart', () => {
      const early = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:00-05:00[America/New_York]'
      );
      const late = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:59-05:00[America/New_York]'
      );

      expect(isSameSecond(early, late)).toBe(false);
    });
  });
});
