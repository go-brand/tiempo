import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { isSameYear } from './isSameYear';

describe('isSameYear', () => {
  describe('with ZonedDateTime', () => {
    it('returns true for same year, different months', () => {
      const jan = Temporal.ZonedDateTime.from(
        '2025-01-20T08:00:00-05:00[America/New_York]'
      );
      const dec = Temporal.ZonedDateTime.from(
        '2025-12-31T18:00:00-05:00[America/New_York]'
      );

      expect(isSameYear(jan, dec)).toBe(true);
    });

    it('returns false for different years', () => {
      const year2024 = Temporal.ZonedDateTime.from(
        '2024-06-15T18:00:00-04:00[America/New_York]'
      );
      const year2025 = Temporal.ZonedDateTime.from(
        '2025-06-15T18:00:00-04:00[America/New_York]'
      );

      expect(isSameYear(year2024, year2025)).toBe(false);
    });

    it('returns true for exact same instant', () => {
      const date1 = Temporal.ZonedDateTime.from(
        '2025-01-20T10:00:00-05:00[America/New_York]'
      );
      const date2 = Temporal.ZonedDateTime.from(
        '2025-01-20T10:00:00-05:00[America/New_York]'
      );

      expect(isSameYear(date1, date2)).toBe(true);
    });

    it('returns true for start and end of same year', () => {
      const start = Temporal.ZonedDateTime.from(
        '2025-01-01T00:00:00Z[UTC]'
      );
      const end = Temporal.ZonedDateTime.from(
        '2025-12-31T23:59:59.999999999Z[UTC]'
      );

      expect(isSameYear(start, end)).toBe(true);
    });

    it('compares calendar years in their respective timezones', () => {
      // Same instant, different calendar years in local time
      const ny = Temporal.ZonedDateTime.from(
        '2024-12-31T23:00:00-05:00[America/New_York]'
      );
      const tokyo = Temporal.ZonedDateTime.from(
        '2025-01-01T13:00:00+09:00[Asia/Tokyo]'
      );

      // Same instant (both are 04:00 UTC on Jan 1, 2025)
      // But different calendar years from each person's perspective
      expect(isSameYear(ny, tokyo)).toBe(false);

      // Convert to UTC to compare in UTC timezone
      expect(isSameYear(ny.withTimeZone('UTC'), tokyo.withTimeZone('UTC'))).toBe(true);

      // Convert to NY timezone to compare from NY perspective
      expect(isSameYear(ny, tokyo.withTimeZone('America/New_York'))).toBe(true);
    });

    it('returns true when same calendar year in same timezone', () => {
      const spring = Temporal.ZonedDateTime.from(
        '2025-03-20T09:00:00+09:00[Asia/Tokyo]'
      );
      const autumn = Temporal.ZonedDateTime.from(
        '2025-09-20T21:00:00+09:00[Asia/Tokyo]'
      );

      expect(isSameYear(spring, autumn)).toBe(true);
    });
  });

  describe('with Instant', () => {
    it('returns true for same year in UTC', () => {
      const instant1 = Temporal.Instant.from('2025-01-20T10:00:00Z');
      const instant2 = Temporal.Instant.from('2025-11-20T23:00:00Z');

      expect(isSameYear(instant1, instant2)).toBe(true);
    });

    it('returns false for different years in UTC', () => {
      const instant1 = Temporal.Instant.from('2024-12-31T23:59:59Z');
      const instant2 = Temporal.Instant.from('2025-01-01T00:00:00Z');

      expect(isSameYear(instant1, instant2)).toBe(false);
    });

    it('returns true for start and end of same year', () => {
      const start = Temporal.Instant.from('2025-01-01T00:00:00Z');
      const end = Temporal.Instant.from('2025-12-31T23:59:59.999999999Z');

      expect(isSameYear(start, end)).toBe(true);
    });
  });

  describe('with mixed types', () => {
    it('compares Instant (UTC) with ZonedDateTime', () => {
      const instant = Temporal.Instant.from('2025-06-15T15:00:00Z');
      const zoned = Temporal.ZonedDateTime.from(
        '2025-03-20T10:00:00-04:00[America/New_York]'
      );

      // Both normalize to 2025 in UTC
      expect(isSameYear(instant, zoned)).toBe(true);
    });

    it('compares ZonedDateTime with Instant across year boundary', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2024-12-31T20:00:00-05:00[America/New_York]'
      );
      const instant = Temporal.Instant.from('2025-01-01T02:00:00Z');

      // zoned: Dec 31 2024 20:00 NY = Jan 1 2025 01:00 UTC
      // instant: Jan 1 2025 02:00 UTC
      // Different calendar years (2024 in NY vs 2025 in UTC)
      expect(isSameYear(zoned, instant)).toBe(false);

      // Convert zoned to UTC to compare in UTC
      expect(isSameYear(zoned.withTimeZone('UTC'), instant)).toBe(true);
    });

    it('handles timezone differences correctly', () => {
      // NY midnight Jan 1 2025 = Jan 1 2025 05:00 UTC
      const nyMidnight = Temporal.ZonedDateTime.from(
        '2025-01-01T00:00:00-05:00[America/New_York]'
      );
      // UTC Dec 31 2024 23:00
      const utcInstant = Temporal.Instant.from('2024-12-31T23:00:00Z');

      // Both normalize to UTC
      // nyMidnight becomes Jan 1 2025 05:00 UTC -> 2025
      // utcInstant is Dec 31 2024 23:00 UTC -> 2024
      expect(isSameYear(nyMidnight, utcInstant)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('handles leap year February 29', () => {
      const feb29 = Temporal.ZonedDateTime.from(
        '2024-02-29T08:00:00Z[UTC]'
      );
      const dec31 = Temporal.ZonedDateTime.from(
        '2024-12-31T20:00:00Z[UTC]'
      );

      expect(isSameYear(feb29, dec31)).toBe(true);
    });

    it('returns false for leap year vs non-leap year', () => {
      const leapYear = Temporal.ZonedDateTime.from(
        '2024-02-29T12:00:00Z[UTC]'
      );
      const nonLeapYear = Temporal.ZonedDateTime.from(
        '2023-03-01T12:00:00Z[UTC]'
      );

      expect(isSameYear(leapYear, nonLeapYear)).toBe(false);
    });

    it('handles year boundaries', () => {
      const endOfYear = Temporal.ZonedDateTime.from(
        '2024-12-31T23:59:59Z[UTC]'
      );
      const startOfNextYear = Temporal.ZonedDateTime.from(
        '2025-01-01T00:00:00Z[UTC]'
      );

      expect(isSameYear(endOfYear, startOfNextYear)).toBe(false);
    });

    it('handles DST spring forward transition', () => {
      // March 9, 2025: DST begins in New York (2 AM -> 3 AM)
      const beforeDst = Temporal.ZonedDateTime.from(
        '2025-03-09T01:30:00-05:00[America/New_York]'
      );
      const afterDst = Temporal.ZonedDateTime.from(
        '2025-03-09T03:30:00-04:00[America/New_York]'
      );

      // Both are 2025
      expect(isSameYear(beforeDst, afterDst)).toBe(true);
    });

    it('handles DST fall back transition', () => {
      // November 2, 2025: DST ends in New York (2 AM -> 1 AM)
      const firstOccurrence = Temporal.ZonedDateTime.from(
        '2025-11-02T01:30:00-04:00[America/New_York]'
      );
      const secondOccurrence = Temporal.ZonedDateTime.from(
        '2025-11-02T01:30:00-05:00[America/New_York]'
      );

      // Both are 2025
      expect(isSameYear(firstOccurrence, secondOccurrence)).toBe(true);
    });

    it('handles dates far in the past', () => {
      const past1 = Temporal.ZonedDateTime.from(
        '1970-01-01T10:00:00Z[UTC]'
      );
      const past2 = Temporal.ZonedDateTime.from(
        '1970-12-31T20:00:00Z[UTC]'
      );

      expect(isSameYear(past1, past2)).toBe(true);
    });

    it('handles dates far in the future', () => {
      const future1 = Temporal.ZonedDateTime.from(
        '2100-01-01T10:00:00Z[UTC]'
      );
      const future2 = Temporal.ZonedDateTime.from(
        '2100-12-31T20:00:00Z[UTC]'
      );

      expect(isSameYear(future1, future2)).toBe(true);
    });
  });

  describe('same timezone, different years', () => {
    it('returns false for consecutive years', () => {
      const year1 = Temporal.ZonedDateTime.from(
        '2024-06-15T12:00:00-04:00[America/New_York]'
      );
      const year2 = Temporal.ZonedDateTime.from(
        '2025-06-15T12:00:00-04:00[America/New_York]'
      );

      expect(isSameYear(year1, year2)).toBe(false);
    });

    it('returns false for years far apart', () => {
      const year2020 = Temporal.ZonedDateTime.from(
        '2020-01-15T12:00:00-05:00[America/New_York]'
      );
      const year2030 = Temporal.ZonedDateTime.from(
        '2030-01-15T12:00:00-05:00[America/New_York]'
      );

      expect(isSameYear(year2020, year2030)).toBe(false);
    });
  });
});
