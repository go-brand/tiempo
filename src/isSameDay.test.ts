import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { isSameDay } from './isSameDay';

describe('isSameDay', () => {
  describe('with ZonedDateTime', () => {
    it('returns true for same UTC day, different times', () => {
      const morning = Temporal.ZonedDateTime.from(
        '2025-01-20T08:00:00-05:00[America/New_York]'
      );
      const afternoon = Temporal.ZonedDateTime.from(
        '2025-01-20T18:00:00-05:00[America/New_York]'
      );

      // Morning: 08:00 NY = 13:00 UTC (Jan 20)
      // Afternoon: 18:00 NY = 23:00 UTC (Jan 20)
      // Both are Jan 20 in UTC
      expect(isSameDay(morning, afternoon)).toBe(true);
    });

    it('returns false for different UTC days', () => {
      const day1 = Temporal.ZonedDateTime.from(
        '2025-01-20T18:00:00-05:00[America/New_York]'
      );
      const day2 = Temporal.ZonedDateTime.from(
        '2025-01-21T18:00:00-05:00[America/New_York]'
      );

      // day1: 18:00 NY = 23:00 UTC Jan 20
      // day2: 18:00 NY = 23:00 UTC Jan 21
      expect(isSameDay(day1, day2)).toBe(false);
    });

    it('returns true for exact same instant', () => {
      const date1 = Temporal.ZonedDateTime.from(
        '2025-01-20T10:00:00-05:00[America/New_York]'
      );
      const date2 = Temporal.ZonedDateTime.from(
        '2025-01-20T10:00:00-05:00[America/New_York]'
      );

      expect(isSameDay(date1, date2)).toBe(true);
    });

    it('returns true for start and end of same UTC day', () => {
      const start = Temporal.ZonedDateTime.from(
        '2025-01-20T00:00:00Z[UTC]'
      );
      const end = Temporal.ZonedDateTime.from(
        '2025-01-20T23:59:59.999999999Z[UTC]'
      );

      expect(isSameDay(start, end)).toBe(true);
    });

    it('compares calendar days in their respective timezones', () => {
      // Same instant, different calendar days in local time
      const ny = Temporal.ZonedDateTime.from(
        '2025-01-20T23:00:00-05:00[America/New_York]'
      );
      const tokyo = Temporal.ZonedDateTime.from(
        '2025-01-21T13:00:00+09:00[Asia/Tokyo]'
      );

      // Same instant (both are 04:00 UTC on Jan 21)
      // But different calendar days from each person's perspective
      expect(isSameDay(ny, tokyo)).toBe(false);

      // Convert to UTC to compare in UTC timezone
      expect(isSameDay(ny.withTimeZone('UTC'), tokyo.withTimeZone('UTC'))).toBe(true);

      // Convert to NY timezone to compare from NY perspective
      expect(isSameDay(ny, tokyo.withTimeZone('America/New_York'))).toBe(true);
    });

    it('returns true when same calendar day in same timezone', () => {
      const morning = Temporal.ZonedDateTime.from(
        '2025-01-20T09:00:00+09:00[Asia/Tokyo]'
      );
      const evening = Temporal.ZonedDateTime.from(
        '2025-01-20T21:00:00+09:00[Asia/Tokyo]'
      );

      // Same calendar day (Jan 20) in Tokyo timezone
      expect(isSameDay(morning, evening)).toBe(true);
    });
  });

  describe('with Instant', () => {
    it('returns true for same day in UTC', () => {
      const instant1 = Temporal.Instant.from('2025-01-20T10:00:00Z');
      const instant2 = Temporal.Instant.from('2025-01-20T23:00:00Z');

      expect(isSameDay(instant1, instant2)).toBe(true);
    });

    it('returns false for different days in UTC', () => {
      const instant1 = Temporal.Instant.from('2025-01-20T23:59:59Z');
      const instant2 = Temporal.Instant.from('2025-01-21T00:00:00Z');

      expect(isSameDay(instant1, instant2)).toBe(false);
    });

    it('returns true for start and end of same UTC day', () => {
      const start = Temporal.Instant.from('2025-01-20T00:00:00Z');
      const end = Temporal.Instant.from('2025-01-20T23:59:59.999999999Z');

      expect(isSameDay(start, end)).toBe(true);
    });
  });

  describe('with mixed types', () => {
    it('compares Instant (UTC) with ZonedDateTime', () => {
      // Instant in UTC, ZonedDateTime in UTC
      const instant = Temporal.Instant.from('2025-01-20T15:00:00Z');
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T10:00:00-05:00[America/New_York]'
      );

      // Both normalize to UTC for comparison
      // instant: Jan 20 in UTC
      // zoned: Jan 20 15:00 UTC
      expect(isSameDay(instant, zoned)).toBe(true);
    });

    it('compares ZonedDateTime with Instant across day boundary', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T20:00:00-05:00[America/New_York]'
      );
      const instant = Temporal.Instant.from('2025-01-21T02:00:00Z');

      // zoned: Jan 20 20:00 NY = Jan 21 01:00 UTC
      // instant: Jan 21 02:00 UTC
      // Different calendar days (Jan 20 in NY vs Jan 21 in UTC)
      expect(isSameDay(zoned, instant)).toBe(false);

      // Convert zoned to UTC to compare in UTC
      expect(isSameDay(zoned.withTimeZone('UTC'), instant)).toBe(true);
    });

    it('handles timezone differences correctly', () => {
      // NY midnight Jan 20 = Jan 20 05:00 UTC
      const nyMidnight = Temporal.ZonedDateTime.from(
        '2025-01-20T00:00:00-05:00[America/New_York]'
      );
      // UTC Jan 20 00:00
      const utcInstant = Temporal.Instant.from('2025-01-20T00:00:00Z');

      // Both normalize to UTC
      // nyMidnight becomes Jan 20 05:00 UTC -> Jan 20
      // utcInstant is Jan 20 00:00 UTC -> Jan 20
      expect(isSameDay(nyMidnight, utcInstant)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('handles leap year February 29', () => {
      const morning = Temporal.ZonedDateTime.from(
        '2024-02-29T08:00:00Z[UTC]'
      );
      const evening = Temporal.ZonedDateTime.from(
        '2024-02-29T20:00:00Z[UTC]'
      );

      expect(isSameDay(morning, evening)).toBe(true);
    });

    it('returns false for Feb 28 vs Feb 29 in leap year', () => {
      const feb28 = Temporal.ZonedDateTime.from(
        '2024-02-28T23:59:59Z[UTC]'
      );
      const feb29 = Temporal.ZonedDateTime.from(
        '2024-02-29T00:00:00Z[UTC]'
      );

      expect(isSameDay(feb28, feb29)).toBe(false);
    });

    it('handles month boundaries', () => {
      const endOfMonth = Temporal.ZonedDateTime.from(
        '2025-01-31T23:59:59Z[UTC]'
      );
      const startOfNextMonth = Temporal.ZonedDateTime.from(
        '2025-02-01T00:00:00Z[UTC]'
      );

      expect(isSameDay(endOfMonth, startOfNextMonth)).toBe(false);
    });

    it('handles year boundaries', () => {
      const endOfYear = Temporal.ZonedDateTime.from(
        '2024-12-31T23:59:59Z[UTC]'
      );
      const startOfNextYear = Temporal.ZonedDateTime.from(
        '2025-01-01T00:00:00Z[UTC]'
      );

      expect(isSameDay(endOfYear, startOfNextYear)).toBe(false);
    });

    it('handles DST spring forward transition', () => {
      // March 9, 2025: DST begins in New York (2 AM -> 3 AM)
      const beforeDst = Temporal.ZonedDateTime.from(
        '2025-03-09T01:30:00-05:00[America/New_York]'
      );
      const afterDst = Temporal.ZonedDateTime.from(
        '2025-03-09T03:30:00-04:00[America/New_York]'
      );

      // Both are March 9 in NY time
      expect(isSameDay(beforeDst, afterDst)).toBe(true);
    });

    it('handles DST fall back transition', () => {
      // November 2, 2025: DST ends in New York (2 AM -> 1 AM)
      const firstOccurrence = Temporal.ZonedDateTime.from(
        '2025-11-02T01:30:00-04:00[America/New_York]'
      );
      const secondOccurrence = Temporal.ZonedDateTime.from(
        '2025-11-02T01:30:00-05:00[America/New_York]'
      );

      // Both are November 2 in NY time
      expect(isSameDay(firstOccurrence, secondOccurrence)).toBe(true);
    });

    it('handles dates far in the past', () => {
      const past1 = Temporal.ZonedDateTime.from(
        '1970-01-01T10:00:00Z[UTC]'
      );
      const past2 = Temporal.ZonedDateTime.from(
        '1970-01-01T20:00:00Z[UTC]'
      );

      expect(isSameDay(past1, past2)).toBe(true);
    });

    it('handles dates far in the future', () => {
      const future1 = Temporal.ZonedDateTime.from(
        '2100-12-31T10:00:00Z[UTC]'
      );
      const future2 = Temporal.ZonedDateTime.from(
        '2100-12-31T20:00:00Z[UTC]'
      );

      expect(isSameDay(future1, future2)).toBe(true);
    });
  });

  describe('same timezone, different days', () => {
    it('returns false for consecutive days', () => {
      const day1 = Temporal.ZonedDateTime.from(
        '2025-01-20T12:00:00-05:00[America/New_York]'
      );
      const day2 = Temporal.ZonedDateTime.from(
        '2025-01-21T12:00:00-05:00[America/New_York]'
      );

      expect(isSameDay(day1, day2)).toBe(false);
    });

    it('returns false for days one week apart', () => {
      const week1 = Temporal.ZonedDateTime.from(
        '2025-01-20T12:00:00-05:00[America/New_York]'
      );
      const week2 = Temporal.ZonedDateTime.from(
        '2025-01-27T12:00:00-05:00[America/New_York]'
      );

      expect(isSameDay(week1, week2)).toBe(false);
    });
  });
});
