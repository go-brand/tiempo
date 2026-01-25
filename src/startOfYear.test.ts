import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { startOfYear } from './startOfYear';

describe('startOfYear', () => {
  describe('from Temporal.Instant', () => {
    it('returns start of year in UTC', () => {
      // June 15, 2025
      const instant = Temporal.Instant.from('2025-06-15T12:00:00Z');
      const start = startOfYear(instant);

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

    it('returns same day if already January 1st', () => {
      // Jan 1, 2025 at noon
      const instant = Temporal.Instant.from('2025-01-01T12:00:00Z');
      const start = startOfYear(instant);

      expect(start.month).toBe(1);
      expect(start.day).toBe(1);
      expect(start.hour).toBe(0); // But at midnight
    });

    it('handles last day of year', () => {
      // Dec 31, 2025
      const instant = Temporal.Instant.from('2025-12-31T12:00:00Z');
      const start = startOfYear(instant);

      expect(start.year).toBe(2025);
      expect(start.month).toBe(1);
      expect(start.day).toBe(1);
      expect(start.hour).toBe(0);
    });

    it('handles instant at different times', () => {
      const morning = Temporal.Instant.from('2025-06-15T08:00:00Z');
      const afternoon = Temporal.Instant.from('2025-06-15T16:30:45Z');
      const evening = Temporal.Instant.from('2025-06-15T23:00:00Z');

      const startMorning = startOfYear(morning);
      const startAfternoon = startOfYear(afternoon);
      const startEvening = startOfYear(evening);

      // All should return the same start of year (Jan 1)
      expect(startMorning.toString()).toBe(startAfternoon.toString());
      expect(startMorning.toString()).toBe(startEvening.toString());
      expect(startMorning.month).toBe(1);
      expect(startMorning.day).toBe(1);
    });

    it('handles each month of the year', () => {
      for (let month = 1; month <= 12; month++) {
        const monthStr = month.toString().padStart(2, '0');
        const instant = Temporal.Instant.from(`2025-${monthStr}-15T12:00:00Z`);
        const start = startOfYear(instant);

        expect(start.year).toBe(2025);
        expect(start.month).toBe(1);
        expect(start.day).toBe(1);
        expect(start.hour).toBe(0);
      }
    });
  });

  describe('from Temporal.ZonedDateTime', () => {
    it('returns start of year in same timezone', () => {
      // June 15, 2025 (EDT)
      const zoned = Temporal.ZonedDateTime.from(
        '2025-06-15T15:30:00-04:00[America/New_York]'
      );
      const start = startOfYear(zoned);

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

    it('returns same day if already January 1st', () => {
      // Jan 1, 2025
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-01T15:30:00-05:00[America/New_York]'
      );
      const start = startOfYear(zoned);

      expect(start.month).toBe(1);
      expect(start.day).toBe(1);
      expect(start.hour).toBe(0);
    });

    it('handles different timezones', () => {
      // June 15 in Tokyo and NY (EDT)
      const tokyo = Temporal.ZonedDateTime.from(
        '2025-06-15T15:00:00+09:00[Asia/Tokyo]'
      );
      const ny = Temporal.ZonedDateTime.from(
        '2025-06-15T15:00:00-04:00[America/New_York]'
      );

      const startTokyo = startOfYear(tokyo);
      const startNY = startOfYear(ny);

      // Both should be Jan 1 in their respective timezones
      expect(startTokyo.timeZoneId).toBe('Asia/Tokyo');
      expect(startTokyo.month).toBe(1);
      expect(startTokyo.day).toBe(1);
      expect(startTokyo.hour).toBe(0);

      expect(startNY.timeZoneId).toBe('America/New_York');
      expect(startNY.month).toBe(1);
      expect(startNY.day).toBe(1);
      expect(startNY.hour).toBe(0);

      // Different timezones = different instants
      expect(startTokyo.toInstant().toString()).not.toBe(
        startNY.toInstant().toString()
      );
    });

    it('converts to different timezone explicitly', () => {
      const instant = Temporal.Instant.from('2025-06-15T12:00:00Z');
      const nyTime = instant.toZonedDateTimeISO('America/New_York');
      const start = startOfYear(nyTime);

      expect(start.timeZoneId).toBe('America/New_York');
      expect(start.month).toBe(1);
      expect(start.day).toBe(1);
      expect(start.hour).toBe(0);
    });
  });

  describe('year boundaries', () => {
    it('handles first day of year (January 1)', () => {
      const instant = Temporal.Instant.from('2025-01-01T00:00:00Z');
      const start = startOfYear(instant);

      expect(start.year).toBe(2025);
      expect(start.month).toBe(1);
      expect(start.day).toBe(1);
      expect(start.hour).toBe(0);
    });

    it('handles last day of year (December 31)', () => {
      const instant = Temporal.Instant.from('2025-12-31T23:59:59Z');
      const start = startOfYear(instant);

      expect(start.year).toBe(2025);
      expect(start.month).toBe(1);
      expect(start.day).toBe(1);
      expect(start.hour).toBe(0);
    });

    it('handles leap year', () => {
      const instant = Temporal.Instant.from('2024-02-29T12:00:00Z');
      const start = startOfYear(instant);

      expect(start.year).toBe(2024);
      expect(start.month).toBe(1);
      expect(start.day).toBe(1);
    });

    it('handles non-leap year', () => {
      const instant = Temporal.Instant.from('2025-02-28T12:00:00Z');
      const start = startOfYear(instant);

      expect(start.year).toBe(2025);
      expect(start.month).toBe(1);
      expect(start.day).toBe(1);
    });
  });

  describe('DST transitions', () => {
    it('handles year containing DST transitions', () => {
      // Summer 2025 in New York (after DST transition)
      const zoned = Temporal.ZonedDateTime.from(
        '2025-07-15T15:00:00-04:00[America/New_York]'
      );
      const start = startOfYear(zoned);

      expect(start.year).toBe(2025);
      expect(start.month).toBe(1);
      expect(start.day).toBe(1);
      expect(start.hour).toBe(0);
    });

    it('handles January 1st DST offset', () => {
      // Jan 1 in New York (EST, not EDT)
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-01T12:00:00-05:00[America/New_York]'
      );
      const start = startOfYear(zoned);

      expect(start.month).toBe(1);
      expect(start.day).toBe(1);
      expect(start.hour).toBe(0);
      expect(start.offset).toBe('-05:00'); // EST
    });
  });

  describe('from Temporal.PlainDate', () => {
    it('returns start of year in specified timezone', () => {
      const date = Temporal.PlainDate.from('2025-06-15');
      const start = startOfYear(date, 'America/New_York');

      expect(start).toBeInstanceOf(Temporal.ZonedDateTime);
      expect(start.year).toBe(2025);
      expect(start.month).toBe(1);
      expect(start.day).toBe(1);
      expect(start.hour).toBe(0);
      expect(start.minute).toBe(0);
      expect(start.second).toBe(0);
      expect(start.timeZoneId).toBe('America/New_York');
    });

    it('same PlainDate produces different instants for different timezones', () => {
      const date = Temporal.PlainDate.from('2025-06-15');
      const startTokyo = startOfYear(date, 'Asia/Tokyo');
      const startNY = startOfYear(date, 'America/New_York');

      // Same calendar date, both return Jan 1
      expect(startTokyo.month).toBe(1);
      expect(startTokyo.day).toBe(1);
      expect(startNY.month).toBe(1);
      expect(startNY.day).toBe(1);

      // But different instants
      expect(startTokyo.toInstant().toString()).not.toBe(
        startNY.toInstant().toString()
      );
    });

    it('handles leap year', () => {
      const date = Temporal.PlainDate.from('2024-02-29');
      const start = startOfYear(date, 'UTC');

      expect(start.year).toBe(2024);
      expect(start.month).toBe(1);
      expect(start.day).toBe(1);
    });
  });

  describe('edge cases', () => {
    it('handles century year (not leap)', () => {
      // 2100 is not a leap year (divisible by 100 but not 400)
      const instant = Temporal.Instant.from('2100-06-15T12:00:00Z');
      const start = startOfYear(instant);

      expect(start.year).toBe(2100);
      expect(start.month).toBe(1);
      expect(start.day).toBe(1);
    });

    it('handles year 2000 (is leap)', () => {
      // 2000 is a leap year (divisible by 400)
      const instant = Temporal.Instant.from('2000-06-15T12:00:00Z');
      const start = startOfYear(instant);

      expect(start.year).toBe(2000);
      expect(start.month).toBe(1);
      expect(start.day).toBe(1);
    });

    it('handles different years consistently', () => {
      const years = [2020, 2021, 2022, 2023, 2024, 2025];

      for (const year of years) {
        const instant = Temporal.Instant.from(`${year}-06-15T12:00:00Z`);
        const start = startOfYear(instant);

        expect(start.year).toBe(year);
        expect(start.month).toBe(1);
        expect(start.day).toBe(1);
        expect(start.hour).toBe(0);
      }
    });
  });
});
