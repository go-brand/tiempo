import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { eachMinuteOfInterval } from './eachMinuteOfInterval';

describe('eachMinuteOfInterval', () => {
  describe('with ZonedDateTime', () => {
    it('returns minutes between start and end (inclusive)', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-06T10:30:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-01-06T10:34:45Z[UTC]');

      const result = eachMinuteOfInterval({ start, end });

      expect(result).toHaveLength(5);
      expect(result[0]!.minute).toBe(30);
      expect(result[1]!.minute).toBe(31);
      expect(result[2]!.minute).toBe(32);
      expect(result[3]!.minute).toBe(33);
      expect(result[4]!.minute).toBe(34);
    });

    it('returns array at start of minute (seconds zeroed)', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-06T10:30:45.123456789Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-01-06T10:32:15Z[UTC]');

      const result = eachMinuteOfInterval({ start, end });

      for (const minute of result) {
        expect(minute.second).toBe(0);
        expect(minute.millisecond).toBe(0);
        expect(minute.microsecond).toBe(0);
        expect(minute.nanosecond).toBe(0);
      }
    });

    it('preserves timezone from start', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-06T10:00:00-05:00[America/New_York]');
      const end = Temporal.ZonedDateTime.from('2025-01-06T10:05:00-05:00[America/New_York]');

      const result = eachMinuteOfInterval({ start, end });

      expect(result).toHaveLength(6);
      for (const minute of result) {
        expect(minute.timeZoneId).toBe('America/New_York');
      }
    });

    it('handles single minute interval', () => {
      const date = Temporal.ZonedDateTime.from('2025-01-15T12:30:45Z[UTC]');

      const result = eachMinuteOfInterval({ start: date, end: date });

      expect(result).toHaveLength(1);
      expect(result[0]!.minute).toBe(30);
    });

    it('handles cross-hour boundary', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-06T10:58:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-01-06T11:02:00Z[UTC]');

      const result = eachMinuteOfInterval({ start, end });

      expect(result).toHaveLength(5);
      expect(result[0]!.hour).toBe(10);
      expect(result[0]!.minute).toBe(58);
      expect(result[2]!.hour).toBe(11);
      expect(result[2]!.minute).toBe(0);
    });

    it('handles cross-day boundary', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-06T23:58:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-01-07T00:02:00Z[UTC]');

      const result = eachMinuteOfInterval({ start, end });

      expect(result).toHaveLength(5);
      expect(result[0]!.day).toBe(6);
      expect(result[2]!.day).toBe(7);
      expect(result[2]!.hour).toBe(0);
      expect(result[2]!.minute).toBe(0);
    });
  });

  describe('with Instant', () => {
    it('returns minutes in UTC', () => {
      const start = Temporal.Instant.from('2025-01-06T10:00:00Z');
      const end = Temporal.Instant.from('2025-01-06T10:03:00Z');

      const result = eachMinuteOfInterval({ start, end });

      expect(result).toHaveLength(4);
      for (const minute of result) {
        expect(minute.timeZoneId).toBe('UTC');
      }
    });
  });

  describe('edge cases', () => {
    it('returns empty array when end is before start', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-06T10:30:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-01-06T10:15:00Z[UTC]');

      const result = eachMinuteOfInterval({ start, end });

      expect(result).toHaveLength(0);
    });

    it('handles full hour (60 minutes)', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-06T10:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-01-06T10:59:00Z[UTC]');

      const result = eachMinuteOfInterval({ start, end });

      expect(result).toHaveLength(60);
    });

    it('handles month boundary', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-31T23:58:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-02-01T00:02:00Z[UTC]');

      const result = eachMinuteOfInterval({ start, end });

      expect(result).toHaveLength(5);
      expect(result[0]!.month).toBe(1);
      expect(result[2]!.month).toBe(2);
    });

    it('handles year boundary', () => {
      const start = Temporal.ZonedDateTime.from('2024-12-31T23:58:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-01-01T00:02:00Z[UTC]');

      const result = eachMinuteOfInterval({ start, end });

      expect(result).toHaveLength(5);
      expect(result[0]!.year).toBe(2024);
      expect(result[2]!.year).toBe(2025);
    });

    it('handles dates far in the past', () => {
      const start = Temporal.ZonedDateTime.from('1900-01-01T10:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('1900-01-01T10:05:00Z[UTC]');

      const result = eachMinuteOfInterval({ start, end });

      expect(result).toHaveLength(6);
    });

    it('handles dates far in the future', () => {
      const start = Temporal.ZonedDateTime.from('2100-01-01T10:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2100-01-01T10:05:00Z[UTC]');

      const result = eachMinuteOfInterval({ start, end });

      expect(result).toHaveLength(6);
    });

    it('handles moderate interval (1 hour = 61 minutes inclusive)', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-06T10:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-01-06T11:00:00Z[UTC]');

      const result = eachMinuteOfInterval({ start, end });

      expect(result).toHaveLength(61);
    });
  });

  describe('DST transitions', () => {
    it('handles DST spring forward', () => {
      // During the transition, minutes continue normally
      const start = Temporal.ZonedDateTime.from('2025-03-09T01:58:00-05:00[America/New_York]');
      const end = Temporal.ZonedDateTime.from('2025-03-09T03:02:00-04:00[America/New_York]');

      const result = eachMinuteOfInterval({ start, end });

      // Should have continuous minutes through the transition
      expect(result.length).toBeGreaterThan(0);
      for (const minute of result) {
        expect(minute.timeZoneId).toBe('America/New_York');
      }
    });

    it('handles DST fall back', () => {
      const start = Temporal.ZonedDateTime.from('2025-11-02T01:58:00-04:00[America/New_York]');
      const end = Temporal.ZonedDateTime.from('2025-11-02T01:02:00-05:00[America/New_York]');

      const result = eachMinuteOfInterval({ start, end });

      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('with mixed types', () => {
    it('handles ZonedDateTime start with Instant end', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-06T10:00:00-05:00[America/New_York]');
      const end = Temporal.Instant.from('2025-01-06T15:05:00Z');

      const result = eachMinuteOfInterval({ start, end });

      expect(result.length).toBeGreaterThan(0);
      for (const minute of result) {
        expect(minute.timeZoneId).toBe('America/New_York');
      }
    });

    it('handles Instant start with ZonedDateTime end', () => {
      const start = Temporal.Instant.from('2025-01-06T15:00:00Z');
      const end = Temporal.ZonedDateTime.from('2025-01-06T10:05:00-05:00[America/New_York]');

      const result = eachMinuteOfInterval({ start, end });

      for (const minute of result) {
        expect(minute.timeZoneId).toBe('UTC');
      }
    });
  });
});
