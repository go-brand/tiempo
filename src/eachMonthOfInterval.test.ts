import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { eachMonthOfInterval } from './eachMonthOfInterval';

describe('eachMonthOfInterval', () => {
  describe('with ZonedDateTime', () => {
    it('returns months between start and end (inclusive)', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-15T10:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-04-20T14:00:00Z[UTC]');

      const result = eachMonthOfInterval({ start, end });

      expect(result).toHaveLength(4);
      expect(result[0]!.month).toBe(1);
      expect(result[1]!.month).toBe(2);
      expect(result[2]!.month).toBe(3);
      expect(result[3]!.month).toBe(4);
    });

    it('returns array at first day of month at midnight', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-15T15:30:45Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-03-20T08:15:00Z[UTC]');

      const result = eachMonthOfInterval({ start, end });

      for (const month of result) {
        expect(month.day).toBe(1);
        expect(month.hour).toBe(0);
        expect(month.minute).toBe(0);
        expect(month.second).toBe(0);
        expect(month.millisecond).toBe(0);
      }
    });

    it('preserves timezone from start', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-15T10:00:00-05:00[America/New_York]');
      const end = Temporal.ZonedDateTime.from('2025-04-20T14:00:00-04:00[America/New_York]');

      const result = eachMonthOfInterval({ start, end });

      expect(result).toHaveLength(4);
      for (const month of result) {
        expect(month.timeZoneId).toBe('America/New_York');
      }
    });

    it('handles single month interval', () => {
      const start = Temporal.ZonedDateTime.from('2025-03-05T10:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-03-25T14:00:00Z[UTC]');

      const result = eachMonthOfInterval({ start, end });

      expect(result).toHaveLength(1);
      expect(result[0]!.month).toBe(3);
      expect(result[0]!.day).toBe(1);
    });

    it('handles cross-year boundary', () => {
      const start = Temporal.ZonedDateTime.from('2024-11-15T00:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-02-15T00:00:00Z[UTC]');

      const result = eachMonthOfInterval({ start, end });

      expect(result).toHaveLength(4);
      expect(result[0]!.year).toBe(2024);
      expect(result[0]!.month).toBe(11);
      expect(result[1]!.year).toBe(2024);
      expect(result[1]!.month).toBe(12);
      expect(result[2]!.year).toBe(2025);
      expect(result[2]!.month).toBe(1);
      expect(result[3]!.year).toBe(2025);
      expect(result[3]!.month).toBe(2);
    });

    it('uses start timezone when end has different timezone', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-15T10:00:00-05:00[America/New_York]');
      const end = Temporal.ZonedDateTime.from('2025-04-15T10:00:00+09:00[Asia/Tokyo]');

      const result = eachMonthOfInterval({ start, end });

      for (const month of result) {
        expect(month.timeZoneId).toBe('America/New_York');
      }
    });
  });

  describe('with Instant', () => {
    it('returns months in UTC', () => {
      const start = Temporal.Instant.from('2025-01-15T00:00:00Z');
      const end = Temporal.Instant.from('2025-03-15T00:00:00Z');

      const result = eachMonthOfInterval({ start, end });

      expect(result).toHaveLength(3);
      for (const month of result) {
        expect(month.timeZoneId).toBe('UTC');
      }
    });
  });

  describe('edge cases', () => {
    it('returns empty array when end is before start', () => {
      const start = Temporal.ZonedDateTime.from('2025-06-15T00:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-03-15T00:00:00Z[UTC]');

      const result = eachMonthOfInterval({ start, end });

      expect(result).toHaveLength(0);
    });

    it('handles full year (12 months)', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-01T00:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-12-31T23:59:59Z[UTC]');

      const result = eachMonthOfInterval({ start, end });

      expect(result).toHaveLength(12);
      for (let i = 0; i < 12; i++) {
        expect(result[i]!.month).toBe(i + 1);
      }
    });

    it('handles multi-year span', () => {
      const start = Temporal.ZonedDateTime.from('2023-06-15T00:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-06-15T00:00:00Z[UTC]');

      const result = eachMonthOfInterval({ start, end });

      // June 2023 to June 2025 = 25 months
      expect(result).toHaveLength(25);
    });

    it('handles leap year February', () => {
      const start = Temporal.ZonedDateTime.from('2024-01-15T00:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2024-03-15T00:00:00Z[UTC]');

      const result = eachMonthOfInterval({ start, end });

      expect(result).toHaveLength(3);
      expect(result[1]!.month).toBe(2);
      expect(result[1]!.year).toBe(2024);
    });

    it('handles dates far in the past', () => {
      const start = Temporal.ZonedDateTime.from('1900-01-15T00:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('1900-04-15T00:00:00Z[UTC]');

      const result = eachMonthOfInterval({ start, end });

      expect(result).toHaveLength(4);
    });

    it('handles dates far in the future', () => {
      const start = Temporal.ZonedDateTime.from('2100-01-15T00:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2100-04-15T00:00:00Z[UTC]');

      const result = eachMonthOfInterval({ start, end });

      expect(result).toHaveLength(4);
    });

    it('handles start on last day of month', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-31T23:59:59Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-03-01T00:00:00Z[UTC]');

      const result = eachMonthOfInterval({ start, end });

      expect(result).toHaveLength(3);
      expect(result[0]!.month).toBe(1);
      expect(result[1]!.month).toBe(2);
      expect(result[2]!.month).toBe(3);
    });

    it('handles end on first day of month', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-15T00:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-03-01T00:00:00Z[UTC]');

      const result = eachMonthOfInterval({ start, end });

      expect(result).toHaveLength(3);
    });
  });

  describe('DST considerations', () => {
    it('handles DST transition months correctly', () => {
      // March has DST spring forward in US
      const start = Temporal.ZonedDateTime.from('2025-02-15T10:00:00-05:00[America/New_York]');
      const end = Temporal.ZonedDateTime.from('2025-04-15T10:00:00-04:00[America/New_York]');

      const result = eachMonthOfInterval({ start, end });

      expect(result).toHaveLength(3);
      // All should be at midnight on the 1st
      for (const month of result) {
        expect(month.day).toBe(1);
        expect(month.hour).toBe(0);
      }
    });
  });

  describe('with mixed types', () => {
    it('handles ZonedDateTime start with Instant end', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-15T10:00:00-05:00[America/New_York]');
      const end = Temporal.Instant.from('2025-04-15T15:00:00Z');

      const result = eachMonthOfInterval({ start, end });

      expect(result.length).toBeGreaterThan(0);
      for (const month of result) {
        expect(month.timeZoneId).toBe('America/New_York');
      }
    });

    it('handles Instant start with ZonedDateTime end', () => {
      const start = Temporal.Instant.from('2025-01-15T15:00:00Z');
      const end = Temporal.ZonedDateTime.from('2025-04-15T10:00:00-04:00[America/New_York]');

      const result = eachMonthOfInterval({ start, end });

      for (const month of result) {
        expect(month.timeZoneId).toBe('UTC');
      }
    });
  });
});
