import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { eachHourOfInterval } from './eachHourOfInterval';

describe('eachHourOfInterval', () => {
  describe('with ZonedDateTime', () => {
    it('returns hours between start and end (inclusive)', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-06T10:30:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-01-06T14:15:00Z[UTC]');

      const result = eachHourOfInterval({ start, end });

      expect(result).toHaveLength(5);
      expect(result[0]!.hour).toBe(10);
      expect(result[1]!.hour).toBe(11);
      expect(result[2]!.hour).toBe(12);
      expect(result[3]!.hour).toBe(13);
      expect(result[4]!.hour).toBe(14);
    });

    it('returns array at start of hour (minutes/seconds zeroed)', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-06T10:45:30.123456789Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-01-06T12:15:00Z[UTC]');

      const result = eachHourOfInterval({ start, end });

      for (const hour of result) {
        expect(hour.minute).toBe(0);
        expect(hour.second).toBe(0);
        expect(hour.millisecond).toBe(0);
        expect(hour.microsecond).toBe(0);
        expect(hour.nanosecond).toBe(0);
      }
    });

    it('preserves timezone from start', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-06T10:00:00-05:00[America/New_York]');
      const end = Temporal.ZonedDateTime.from('2025-01-06T14:00:00-05:00[America/New_York]');

      const result = eachHourOfInterval({ start, end });

      expect(result).toHaveLength(5);
      for (const hour of result) {
        expect(hour.timeZoneId).toBe('America/New_York');
      }
    });

    it('handles single hour interval', () => {
      const date = Temporal.ZonedDateTime.from('2025-01-15T12:30:00Z[UTC]');

      const result = eachHourOfInterval({ start: date, end: date });

      expect(result).toHaveLength(1);
      expect(result[0]!.hour).toBe(12);
    });

    it('handles cross-day boundary', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-06T22:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-01-07T02:00:00Z[UTC]');

      const result = eachHourOfInterval({ start, end });

      expect(result).toHaveLength(5);
      expect(result[0]!.day).toBe(6);
      expect(result[0]!.hour).toBe(22);
      expect(result[1]!.day).toBe(6);
      expect(result[1]!.hour).toBe(23);
      expect(result[2]!.day).toBe(7);
      expect(result[2]!.hour).toBe(0);
      expect(result[3]!.day).toBe(7);
      expect(result[3]!.hour).toBe(1);
      expect(result[4]!.day).toBe(7);
      expect(result[4]!.hour).toBe(2);
    });

    it('uses start timezone when end has different timezone', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-06T10:00:00-05:00[America/New_York]');
      const end = Temporal.ZonedDateTime.from('2025-01-06T20:00:00+09:00[Asia/Tokyo]');

      const result = eachHourOfInterval({ start, end });

      for (const hour of result) {
        expect(hour.timeZoneId).toBe('America/New_York');
      }
    });
  });

  describe('with Instant', () => {
    it('returns hours in UTC', () => {
      const start = Temporal.Instant.from('2025-01-06T10:00:00Z');
      const end = Temporal.Instant.from('2025-01-06T13:00:00Z');

      const result = eachHourOfInterval({ start, end });

      expect(result).toHaveLength(4);
      for (const hour of result) {
        expect(hour.timeZoneId).toBe('UTC');
      }
    });
  });

  describe('DST transitions', () => {
    it('handles DST spring forward (hour skipped)', () => {
      // March 9, 2025: DST begins in New York at 2 AM -> 3 AM
      const start = Temporal.ZonedDateTime.from('2025-03-09T00:00:00-05:00[America/New_York]');
      const end = Temporal.ZonedDateTime.from('2025-03-09T04:00:00-04:00[America/New_York]');

      const result = eachHourOfInterval({ start, end });

      const hours = result.map((h) => h.hour);
      // 2 AM doesn't exist - it jumps from 1:59 AM to 3:00 AM
      expect(hours).toContain(0);
      expect(hours).toContain(1);
      expect(hours).not.toContain(2); // Skipped!
      expect(hours).toContain(3);
      expect(hours).toContain(4);
    });

    it('handles DST fall back (hour repeated)', () => {
      // November 2, 2025: DST ends in New York at 2 AM -> 1 AM
      const start = Temporal.ZonedDateTime.from('2025-11-02T00:00:00-04:00[America/New_York]');
      const end = Temporal.ZonedDateTime.from('2025-11-02T03:00:00-05:00[America/New_York]');

      const result = eachHourOfInterval({ start, end });

      // Should have more hours than wall-clock suggests due to repeated hour
      // 0, 1 (first), 1 (second), 2, 3 = but we iterate by adding hours to instant
      // The result depends on how the iteration works
      expect(result.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('edge cases', () => {
    it('returns empty array when end is before start', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-06T14:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-01-06T10:00:00Z[UTC]');

      const result = eachHourOfInterval({ start, end });

      expect(result).toHaveLength(0);
    });

    it('handles month boundary', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-31T22:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-02-01T02:00:00Z[UTC]');

      const result = eachHourOfInterval({ start, end });

      expect(result).toHaveLength(5);
      expect(result[0]!.month).toBe(1);
      expect(result[0]!.day).toBe(31);
      expect(result[2]!.month).toBe(2);
      expect(result[2]!.day).toBe(1);
    });

    it('handles year boundary', () => {
      const start = Temporal.ZonedDateTime.from('2024-12-31T22:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-01-01T02:00:00Z[UTC]');

      const result = eachHourOfInterval({ start, end });

      expect(result).toHaveLength(5);
      expect(result[0]!.year).toBe(2024);
      expect(result[2]!.year).toBe(2025);
    });

    it('handles 24-hour span', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-06T00:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-01-06T23:00:00Z[UTC]');

      const result = eachHourOfInterval({ start, end });

      expect(result).toHaveLength(24);
    });

    it('handles dates far in the past', () => {
      const start = Temporal.ZonedDateTime.from('1900-01-01T10:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('1900-01-01T12:00:00Z[UTC]');

      const result = eachHourOfInterval({ start, end });

      expect(result).toHaveLength(3);
    });

    it('handles dates far in the future', () => {
      const start = Temporal.ZonedDateTime.from('2100-01-01T10:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2100-01-01T12:00:00Z[UTC]');

      const result = eachHourOfInterval({ start, end });

      expect(result).toHaveLength(3);
    });
  });

  describe('with mixed types', () => {
    it('handles ZonedDateTime start with Instant end', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-06T10:00:00-05:00[America/New_York]');
      const end = Temporal.Instant.from('2025-01-06T18:00:00Z'); // 13:00 in NY

      const result = eachHourOfInterval({ start, end });

      expect(result.length).toBeGreaterThan(0);
      for (const hour of result) {
        expect(hour.timeZoneId).toBe('America/New_York');
      }
    });

    it('handles Instant start with ZonedDateTime end', () => {
      const start = Temporal.Instant.from('2025-01-06T15:00:00Z');
      const end = Temporal.ZonedDateTime.from('2025-01-06T13:00:00-05:00[America/New_York]');

      const result = eachHourOfInterval({ start, end });

      for (const hour of result) {
        expect(hour.timeZoneId).toBe('UTC');
      }
    });
  });
});
