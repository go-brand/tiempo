import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { isSameWeek } from './isSameWeek';

describe('isSameWeek', () => {
  describe('with ZonedDateTime', () => {
    it('returns true for same week, different days (Monday to Sunday)', () => {
      // Week 4 of 2025: Jan 20 (Mon) to Jan 26 (Sun)
      const monday = Temporal.ZonedDateTime.from(
        '2025-01-20T08:00:00-05:00[America/New_York]'
      );
      const sunday = Temporal.ZonedDateTime.from(
        '2025-01-26T18:00:00-05:00[America/New_York]'
      );

      expect(isSameWeek(monday, sunday)).toBe(true);
    });

    it('returns true for same week, different times', () => {
      const morning = Temporal.ZonedDateTime.from(
        '2025-01-22T08:00:00-05:00[America/New_York]'
      );
      const evening = Temporal.ZonedDateTime.from(
        '2025-01-22T23:59:59-05:00[America/New_York]'
      );

      expect(isSameWeek(morning, evening)).toBe(true);
    });

    it('returns false for different weeks', () => {
      // Sunday of Week 3 vs Monday of Week 4
      const week3 = Temporal.ZonedDateTime.from(
        '2025-01-19T18:00:00-05:00[America/New_York]'
      );
      const week4 = Temporal.ZonedDateTime.from(
        '2025-01-20T18:00:00-05:00[America/New_York]'
      );

      expect(isSameWeek(week3, week4)).toBe(false);
    });

    it('returns true for exact same instant', () => {
      const date1 = Temporal.ZonedDateTime.from(
        '2025-01-20T10:00:00-05:00[America/New_York]'
      );
      const date2 = Temporal.ZonedDateTime.from(
        '2025-01-20T10:00:00-05:00[America/New_York]'
      );

      expect(isSameWeek(date1, date2)).toBe(true);
    });

    it('returns true for start and end of same week', () => {
      // Monday 00:00 to Sunday 23:59:59 of Week 4
      const start = Temporal.ZonedDateTime.from(
        '2025-01-20T00:00:00Z[UTC]'
      );
      const end = Temporal.ZonedDateTime.from(
        '2025-01-26T23:59:59.999999999Z[UTC]'
      );

      expect(isSameWeek(start, end)).toBe(true);
    });

    it('compares ISO weeks in their respective timezones', () => {
      // Same instant, different local weeks
      const ny = Temporal.ZonedDateTime.from(
        '2025-01-26T23:00:00-05:00[America/New_York]'
      );
      const tokyo = Temporal.ZonedDateTime.from(
        '2025-01-27T13:00:00+09:00[Asia/Tokyo]'
      );

      // Same instant (both are 04:00 UTC on Jan 27)
      // But different local weeks from each person's perspective
      // ny: Sunday Jan 26 (Week 4) in NY
      // tokyo: Monday Jan 27 (Week 5) in Tokyo
      expect(isSameWeek(ny, tokyo)).toBe(false);

      // Convert to UTC to compare in UTC timezone
      expect(isSameWeek(ny.withTimeZone('UTC'), tokyo.withTimeZone('UTC'))).toBe(true);

      // Convert to NY timezone to compare from NY perspective
      expect(isSameWeek(ny, tokyo.withTimeZone('America/New_York'))).toBe(true);
    });

    it('returns true when same ISO week in same timezone', () => {
      const tuesday = Temporal.ZonedDateTime.from(
        '2025-01-21T09:00:00+09:00[Asia/Tokyo]'
      );
      const friday = Temporal.ZonedDateTime.from(
        '2025-01-24T21:00:00+09:00[Asia/Tokyo]'
      );

      expect(isSameWeek(tuesday, friday)).toBe(true);
    });
  });

  describe('with Instant', () => {
    it('returns true for same week in UTC', () => {
      const instant1 = Temporal.Instant.from('2025-01-20T10:00:00Z');
      const instant2 = Temporal.Instant.from('2025-01-25T23:00:00Z');

      expect(isSameWeek(instant1, instant2)).toBe(true);
    });

    it('returns false for different weeks in UTC', () => {
      const instant1 = Temporal.Instant.from('2025-01-19T23:59:59Z'); // Week 3
      const instant2 = Temporal.Instant.from('2025-01-20T00:00:00Z'); // Week 4

      expect(isSameWeek(instant1, instant2)).toBe(false);
    });

    it('returns true for start and end of same week', () => {
      const start = Temporal.Instant.from('2025-01-20T00:00:00Z'); // Monday
      const end = Temporal.Instant.from('2025-01-26T23:59:59.999999999Z'); // Sunday

      expect(isSameWeek(start, end)).toBe(true);
    });
  });

  describe('with mixed types', () => {
    it('compares Instant (UTC) with ZonedDateTime', () => {
      const instant = Temporal.Instant.from('2025-01-22T15:00:00Z');
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-24T10:00:00-05:00[America/New_York]'
      );

      // Both normalize to Week 4 of 2025 in UTC
      expect(isSameWeek(instant, zoned)).toBe(true);
    });

    it('compares ZonedDateTime with Instant across week boundary', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-19T20:00:00-05:00[America/New_York]'
      );
      const instant = Temporal.Instant.from('2025-01-20T02:00:00Z');

      // zoned: Jan 19 20:00 NY = Jan 20 01:00 UTC (Week 4)
      // instant: Jan 20 02:00 UTC (Week 4)
      // Different local weeks (Week 3 in NY, Week 4 in UTC)
      expect(isSameWeek(zoned, instant)).toBe(false);

      // Convert zoned to UTC to compare in UTC
      expect(isSameWeek(zoned.withTimeZone('UTC'), instant)).toBe(true);
    });

    it('handles timezone differences correctly', () => {
      const nyTime = Temporal.ZonedDateTime.from(
        '2025-01-20T00:00:00-05:00[America/New_York]'
      );
      const utcInstant = Temporal.Instant.from('2025-01-20T06:00:00Z');

      // Both normalize to UTC
      // nyTime becomes Jan 20 05:00 UTC (Week 4)
      // utcInstant is Jan 20 06:00 UTC (Week 4)
      expect(isSameWeek(nyTime, utcInstant)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('handles year boundary - Dec 29, 2024 (Week 52 of 2024)', () => {
      const dec23 = Temporal.ZonedDateTime.from(
        '2024-12-23T12:00:00Z[UTC]'
      );
      const dec29 = Temporal.ZonedDateTime.from(
        '2024-12-29T12:00:00Z[UTC]'
      );

      // Both in Week 52 of 2024 (Mon Dec 23 to Sun Dec 29)
      expect(isSameWeek(dec23, dec29)).toBe(true);
    });

    it('handles year boundary - Jan 1, 2025 belongs to Week 1 of 2025', () => {
      const jan1 = Temporal.ZonedDateTime.from(
        '2025-01-01T12:00:00Z[UTC]'
      );
      const jan5 = Temporal.ZonedDateTime.from(
        '2025-01-05T12:00:00Z[UTC]'
      );

      // Both in Week 1 of 2025
      expect(isSameWeek(jan1, jan5)).toBe(true);
    });

    it('returns false for last week of year vs first week of next year', () => {
      const dec29 = Temporal.ZonedDateTime.from(
        '2024-12-29T12:00:00Z[UTC]'
      ); // Week 52 of 2024
      const jan5 = Temporal.ZonedDateTime.from(
        '2025-01-05T12:00:00Z[UTC]'
      ); // Week 1 of 2025

      expect(isSameWeek(dec29, jan5)).toBe(false);
    });

    it('handles ISO week year that differs from calendar year', () => {
      // Dec 30, 2024 is a Monday and starts Week 1 of 2025 in ISO week system
      const dec30 = Temporal.ZonedDateTime.from(
        '2024-12-30T12:00:00Z[UTC]'
      );
      const jan1 = Temporal.ZonedDateTime.from(
        '2025-01-01T12:00:00Z[UTC]'
      );

      // Both should be in the same ISO week (Week 1 of 2025)
      expect(isSameWeek(dec30, jan1)).toBe(true);
    });

    it('handles week boundaries (Sunday to Monday)', () => {
      const sunday = Temporal.ZonedDateTime.from(
        '2025-01-19T23:59:59Z[UTC]'
      );
      const monday = Temporal.ZonedDateTime.from(
        '2025-01-20T00:00:00Z[UTC]'
      );

      // Different weeks (Week 3 vs Week 4)
      expect(isSameWeek(sunday, monday)).toBe(false);
    });

    it('handles DST spring forward transition', () => {
      // March 9, 2025: DST begins in New York (2 AM -> 3 AM)
      const beforeDst = Temporal.ZonedDateTime.from(
        '2025-03-09T01:30:00-05:00[America/New_York]'
      );
      const afterDst = Temporal.ZonedDateTime.from(
        '2025-03-09T03:30:00-04:00[America/New_York]'
      );

      // Both are in the same week (Week 10 of 2025)
      expect(isSameWeek(beforeDst, afterDst)).toBe(true);
    });

    it('handles DST fall back transition', () => {
      // November 2, 2025: DST ends in New York (2 AM -> 1 AM)
      const firstOccurrence = Temporal.ZonedDateTime.from(
        '2025-11-02T01:30:00-04:00[America/New_York]'
      );
      const secondOccurrence = Temporal.ZonedDateTime.from(
        '2025-11-02T01:30:00-05:00[America/New_York]'
      );

      // Both are in the same week (Week 44 of 2025)
      expect(isSameWeek(firstOccurrence, secondOccurrence)).toBe(true);
    });

    it('handles dates far in the past', () => {
      const past1 = Temporal.ZonedDateTime.from(
        '1970-01-01T10:00:00Z[UTC]'
      ); // Thursday, Week 1 of 1970
      const past2 = Temporal.ZonedDateTime.from(
        '1970-01-04T20:00:00Z[UTC]'
      ); // Sunday, Week 1 of 1970

      expect(isSameWeek(past1, past2)).toBe(true);
    });

    it('handles dates far in the future', () => {
      const future1 = Temporal.ZonedDateTime.from(
        '2100-01-04T10:00:00Z[UTC]'
      ); // Monday, Week 1 of 2100
      const future2 = Temporal.ZonedDateTime.from(
        '2100-01-10T20:00:00Z[UTC]'
      ); // Sunday, Week 1 of 2100

      expect(isSameWeek(future1, future2)).toBe(true);
    });

    it('handles leap year weeks', () => {
      // 2024 is a leap year
      const feb28 = Temporal.ZonedDateTime.from(
        '2024-02-28T12:00:00Z[UTC]'
      );
      const feb29 = Temporal.ZonedDateTime.from(
        '2024-02-29T12:00:00Z[UTC]'
      );

      // Both are in Week 9 of 2024
      expect(isSameWeek(feb28, feb29)).toBe(true);
    });

    it('verifies ISO 8601 week starts on Monday', () => {
      // Jan 20, 2025 is a Monday (start of Week 4)
      const monday = Temporal.ZonedDateTime.from(
        '2025-01-20T00:00:00Z[UTC]'
      );
      const tuesday = Temporal.ZonedDateTime.from(
        '2025-01-21T00:00:00Z[UTC]'
      );

      expect(isSameWeek(monday, tuesday)).toBe(true);
    });
  });

  describe('same timezone, different weeks', () => {
    it('returns false for consecutive weeks', () => {
      const week3 = Temporal.ZonedDateTime.from(
        '2025-01-15T12:00:00-05:00[America/New_York]'
      );
      const week4 = Temporal.ZonedDateTime.from(
        '2025-01-22T12:00:00-05:00[America/New_York]'
      );

      expect(isSameWeek(week3, week4)).toBe(false);
    });

    it('returns false for weeks far apart', () => {
      const week1 = Temporal.ZonedDateTime.from(
        '2025-01-06T12:00:00-05:00[America/New_York]'
      );
      const week52 = Temporal.ZonedDateTime.from(
        '2025-12-22T12:00:00-05:00[America/New_York]'
      );

      expect(isSameWeek(week1, week52)).toBe(false);
    });
  });

  describe('ISO 8601 week edge cases', () => {
    it('handles week 53 years (years with 53 ISO weeks)', () => {
      // 2020 had 53 ISO weeks
      // Week 53 of 2020: Dec 28, 2020 (Mon) to Jan 3, 2021 (Sun)
      const dec28 = Temporal.ZonedDateTime.from(
        '2020-12-28T12:00:00Z[UTC]'
      );
      const dec31 = Temporal.ZonedDateTime.from(
        '2020-12-31T12:00:00Z[UTC]'
      );

      // Both should be in Week 53 of 2020
      expect(isSameWeek(dec28, dec31)).toBe(true);
    });

    it('returns false when crossing from Week 53 to Week 1', () => {
      const week53 = Temporal.ZonedDateTime.from(
        '2020-12-31T12:00:00Z[UTC]'
      ); // Week 53 of 2020
      const week1 = Temporal.ZonedDateTime.from(
        '2021-01-04T12:00:00Z[UTC]'
      ); // Week 1 of 2021

      expect(isSameWeek(week53, week1)).toBe(false);
    });
  });
});
