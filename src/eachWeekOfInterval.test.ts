import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { eachWeekOfInterval } from './eachWeekOfInterval';

describe('eachWeekOfInterval', () => {
  describe('with ZonedDateTime', () => {
    it('returns weeks between start and end (inclusive)', () => {
      // Monday Jan 6 to Wednesday Jan 22
      const start = Temporal.ZonedDateTime.from('2025-01-06T10:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-01-22T14:00:00Z[UTC]');

      const result = eachWeekOfInterval({ start, end });

      expect(result).toHaveLength(3);
      expect(result[0]!.toPlainDate().toString()).toBe('2025-01-06'); // Week 2
      expect(result[1]!.toPlainDate().toString()).toBe('2025-01-13'); // Week 3
      expect(result[2]!.toPlainDate().toString()).toBe('2025-01-20'); // Week 4
    });

    it('returns Mondays at midnight (ISO 8601)', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-08T15:30:45Z[UTC]'); // Wednesday
      const end = Temporal.ZonedDateTime.from('2025-01-20T08:15:00Z[UTC]');   // Monday

      const result = eachWeekOfInterval({ start, end });

      for (const week of result) {
        expect(week.dayOfWeek).toBe(1); // Monday
        expect(week.hour).toBe(0);
        expect(week.minute).toBe(0);
        expect(week.second).toBe(0);
      }
    });

    it('preserves timezone from start', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-06T10:00:00-05:00[America/New_York]');
      const end = Temporal.ZonedDateTime.from('2025-01-20T14:00:00-05:00[America/New_York]');

      const result = eachWeekOfInterval({ start, end });

      for (const week of result) {
        expect(week.timeZoneId).toBe('America/New_York');
      }
    });

    it('handles single week interval', () => {
      // Wednesday to Friday of same week
      const start = Temporal.ZonedDateTime.from('2025-01-08T10:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-01-10T14:00:00Z[UTC]');

      const result = eachWeekOfInterval({ start, end });

      expect(result).toHaveLength(1);
      expect(result[0]!.toPlainDate().toString()).toBe('2025-01-06'); // Monday of that week
    });

    it('handles mid-week start and end', () => {
      // Wednesday Jan 8 to Wednesday Jan 15
      const start = Temporal.ZonedDateTime.from('2025-01-08T10:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-01-15T14:00:00Z[UTC]');

      const result = eachWeekOfInterval({ start, end });

      expect(result).toHaveLength(2);
      expect(result[0]!.toPlainDate().toString()).toBe('2025-01-06'); // Monday of week containing Jan 8
      expect(result[1]!.toPlainDate().toString()).toBe('2025-01-13'); // Monday of week containing Jan 15
    });

    it('handles Sunday (end of ISO week)', () => {
      // Sunday Jan 5 to Sunday Jan 19
      const start = Temporal.ZonedDateTime.from('2025-01-05T10:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-01-19T14:00:00Z[UTC]');

      const result = eachWeekOfInterval({ start, end });

      expect(result).toHaveLength(3);
      expect(result[0]!.toPlainDate().toString()).toBe('2024-12-30'); // Monday of week containing Jan 5
      expect(result[1]!.toPlainDate().toString()).toBe('2025-01-06');
      expect(result[2]!.toPlainDate().toString()).toBe('2025-01-13'); // Monday of week containing Jan 19
    });
  });

  describe('with Instant', () => {
    it('returns weeks in UTC', () => {
      const start = Temporal.Instant.from('2025-01-06T00:00:00Z');
      const end = Temporal.Instant.from('2025-01-20T00:00:00Z');

      const result = eachWeekOfInterval({ start, end });

      expect(result).toHaveLength(3);
      for (const week of result) {
        expect(week.timeZoneId).toBe('UTC');
      }
    });
  });

  describe('cross-year boundaries', () => {
    it('handles year boundary (2024-2025)', () => {
      const start = Temporal.ZonedDateTime.from('2024-12-25T00:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-01-08T00:00:00Z[UTC]');

      const result = eachWeekOfInterval({ start, end });

      expect(result).toHaveLength(3);
      expect(result[0]!.toPlainDate().toString()).toBe('2024-12-23'); // Monday of week containing Dec 25
      expect(result[1]!.toPlainDate().toString()).toBe('2024-12-30'); // Week spanning year boundary
      expect(result[2]!.toPlainDate().toString()).toBe('2025-01-06'); // Monday of week containing Jan 8
    });

    it('handles ISO week 1 edge case', () => {
      // ISO week 1 of 2025 starts on Dec 30, 2024
      const start = Temporal.ZonedDateTime.from('2024-12-30T00:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-01-05T00:00:00Z[UTC]');

      const result = eachWeekOfInterval({ start, end });

      expect(result).toHaveLength(1);
      expect(result[0]!.toPlainDate().toString()).toBe('2024-12-30');
    });

    it('handles week 53 (years that have it)', () => {
      // 2020 had a week 53
      const start = Temporal.ZonedDateTime.from('2020-12-28T00:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2021-01-04T00:00:00Z[UTC]');

      const result = eachWeekOfInterval({ start, end });

      expect(result).toHaveLength(2);
      expect(result[0]!.toPlainDate().toString()).toBe('2020-12-28'); // Week 53
      expect(result[1]!.toPlainDate().toString()).toBe('2021-01-04'); // Week 1 of 2021
    });
  });

  describe('edge cases', () => {
    it('returns empty array when end is before start', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-20T00:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-01-06T00:00:00Z[UTC]');

      const result = eachWeekOfInterval({ start, end });

      expect(result).toHaveLength(0);
    });

    it('handles full year (52-53 weeks)', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-01T00:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-12-31T23:59:59Z[UTC]');

      const result = eachWeekOfInterval({ start, end });

      // 2025 has 52 weeks, but interval spans parts of week 1 and last week
      expect(result.length).toBeGreaterThanOrEqual(52);
      expect(result.length).toBeLessThanOrEqual(54);
    });

    it('handles dates far in the past', () => {
      const start = Temporal.ZonedDateTime.from('1900-01-01T00:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('1900-01-21T00:00:00Z[UTC]');

      const result = eachWeekOfInterval({ start, end });

      expect(result.length).toBeGreaterThan(0);
    });

    it('handles dates far in the future', () => {
      const start = Temporal.ZonedDateTime.from('2100-01-01T00:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2100-01-21T00:00:00Z[UTC]');

      const result = eachWeekOfInterval({ start, end });

      expect(result.length).toBeGreaterThan(0);
    });

    it('handles month boundary', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-27T00:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-02-10T00:00:00Z[UTC]');

      const result = eachWeekOfInterval({ start, end });

      expect(result).toHaveLength(3);
      expect(result[0]!.toPlainDate().toString()).toBe('2025-01-27');
      expect(result[1]!.toPlainDate().toString()).toBe('2025-02-03');
      expect(result[2]!.toPlainDate().toString()).toBe('2025-02-10');
    });
  });

  describe('DST considerations', () => {
    it('handles DST spring forward week', () => {
      // March 9, 2025: DST begins in US
      const start = Temporal.ZonedDateTime.from('2025-03-03T10:00:00-05:00[America/New_York]');
      const end = Temporal.ZonedDateTime.from('2025-03-17T10:00:00-04:00[America/New_York]');

      const result = eachWeekOfInterval({ start, end });

      expect(result).toHaveLength(3);
      for (const week of result) {
        expect(week.dayOfWeek).toBe(1);
        expect(week.hour).toBe(0);
      }
    });

    it('handles DST fall back week', () => {
      // November 2, 2025: DST ends in US
      const start = Temporal.ZonedDateTime.from('2025-10-27T10:00:00-04:00[America/New_York]');
      const end = Temporal.ZonedDateTime.from('2025-11-10T10:00:00-05:00[America/New_York]');

      const result = eachWeekOfInterval({ start, end });

      expect(result).toHaveLength(3);
    });
  });

  describe('with mixed types', () => {
    it('handles ZonedDateTime start with Instant end', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-06T10:00:00-05:00[America/New_York]');
      const end = Temporal.Instant.from('2025-01-20T15:00:00Z');

      const result = eachWeekOfInterval({ start, end });

      for (const week of result) {
        expect(week.timeZoneId).toBe('America/New_York');
      }
    });

    it('handles Instant start with ZonedDateTime end', () => {
      const start = Temporal.Instant.from('2025-01-06T15:00:00Z');
      const end = Temporal.ZonedDateTime.from('2025-01-20T10:00:00-05:00[America/New_York]');

      const result = eachWeekOfInterval({ start, end });

      for (const week of result) {
        expect(week.timeZoneId).toBe('UTC');
      }
    });

    it('uses start timezone when end has different timezone', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-06T10:00:00-05:00[America/New_York]');
      const end = Temporal.ZonedDateTime.from('2025-01-20T10:00:00+09:00[Asia/Tokyo]');

      const result = eachWeekOfInterval({ start, end });

      for (const week of result) {
        expect(week.timeZoneId).toBe('America/New_York');
      }
    });
  });
});
