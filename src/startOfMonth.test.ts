import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { startOfMonth } from './startOfMonth';

describe('startOfMonth', () => {
  describe('from Temporal.Instant', () => {
    it('returns start of month in UTC', () => {
      // Jan 15, 2025
      const instant = Temporal.Instant.from('2025-01-15T12:00:00Z');
      const start = startOfMonth(instant);

      expect(start).toBeInstanceOf(Temporal.ZonedDateTime);
      expect(start.year).toBe(2025);
      expect(start.month).toBe(1);
      expect(start.day).toBe(1);
      expect(start.hour).toBe(0);
      expect(start.minute).toBe(0);
      expect(start.second).toBe(0);
      expect(start.millisecond).toBe(0);
      expect(start.microsecond).toBe(0);
      expect(start.nanosecond).toBe(0);
      expect(start.timeZoneId).toBe('UTC');
    });

    it('returns same day if already first of month', () => {
      // Jan 1, 2025 at noon
      const instant = Temporal.Instant.from('2025-01-01T12:00:00Z');
      const start = startOfMonth(instant);

      expect(start.day).toBe(1);
      expect(start.hour).toBe(0); // But at midnight
    });

    it('handles last day of month', () => {
      // Jan 31, 2025
      const instant = Temporal.Instant.from('2025-01-31T12:00:00Z');
      const start = startOfMonth(instant);

      expect(start.day).toBe(1);
      expect(start.month).toBe(1);
      expect(start.hour).toBe(0);
    });

    it('handles instant at different times', () => {
      const morning = Temporal.Instant.from('2025-01-15T08:00:00Z');
      const afternoon = Temporal.Instant.from('2025-01-15T16:30:45Z');
      const evening = Temporal.Instant.from('2025-01-15T23:00:00Z');

      const startMorning = startOfMonth(morning);
      const startAfternoon = startOfMonth(afternoon);
      const startEvening = startOfMonth(evening);

      // All should return the same start of month (Jan 1)
      expect(startMorning.toString()).toBe(startAfternoon.toString());
      expect(startMorning.toString()).toBe(startEvening.toString());
      expect(startMorning.day).toBe(1);
    });

    it('handles each month of the year', () => {
      const months = [
        { month: 1, days: 31 },
        { month: 2, days: 28 }, // Non-leap year
        { month: 3, days: 31 },
        { month: 4, days: 30 },
        { month: 5, days: 31 },
        { month: 6, days: 30 },
        { month: 7, days: 31 },
        { month: 8, days: 31 },
        { month: 9, days: 30 },
        { month: 10, days: 31 },
        { month: 11, days: 30 },
        { month: 12, days: 31 },
      ];

      for (const { month, days } of months) {
        const monthStr = month.toString().padStart(2, '0');
        const instant = Temporal.Instant.from(`2025-${monthStr}-15T12:00:00Z`);
        const start = startOfMonth(instant);

        expect(start.month).toBe(month);
        expect(start.day).toBe(1);
        expect(start.hour).toBe(0);
      }
    });
  });

  describe('from Temporal.ZonedDateTime', () => {
    it('returns start of month in same timezone', () => {
      // Jan 15, 2025
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-15T15:30:00-05:00[America/New_York]'
      );
      const start = startOfMonth(zoned);

      expect(start.year).toBe(2025);
      expect(start.month).toBe(1);
      expect(start.day).toBe(1);
      expect(start.hour).toBe(0);
      expect(start.minute).toBe(0);
      expect(start.second).toBe(0);
      expect(start.millisecond).toBe(0);
      expect(start.microsecond).toBe(0);
      expect(start.nanosecond).toBe(0);
      expect(start.timeZoneId).toBe('America/New_York');
    });

    it('returns same day if already first of month', () => {
      // Jan 1, 2025
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-01T15:30:00-05:00[America/New_York]'
      );
      const start = startOfMonth(zoned);

      expect(start.day).toBe(1);
      expect(start.hour).toBe(0);
    });

    it('handles different timezones', () => {
      // Jan 15 in Tokyo and NY
      const tokyo = Temporal.ZonedDateTime.from(
        '2025-01-15T15:00:00+09:00[Asia/Tokyo]'
      );
      const ny = Temporal.ZonedDateTime.from(
        '2025-01-15T15:00:00-05:00[America/New_York]'
      );

      const startTokyo = startOfMonth(tokyo);
      const startNY = startOfMonth(ny);

      // Both should be Jan 1 in their respective timezones
      expect(startTokyo.timeZoneId).toBe('Asia/Tokyo');
      expect(startTokyo.day).toBe(1);
      expect(startTokyo.hour).toBe(0);

      expect(startNY.timeZoneId).toBe('America/New_York');
      expect(startNY.day).toBe(1);
      expect(startNY.hour).toBe(0);

      // Different timezones = different instants
      expect(startTokyo.toInstant().toString()).not.toBe(
        startNY.toInstant().toString()
      );
    });

    it('converts to different timezone explicitly', () => {
      const instant = Temporal.Instant.from('2025-01-15T12:00:00Z');
      const nyTime = instant.toZonedDateTimeISO('America/New_York');
      const start = startOfMonth(nyTime);

      expect(start.timeZoneId).toBe('America/New_York');
      expect(start.day).toBe(1);
      expect(start.hour).toBe(0);
    });
  });

  describe('month boundaries', () => {
    it('handles 31-day month (January)', () => {
      const instant = Temporal.Instant.from('2025-01-31T12:00:00Z');
      const start = startOfMonth(instant);

      expect(start.day).toBe(1);
      expect(start.month).toBe(1);
    });

    it('handles 30-day month (April)', () => {
      const instant = Temporal.Instant.from('2025-04-30T12:00:00Z');
      const start = startOfMonth(instant);

      expect(start.day).toBe(1);
      expect(start.month).toBe(4);
    });

    it('handles 28-day month (February non-leap)', () => {
      const instant = Temporal.Instant.from('2025-02-28T12:00:00Z');
      const start = startOfMonth(instant);

      expect(start.day).toBe(1);
      expect(start.month).toBe(2);
      expect(start.year).toBe(2025);
    });

    it('handles 29-day month (February leap year)', () => {
      const instant = Temporal.Instant.from('2024-02-29T12:00:00Z');
      const start = startOfMonth(instant);

      expect(start.day).toBe(1);
      expect(start.month).toBe(2);
      expect(start.year).toBe(2024);
    });
  });

  describe('DST transitions', () => {
    it('handles DST transition on first day of month', () => {
      // March 1, 2025 in New York (no DST transition on this day, but close)
      const zoned = Temporal.ZonedDateTime.from(
        '2025-03-15T15:00:00-04:00[America/New_York]'
      );
      const start = startOfMonth(zoned);

      expect(start.day).toBe(1);
      expect(start.month).toBe(3);
      expect(start.hour).toBe(0);
    });

    it('handles fall DST transition month', () => {
      // November 15, 2025: DST ends Nov 2 in New York
      const zoned = Temporal.ZonedDateTime.from(
        '2025-11-15T15:00:00-05:00[America/New_York]'
      );
      const start = startOfMonth(zoned);

      expect(start.day).toBe(1);
      expect(start.month).toBe(11);
      expect(start.hour).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('handles start of year (January 1)', () => {
      const instant = Temporal.Instant.from('2025-01-01T12:00:00Z');
      const start = startOfMonth(instant);

      expect(start.year).toBe(2025);
      expect(start.month).toBe(1);
      expect(start.day).toBe(1);
      expect(start.hour).toBe(0);
    });

    it('handles end of year (December)', () => {
      const instant = Temporal.Instant.from('2025-12-31T23:59:59Z');
      const start = startOfMonth(instant);

      expect(start.year).toBe(2025);
      expect(start.month).toBe(12);
      expect(start.day).toBe(1);
      expect(start.hour).toBe(0);
    });

    it('handles leap year February 29', () => {
      // February 29, 2024
      const instant = Temporal.Instant.from('2024-02-29T12:00:00Z');
      const start = startOfMonth(instant);

      expect(start.year).toBe(2024);
      expect(start.month).toBe(2);
      expect(start.day).toBe(1);
    });

    it('handles century year (not leap)', () => {
      // February 2100 (not a leap year - divisible by 100 but not 400)
      const instant = Temporal.Instant.from('2100-02-15T12:00:00Z');
      const start = startOfMonth(instant);

      expect(start.year).toBe(2100);
      expect(start.month).toBe(2);
      expect(start.day).toBe(1);
    });
  });
});
