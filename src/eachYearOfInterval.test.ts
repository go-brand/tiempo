import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { eachYearOfInterval } from './eachYearOfInterval';

describe('eachYearOfInterval', () => {
  describe('with ZonedDateTime', () => {
    it('returns years between start and end (inclusive)', () => {
      const start = Temporal.ZonedDateTime.from('2022-06-15T10:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-03-20T14:00:00Z[UTC]');

      const result = eachYearOfInterval({ start, end });

      expect(result).toHaveLength(4);
      expect(result[0]!.year).toBe(2022);
      expect(result[1]!.year).toBe(2023);
      expect(result[2]!.year).toBe(2024);
      expect(result[3]!.year).toBe(2025);
    });

    it('returns January 1st at midnight for each year', () => {
      const start = Temporal.ZonedDateTime.from('2022-06-15T15:30:45Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-03-20T08:15:00Z[UTC]');

      const result = eachYearOfInterval({ start, end });

      for (const year of result) {
        expect(year.month).toBe(1);
        expect(year.day).toBe(1);
        expect(year.hour).toBe(0);
        expect(year.minute).toBe(0);
        expect(year.second).toBe(0);
        expect(year.millisecond).toBe(0);
      }
    });

    it('preserves timezone from start', () => {
      const start = Temporal.ZonedDateTime.from('2022-06-15T10:00:00-04:00[America/New_York]');
      const end = Temporal.ZonedDateTime.from('2025-03-20T14:00:00-04:00[America/New_York]');

      const result = eachYearOfInterval({ start, end });

      expect(result).toHaveLength(4);
      for (const year of result) {
        expect(year.timeZoneId).toBe('America/New_York');
      }
    });

    it('handles single year interval', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-15T00:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-12-31T23:59:59Z[UTC]');

      const result = eachYearOfInterval({ start, end });

      expect(result).toHaveLength(1);
      expect(result[0]!.year).toBe(2025);
    });

    it('uses start timezone when end has different timezone', () => {
      const start = Temporal.ZonedDateTime.from('2022-06-15T10:00:00-04:00[America/New_York]');
      const end = Temporal.ZonedDateTime.from('2025-06-15T10:00:00+09:00[Asia/Tokyo]');

      const result = eachYearOfInterval({ start, end });

      for (const year of result) {
        expect(year.timeZoneId).toBe('America/New_York');
      }
    });
  });

  describe('with Instant', () => {
    it('returns years in UTC', () => {
      const start = Temporal.Instant.from('2022-06-15T00:00:00Z');
      const end = Temporal.Instant.from('2025-06-15T00:00:00Z');

      const result = eachYearOfInterval({ start, end });

      expect(result).toHaveLength(4);
      for (const year of result) {
        expect(year.timeZoneId).toBe('UTC');
      }
    });
  });

  describe('edge cases', () => {
    it('returns empty array when end is before start', () => {
      const start = Temporal.ZonedDateTime.from('2025-06-15T00:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2022-06-15T00:00:00Z[UTC]');

      const result = eachYearOfInterval({ start, end });

      expect(result).toHaveLength(0);
    });

    it('handles decade span', () => {
      const start = Temporal.ZonedDateTime.from('2015-01-01T00:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-12-31T23:59:59Z[UTC]');

      const result = eachYearOfInterval({ start, end });

      expect(result).toHaveLength(11);
    });

    it('handles century span', () => {
      const start = Temporal.ZonedDateTime.from('1990-01-01T00:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2010-12-31T23:59:59Z[UTC]');

      const result = eachYearOfInterval({ start, end });

      expect(result).toHaveLength(21);
    });

    it('handles dates far in the past', () => {
      const start = Temporal.ZonedDateTime.from('1800-01-01T00:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('1805-12-31T00:00:00Z[UTC]');

      const result = eachYearOfInterval({ start, end });

      expect(result).toHaveLength(6);
    });

    it('handles dates far in the future', () => {
      const start = Temporal.ZonedDateTime.from('2200-01-01T00:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2205-12-31T00:00:00Z[UTC]');

      const result = eachYearOfInterval({ start, end });

      expect(result).toHaveLength(6);
    });

    it('handles leap years correctly', () => {
      const start = Temporal.ZonedDateTime.from('2024-02-29T12:00:00Z[UTC]'); // Leap day
      const end = Temporal.ZonedDateTime.from('2028-02-29T12:00:00Z[UTC]');   // Next leap day

      const result = eachYearOfInterval({ start, end });

      expect(result).toHaveLength(5);
      expect(result[0]!.year).toBe(2024);
      expect(result[4]!.year).toBe(2028);
    });

    it('handles start on Dec 31', () => {
      const start = Temporal.ZonedDateTime.from('2024-12-31T23:59:59Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2026-01-01T00:00:00Z[UTC]');

      const result = eachYearOfInterval({ start, end });

      expect(result).toHaveLength(3);
      expect(result[0]!.year).toBe(2024);
      expect(result[1]!.year).toBe(2025);
      expect(result[2]!.year).toBe(2026);
    });

    it('handles end on Jan 1', () => {
      const start = Temporal.ZonedDateTime.from('2024-06-15T00:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2026-01-01T00:00:00Z[UTC]');

      const result = eachYearOfInterval({ start, end });

      expect(result).toHaveLength(3);
    });
  });

  describe('timezone boundary cases', () => {
    it('handles New Year in different timezones', () => {
      // Dec 31 11 PM in New York is already Jan 1 in UTC
      const start = Temporal.ZonedDateTime.from('2024-12-31T23:00:00-05:00[America/New_York]');
      const end = Temporal.ZonedDateTime.from('2025-01-01T01:00:00-05:00[America/New_York]');

      const result = eachYearOfInterval({ start, end });

      // Both dates are in the same year in New York time
      expect(result).toHaveLength(2);
      expect(result[0]!.year).toBe(2024);
      expect(result[1]!.year).toBe(2025);
    });

    it('handles timezone where year starts at unusual time', () => {
      // Pacific/Kiritimati is UTC+14, one of the first places to see New Year
      const start = Temporal.ZonedDateTime.from('2024-12-31T10:00:00+14:00[Pacific/Kiritimati]');
      const end = Temporal.ZonedDateTime.from('2025-01-01T10:00:00+14:00[Pacific/Kiritimati]');

      const result = eachYearOfInterval({ start, end });

      expect(result).toHaveLength(2);
    });
  });

  describe('DST considerations', () => {
    it('handles year containing DST transitions', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-01T00:00:00-05:00[America/New_York]');
      const end = Temporal.ZonedDateTime.from('2027-12-31T00:00:00-05:00[America/New_York]');

      const result = eachYearOfInterval({ start, end });

      expect(result).toHaveLength(3);
      // All Jan 1sts should be at midnight in their respective offset
      for (const year of result) {
        expect(year.month).toBe(1);
        expect(year.day).toBe(1);
        expect(year.hour).toBe(0);
      }
    });
  });

  describe('with mixed types', () => {
    it('handles ZonedDateTime start with Instant end', () => {
      const start = Temporal.ZonedDateTime.from('2022-06-15T10:00:00-04:00[America/New_York]');
      const end = Temporal.Instant.from('2025-06-15T15:00:00Z');

      const result = eachYearOfInterval({ start, end });

      for (const year of result) {
        expect(year.timeZoneId).toBe('America/New_York');
      }
    });

    it('handles Instant start with ZonedDateTime end', () => {
      const start = Temporal.Instant.from('2022-06-15T15:00:00Z');
      const end = Temporal.ZonedDateTime.from('2025-06-15T10:00:00-04:00[America/New_York]');

      const result = eachYearOfInterval({ start, end });

      for (const year of result) {
        expect(year.timeZoneId).toBe('UTC');
      }
    });
  });
});
