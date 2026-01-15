import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { endOfMonth } from './endOfMonth';

describe('endOfMonth', () => {
  describe('from Temporal.Instant', () => {
    it('returns end of month in UTC', () => {
      // Jan 15, 2025
      const instant = Temporal.Instant.from('2025-01-15T12:00:00Z');
      const end = endOfMonth(instant);

      expect(end).toBeInstanceOf(Temporal.ZonedDateTime);
      expect(end.year).toBe(2025);
      expect(end.month).toBe(1);
      expect(end.day).toBe(31);
      expect(end.hour).toBe(23);
      expect(end.minute).toBe(59);
      expect(end.second).toBe(59);
      expect(end.millisecond).toBe(999);
      expect(end.microsecond).toBe(999);
      expect(end.nanosecond).toBe(999);
      expect(end.timeZoneId).toBe('UTC');
    });

    it('returns same day if already last of month', () => {
      // Jan 31, 2025 at noon
      const instant = Temporal.Instant.from('2025-01-31T12:00:00Z');
      const end = endOfMonth(instant);

      expect(end.day).toBe(31);
      expect(end.hour).toBe(23); // But at 23:59:59.999999999
      expect(end.minute).toBe(59);
      expect(end.second).toBe(59);
    });

    it('handles first day of month', () => {
      // Jan 1, 2025
      const instant = Temporal.Instant.from('2025-01-01T12:00:00Z');
      const end = endOfMonth(instant);

      expect(end.day).toBe(31);
      expect(end.month).toBe(1);
      expect(end.hour).toBe(23);
    });

    it('handles instant at different times', () => {
      const morning = Temporal.Instant.from('2025-01-15T08:00:00Z');
      const afternoon = Temporal.Instant.from('2025-01-15T16:30:45Z');
      const evening = Temporal.Instant.from('2025-01-15T23:00:00Z');

      const endMorning = endOfMonth(morning);
      const endAfternoon = endOfMonth(afternoon);
      const endEvening = endOfMonth(evening);

      // All should return the same end of month (Jan 31)
      expect(endMorning.toString()).toBe(endAfternoon.toString());
      expect(endMorning.toString()).toBe(endEvening.toString());
      expect(endMorning.day).toBe(31);
    });

    it('handles each month of the year', () => {
      const months = [
        { month: 1, lastDay: 31 },
        { month: 2, lastDay: 28 }, // Non-leap year 2025
        { month: 3, lastDay: 31 },
        { month: 4, lastDay: 30 },
        { month: 5, lastDay: 31 },
        { month: 6, lastDay: 30 },
        { month: 7, lastDay: 31 },
        { month: 8, lastDay: 31 },
        { month: 9, lastDay: 30 },
        { month: 10, lastDay: 31 },
        { month: 11, lastDay: 30 },
        { month: 12, lastDay: 31 },
      ];

      for (const { month, lastDay } of months) {
        const monthStr = month.toString().padStart(2, '0');
        const instant = Temporal.Instant.from(`2025-${monthStr}-15T12:00:00Z`);
        const end = endOfMonth(instant);

        expect(end.month).toBe(month);
        expect(end.day).toBe(lastDay);
        expect(end.hour).toBe(23);
        expect(end.minute).toBe(59);
        expect(end.second).toBe(59);
      }
    });
  });

  describe('from Temporal.ZonedDateTime', () => {
    it('returns end of month in same timezone', () => {
      // Jan 15, 2025
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-15T15:30:00-05:00[America/New_York]'
      );
      const end = endOfMonth(zoned);

      expect(end.year).toBe(2025);
      expect(end.month).toBe(1);
      expect(end.day).toBe(31);
      expect(end.hour).toBe(23);
      expect(end.minute).toBe(59);
      expect(end.second).toBe(59);
      expect(end.millisecond).toBe(999);
      expect(end.microsecond).toBe(999);
      expect(end.nanosecond).toBe(999);
      expect(end.timeZoneId).toBe('America/New_York');
    });

    it('returns same day if already last of month', () => {
      // Jan 31, 2025
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-31T15:30:00-05:00[America/New_York]'
      );
      const end = endOfMonth(zoned);

      expect(end.day).toBe(31);
      expect(end.hour).toBe(23);
    });

    it('handles different timezones', () => {
      // Jan 15 in Tokyo and NY
      const tokyo = Temporal.ZonedDateTime.from(
        '2025-01-15T15:00:00+09:00[Asia/Tokyo]'
      );
      const ny = Temporal.ZonedDateTime.from(
        '2025-01-15T15:00:00-05:00[America/New_York]'
      );

      const endTokyo = endOfMonth(tokyo);
      const endNY = endOfMonth(ny);

      // Both should be Jan 31 in their respective timezones
      expect(endTokyo.timeZoneId).toBe('Asia/Tokyo');
      expect(endTokyo.day).toBe(31);
      expect(endTokyo.hour).toBe(23);

      expect(endNY.timeZoneId).toBe('America/New_York');
      expect(endNY.day).toBe(31);
      expect(endNY.hour).toBe(23);

      // Different timezones = different instants
      expect(endTokyo.toInstant().toString()).not.toBe(
        endNY.toInstant().toString()
      );
    });

    it('converts to different timezone explicitly', () => {
      const instant = Temporal.Instant.from('2025-01-15T12:00:00Z');
      const nyTime = instant.toZonedDateTimeISO('America/New_York');
      const end = endOfMonth(nyTime);

      expect(end.timeZoneId).toBe('America/New_York');
      expect(end.day).toBe(31);
      expect(end.hour).toBe(23);
    });
  });

  describe('month boundaries', () => {
    it('handles 31-day month (January)', () => {
      const instant = Temporal.Instant.from('2025-01-01T12:00:00Z');
      const end = endOfMonth(instant);

      expect(end.day).toBe(31);
      expect(end.month).toBe(1);
    });

    it('handles 30-day month (April)', () => {
      const instant = Temporal.Instant.from('2025-04-01T12:00:00Z');
      const end = endOfMonth(instant);

      expect(end.day).toBe(30);
      expect(end.month).toBe(4);
    });

    it('handles 28-day month (February non-leap)', () => {
      const instant = Temporal.Instant.from('2025-02-01T12:00:00Z');
      const end = endOfMonth(instant);

      expect(end.day).toBe(28);
      expect(end.month).toBe(2);
      expect(end.year).toBe(2025);
    });

    it('handles 29-day month (February leap year)', () => {
      const instant = Temporal.Instant.from('2024-02-01T12:00:00Z');
      const end = endOfMonth(instant);

      expect(end.day).toBe(29);
      expect(end.month).toBe(2);
      expect(end.year).toBe(2024);
    });
  });

  describe('DST transitions', () => {
    it('handles DST transition on last day of month', () => {
      // March 2025 in New York (DST begins March 9)
      const zoned = Temporal.ZonedDateTime.from(
        '2025-03-15T15:00:00-04:00[America/New_York]'
      );
      const end = endOfMonth(zoned);

      expect(end.day).toBe(31);
      expect(end.month).toBe(3);
      expect(end.hour).toBe(23);
    });

    it('handles fall DST transition month', () => {
      // November 2025: DST ends Nov 2 in New York
      const zoned = Temporal.ZonedDateTime.from(
        '2025-11-15T15:00:00-05:00[America/New_York]'
      );
      const end = endOfMonth(zoned);

      expect(end.day).toBe(30);
      expect(end.month).toBe(11);
      expect(end.hour).toBe(23);
    });
  });

  describe('edge cases', () => {
    it('handles start of year (January)', () => {
      const instant = Temporal.Instant.from('2025-01-01T12:00:00Z');
      const end = endOfMonth(instant);

      expect(end.year).toBe(2025);
      expect(end.month).toBe(1);
      expect(end.day).toBe(31);
      expect(end.hour).toBe(23);
    });

    it('handles end of year (December)', () => {
      const instant = Temporal.Instant.from('2025-12-01T12:00:00Z');
      const end = endOfMonth(instant);

      expect(end.year).toBe(2025);
      expect(end.month).toBe(12);
      expect(end.day).toBe(31);
      expect(end.hour).toBe(23);
    });

    it('handles leap year February 29', () => {
      // February 2024
      const instant = Temporal.Instant.from('2024-02-01T12:00:00Z');
      const end = endOfMonth(instant);

      expect(end.year).toBe(2024);
      expect(end.month).toBe(2);
      expect(end.day).toBe(29);
    });

    it('handles century year (not leap)', () => {
      // February 2100 (not a leap year - divisible by 100 but not 400)
      const instant = Temporal.Instant.from('2100-02-15T12:00:00Z');
      const end = endOfMonth(instant);

      expect(end.year).toBe(2100);
      expect(end.month).toBe(2);
      expect(end.day).toBe(28); // Not 29
    });

    it('handles nanosecond precision', () => {
      const instant = Temporal.Instant.from('2025-01-15T12:00:00Z');
      const end = endOfMonth(instant);

      expect(end.nanosecond).toBe(999);
      expect(end.microsecond).toBe(999);
      expect(end.millisecond).toBe(999);
    });
  });
});
