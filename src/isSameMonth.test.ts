import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { isSameMonth } from './isSameMonth';

describe('isSameMonth', () => {
  describe('with ZonedDateTime', () => {
    it('returns true for same month, different days', () => {
      const start = Temporal.ZonedDateTime.from(
        '2025-01-01T08:00:00-05:00[America/New_York]'
      );
      const end = Temporal.ZonedDateTime.from(
        '2025-01-31T18:00:00-05:00[America/New_York]'
      );

      expect(isSameMonth(start, end)).toBe(true);
    });

    it('returns false for different months', () => {
      const jan = Temporal.ZonedDateTime.from(
        '2025-01-20T18:00:00-05:00[America/New_York]'
      );
      const feb = Temporal.ZonedDateTime.from(
        '2025-02-20T18:00:00-05:00[America/New_York]'
      );

      expect(isSameMonth(jan, feb)).toBe(false);
    });

    it('returns true for exact same instant', () => {
      const date1 = Temporal.ZonedDateTime.from(
        '2025-01-20T10:00:00-05:00[America/New_York]'
      );
      const date2 = Temporal.ZonedDateTime.from(
        '2025-01-20T10:00:00-05:00[America/New_York]'
      );

      expect(isSameMonth(date1, date2)).toBe(true);
    });

    it('returns true for start and end of same month', () => {
      const start = Temporal.ZonedDateTime.from(
        '2025-01-01T00:00:00Z[UTC]'
      );
      const end = Temporal.ZonedDateTime.from(
        '2025-01-31T23:59:59.999999999Z[UTC]'
      );

      expect(isSameMonth(start, end)).toBe(true);
    });

    it('compares calendar months in their respective timezones', () => {
      // Same instant, different calendar months in local time
      const ny = Temporal.ZonedDateTime.from(
        '2025-01-31T23:00:00-05:00[America/New_York]'
      );
      const tokyo = Temporal.ZonedDateTime.from(
        '2025-02-01T13:00:00+09:00[Asia/Tokyo]'
      );

      // Same instant (both are 04:00 UTC on Feb 1)
      // But different calendar months from each person's perspective
      expect(isSameMonth(ny, tokyo)).toBe(false);

      // Convert to UTC to compare in UTC timezone
      expect(isSameMonth(ny.withTimeZone('UTC'), tokyo.withTimeZone('UTC'))).toBe(true);

      // Convert to NY timezone to compare from NY perspective
      expect(isSameMonth(ny, tokyo.withTimeZone('America/New_York'))).toBe(true);
    });

    it('returns true when same calendar month in same timezone', () => {
      const firstDay = Temporal.ZonedDateTime.from(
        '2025-03-01T09:00:00+09:00[Asia/Tokyo]'
      );
      const lastDay = Temporal.ZonedDateTime.from(
        '2025-03-31T21:00:00+09:00[Asia/Tokyo]'
      );

      expect(isSameMonth(firstDay, lastDay)).toBe(true);
    });

    it('returns false for same month but different years', () => {
      const jan2024 = Temporal.ZonedDateTime.from(
        '2024-01-15T12:00:00Z[UTC]'
      );
      const jan2025 = Temporal.ZonedDateTime.from(
        '2025-01-15T12:00:00Z[UTC]'
      );

      expect(isSameMonth(jan2024, jan2025)).toBe(false);
    });
  });

  describe('with Instant', () => {
    it('returns true for same month in UTC', () => {
      const instant1 = Temporal.Instant.from('2025-01-05T10:00:00Z');
      const instant2 = Temporal.Instant.from('2025-01-25T23:00:00Z');

      expect(isSameMonth(instant1, instant2)).toBe(true);
    });

    it('returns false for different months in UTC', () => {
      const instant1 = Temporal.Instant.from('2025-01-31T23:59:59Z');
      const instant2 = Temporal.Instant.from('2025-02-01T00:00:00Z');

      expect(isSameMonth(instant1, instant2)).toBe(false);
    });

    it('returns true for start and end of same month', () => {
      const start = Temporal.Instant.from('2025-03-01T00:00:00Z');
      const end = Temporal.Instant.from('2025-03-31T23:59:59.999999999Z');

      expect(isSameMonth(start, end)).toBe(true);
    });
  });

  describe('with mixed types', () => {
    it('compares Instant (UTC) with ZonedDateTime', () => {
      const instant = Temporal.Instant.from('2025-03-15T15:00:00Z');
      const zoned = Temporal.ZonedDateTime.from(
        '2025-03-20T10:00:00-04:00[America/New_York]'
      );

      // Both normalize to March 2025 in UTC
      expect(isSameMonth(instant, zoned)).toBe(true);
    });

    it('compares ZonedDateTime with Instant across month boundary', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-31T20:00:00-05:00[America/New_York]'
      );
      const instant = Temporal.Instant.from('2025-02-01T02:00:00Z');

      // zoned: Jan 31 2025 20:00 NY = Feb 1 2025 01:00 UTC
      // instant: Feb 1 2025 02:00 UTC
      // Different calendar months (Jan in NY vs Feb in UTC)
      expect(isSameMonth(zoned, instant)).toBe(false);

      // Convert zoned to UTC to compare in UTC
      expect(isSameMonth(zoned.withTimeZone('UTC'), instant)).toBe(true);
    });

    it('handles timezone differences correctly', () => {
      // NY midnight Feb 1 2025 = Feb 1 2025 05:00 UTC
      const nyMidnight = Temporal.ZonedDateTime.from(
        '2025-02-01T00:00:00-05:00[America/New_York]'
      );
      // UTC Jan 31 2025 23:00
      const utcInstant = Temporal.Instant.from('2025-01-31T23:00:00Z');

      // Both normalize to UTC
      // nyMidnight becomes Feb 1 2025 05:00 UTC -> Feb 2025
      // utcInstant is Jan 31 2025 23:00 UTC -> Jan 2025
      expect(isSameMonth(nyMidnight, utcInstant)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('handles leap year February 29', () => {
      const feb1 = Temporal.ZonedDateTime.from(
        '2024-02-01T08:00:00Z[UTC]'
      );
      const feb29 = Temporal.ZonedDateTime.from(
        '2024-02-29T20:00:00Z[UTC]'
      );

      expect(isSameMonth(feb1, feb29)).toBe(true);
    });

    it('returns false for Feb vs Mar in leap year', () => {
      const feb29 = Temporal.ZonedDateTime.from(
        '2024-02-29T23:59:59Z[UTC]'
      );
      const mar1 = Temporal.ZonedDateTime.from(
        '2024-03-01T00:00:00Z[UTC]'
      );

      expect(isSameMonth(feb29, mar1)).toBe(false);
    });

    it('handles month boundaries', () => {
      const endOfMonth = Temporal.ZonedDateTime.from(
        '2025-01-31T23:59:59Z[UTC]'
      );
      const startOfNextMonth = Temporal.ZonedDateTime.from(
        '2025-02-01T00:00:00Z[UTC]'
      );

      expect(isSameMonth(endOfMonth, startOfNextMonth)).toBe(false);
    });

    it('handles year boundaries', () => {
      const dec = Temporal.ZonedDateTime.from(
        '2024-12-31T23:59:59Z[UTC]'
      );
      const jan = Temporal.ZonedDateTime.from(
        '2025-01-01T00:00:00Z[UTC]'
      );

      expect(isSameMonth(dec, jan)).toBe(false);
    });

    it('handles DST spring forward transition', () => {
      // March 9, 2025: DST begins in New York (2 AM -> 3 AM)
      const beforeDst = Temporal.ZonedDateTime.from(
        '2025-03-09T01:30:00-05:00[America/New_York]'
      );
      const afterDst = Temporal.ZonedDateTime.from(
        '2025-03-09T03:30:00-04:00[America/New_York]'
      );

      // Both are March 2025
      expect(isSameMonth(beforeDst, afterDst)).toBe(true);
    });

    it('handles DST fall back transition', () => {
      // November 2, 2025: DST ends in New York (2 AM -> 1 AM)
      const firstOccurrence = Temporal.ZonedDateTime.from(
        '2025-11-02T01:30:00-04:00[America/New_York]'
      );
      const secondOccurrence = Temporal.ZonedDateTime.from(
        '2025-11-02T01:30:00-05:00[America/New_York]'
      );

      // Both are November 2025
      expect(isSameMonth(firstOccurrence, secondOccurrence)).toBe(true);
    });

    it('handles dates far in the past', () => {
      const past1 = Temporal.ZonedDateTime.from(
        '1970-01-01T10:00:00Z[UTC]'
      );
      const past2 = Temporal.ZonedDateTime.from(
        '1970-01-31T20:00:00Z[UTC]'
      );

      expect(isSameMonth(past1, past2)).toBe(true);
    });

    it('handles dates far in the future', () => {
      const future1 = Temporal.ZonedDateTime.from(
        '2100-12-01T10:00:00Z[UTC]'
      );
      const future2 = Temporal.ZonedDateTime.from(
        '2100-12-31T20:00:00Z[UTC]'
      );

      expect(isSameMonth(future1, future2)).toBe(true);
    });

    it('handles short month (February)', () => {
      const feb1 = Temporal.ZonedDateTime.from(
        '2025-02-01T12:00:00Z[UTC]'
      );
      const feb28 = Temporal.ZonedDateTime.from(
        '2025-02-28T12:00:00Z[UTC]'
      );

      expect(isSameMonth(feb1, feb28)).toBe(true);
    });

    it('handles long month (31 days)', () => {
      const jan1 = Temporal.ZonedDateTime.from(
        '2025-01-01T12:00:00Z[UTC]'
      );
      const jan31 = Temporal.ZonedDateTime.from(
        '2025-01-31T12:00:00Z[UTC]'
      );

      expect(isSameMonth(jan1, jan31)).toBe(true);
    });
  });

  describe('same timezone, different months', () => {
    it('returns false for consecutive months', () => {
      const month1 = Temporal.ZonedDateTime.from(
        '2025-01-15T12:00:00-05:00[America/New_York]'
      );
      const month2 = Temporal.ZonedDateTime.from(
        '2025-02-15T12:00:00-05:00[America/New_York]'
      );

      expect(isSameMonth(month1, month2)).toBe(false);
    });

    it('returns false for months far apart', () => {
      const jan = Temporal.ZonedDateTime.from(
        '2025-01-15T12:00:00-05:00[America/New_York]'
      );
      const dec = Temporal.ZonedDateTime.from(
        '2025-12-15T12:00:00-05:00[America/New_York]'
      );

      expect(isSameMonth(jan, dec)).toBe(false);
    });
  });
});
