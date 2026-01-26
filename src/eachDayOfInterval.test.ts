import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { eachDayOfInterval } from './eachDayOfInterval';

describe('eachDayOfInterval', () => {
  describe('with ZonedDateTime', () => {
    it('returns days between start and end (inclusive)', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-06T10:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-01-10T14:00:00Z[UTC]');

      const result = eachDayOfInterval({ start, end });

      expect(result).toHaveLength(5);
      expect(result[0]!.toString()).toBe('2025-01-06T00:00:00+00:00[UTC]');
      expect(result[1]!.toString()).toBe('2025-01-07T00:00:00+00:00[UTC]');
      expect(result[2]!.toString()).toBe('2025-01-08T00:00:00+00:00[UTC]');
      expect(result[3]!.toString()).toBe('2025-01-09T00:00:00+00:00[UTC]');
      expect(result[4]!.toString()).toBe('2025-01-10T00:00:00+00:00[UTC]');
    });

    it('returns array at start of day (midnight)', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-06T15:30:45Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-01-08T08:15:00Z[UTC]');

      const result = eachDayOfInterval({ start, end });

      for (const day of result) {
        expect(day.hour).toBe(0);
        expect(day.minute).toBe(0);
        expect(day.second).toBe(0);
        expect(day.millisecond).toBe(0);
        expect(day.microsecond).toBe(0);
        expect(day.nanosecond).toBe(0);
      }
    });

    it('preserves timezone from start', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-06T10:00:00-05:00[America/New_York]');
      const end = Temporal.ZonedDateTime.from('2025-01-08T14:00:00-05:00[America/New_York]');

      const result = eachDayOfInterval({ start, end });

      expect(result).toHaveLength(3);
      expect(result[0]!.timeZoneId).toBe('America/New_York');
      expect(result[1]!.timeZoneId).toBe('America/New_York');
      expect(result[2]!.timeZoneId).toBe('America/New_York');
    });

    it('handles single day interval', () => {
      const date = Temporal.ZonedDateTime.from('2025-01-15T12:00:00Z[UTC]');

      const result = eachDayOfInterval({ start: date, end: date });

      expect(result).toHaveLength(1);
      expect(result[0]!.toString()).toBe('2025-01-15T00:00:00+00:00[UTC]');
    });

    it('uses start timezone when end has different timezone', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-06T10:00:00-05:00[America/New_York]');
      const end = Temporal.ZonedDateTime.from('2025-01-08T10:00:00+09:00[Asia/Tokyo]');

      const result = eachDayOfInterval({ start, end });

      for (const day of result) {
        expect(day.timeZoneId).toBe('America/New_York');
      }
    });
  });

  describe('with Instant', () => {
    it('returns days in UTC', () => {
      const start = Temporal.Instant.from('2025-01-06T00:00:00Z');
      const end = Temporal.Instant.from('2025-01-08T00:00:00Z');

      const result = eachDayOfInterval({ start, end });

      expect(result).toHaveLength(3);
      expect(result[0]!.timeZoneId).toBe('UTC');
      expect(result[1]!.timeZoneId).toBe('UTC');
      expect(result[2]!.timeZoneId).toBe('UTC');
    });

    it('handles instants at various times of day', () => {
      const start = Temporal.Instant.from('2025-01-06T23:59:59Z');
      const end = Temporal.Instant.from('2025-01-08T00:00:01Z');

      const result = eachDayOfInterval({ start, end });

      expect(result).toHaveLength(3);
      expect(result[0]!.toPlainDate().toString()).toBe('2025-01-06');
      expect(result[1]!.toPlainDate().toString()).toBe('2025-01-07');
      expect(result[2]!.toPlainDate().toString()).toBe('2025-01-08');
    });
  });

  describe('with mixed types', () => {
    it('handles ZonedDateTime start with Instant end', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-06T10:00:00-05:00[America/New_York]');
      const end = Temporal.Instant.from('2025-01-08T15:00:00Z');

      const result = eachDayOfInterval({ start, end });

      expect(result.length).toBeGreaterThan(0);
      for (const day of result) {
        expect(day.timeZoneId).toBe('America/New_York');
      }
    });

    it('handles Instant start with ZonedDateTime end', () => {
      const start = Temporal.Instant.from('2025-01-06T00:00:00Z');
      const end = Temporal.ZonedDateTime.from('2025-01-08T10:00:00-05:00[America/New_York]');

      const result = eachDayOfInterval({ start, end });

      expect(result.length).toBeGreaterThan(0);
      for (const day of result) {
        expect(day.timeZoneId).toBe('UTC');
      }
    });
  });

  describe('edge cases', () => {
    it('returns empty array when end is before start', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-10T00:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-01-06T00:00:00Z[UTC]');

      const result = eachDayOfInterval({ start, end });

      expect(result).toHaveLength(0);
    });

    it('handles month boundary', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-30T00:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-02-02T00:00:00Z[UTC]');

      const result = eachDayOfInterval({ start, end });

      expect(result).toHaveLength(4);
      expect(result[0]!.toPlainDate().toString()).toBe('2025-01-30');
      expect(result[1]!.toPlainDate().toString()).toBe('2025-01-31');
      expect(result[2]!.toPlainDate().toString()).toBe('2025-02-01');
      expect(result[3]!.toPlainDate().toString()).toBe('2025-02-02');
    });

    it('handles year boundary', () => {
      const start = Temporal.ZonedDateTime.from('2024-12-30T00:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-01-02T00:00:00Z[UTC]');

      const result = eachDayOfInterval({ start, end });

      expect(result).toHaveLength(4);
      expect(result[0]!.toPlainDate().toString()).toBe('2024-12-30');
      expect(result[1]!.toPlainDate().toString()).toBe('2024-12-31');
      expect(result[2]!.toPlainDate().toString()).toBe('2025-01-01');
      expect(result[3]!.toPlainDate().toString()).toBe('2025-01-02');
    });

    it('handles leap year February', () => {
      const start = Temporal.ZonedDateTime.from('2024-02-27T00:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2024-03-02T00:00:00Z[UTC]');

      const result = eachDayOfInterval({ start, end });

      expect(result).toHaveLength(5);
      expect(result[0]!.toPlainDate().toString()).toBe('2024-02-27');
      expect(result[1]!.toPlainDate().toString()).toBe('2024-02-28');
      expect(result[2]!.toPlainDate().toString()).toBe('2024-02-29');
      expect(result[3]!.toPlainDate().toString()).toBe('2024-03-01');
      expect(result[4]!.toPlainDate().toString()).toBe('2024-03-02');
    });

    it('handles DST spring forward', () => {
      // March 9, 2025: DST begins in New York (2 AM -> 3 AM)
      const start = Temporal.ZonedDateTime.from('2025-03-08T10:00:00-05:00[America/New_York]');
      const end = Temporal.ZonedDateTime.from('2025-03-10T10:00:00-04:00[America/New_York]');

      const result = eachDayOfInterval({ start, end });

      expect(result).toHaveLength(3);
      expect(result[0]!.toPlainDate().toString()).toBe('2025-03-08');
      expect(result[1]!.toPlainDate().toString()).toBe('2025-03-09');
      expect(result[2]!.toPlainDate().toString()).toBe('2025-03-10');
      // All should be at midnight in their respective offsets
      expect(result[0]!.hour).toBe(0);
      expect(result[1]!.hour).toBe(0);
      expect(result[2]!.hour).toBe(0);
    });

    it('handles DST fall back', () => {
      // November 2, 2025: DST ends in New York (2 AM -> 1 AM)
      const start = Temporal.ZonedDateTime.from('2025-11-01T10:00:00-04:00[America/New_York]');
      const end = Temporal.ZonedDateTime.from('2025-11-03T10:00:00-05:00[America/New_York]');

      const result = eachDayOfInterval({ start, end });

      expect(result).toHaveLength(3);
      expect(result[0]!.toPlainDate().toString()).toBe('2025-11-01');
      expect(result[1]!.toPlainDate().toString()).toBe('2025-11-02');
      expect(result[2]!.toPlainDate().toString()).toBe('2025-11-03');
    });

    it('handles dates far in the past', () => {
      const start = Temporal.ZonedDateTime.from('1900-01-01T00:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('1900-01-03T00:00:00Z[UTC]');

      const result = eachDayOfInterval({ start, end });

      expect(result).toHaveLength(3);
    });

    it('handles dates far in the future', () => {
      const start = Temporal.ZonedDateTime.from('2100-01-01T00:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2100-01-03T00:00:00Z[UTC]');

      const result = eachDayOfInterval({ start, end });

      expect(result).toHaveLength(3);
    });

    it('handles large intervals', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-01T00:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-12-31T00:00:00Z[UTC]');

      const result = eachDayOfInterval({ start, end });

      expect(result).toHaveLength(365);
    });
  });
});
