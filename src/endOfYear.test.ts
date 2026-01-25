import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { endOfYear } from './endOfYear';

describe('endOfYear', () => {
  describe('from Temporal.Instant', () => {
    it('returns end of year in UTC', () => {
      // June 15, 2025
      const instant = Temporal.Instant.from('2025-06-15T12:00:00Z');
      const end = endOfYear(instant);

      expect(end).toBeInstanceOf(Temporal.ZonedDateTime);
      expect(end.year).toBe(2025);
      expect(end.month).toBe(12);
      expect(end.day).toBe(31);
      expect(end.hour).toBe(23);
      expect(end.minute).toBe(59);
      expect(end.second).toBe(59);
      expect(end.millisecond).toBe(999);
      expect(end.microsecond).toBe(999);
      expect(end.nanosecond).toBe(999);
      expect(end.timeZoneId).toBe('UTC');
    });

    it('returns same day if already December 31st', () => {
      // Dec 31, 2025 at noon
      const instant = Temporal.Instant.from('2025-12-31T12:00:00Z');
      const end = endOfYear(instant);

      expect(end.month).toBe(12);
      expect(end.day).toBe(31);
      expect(end.hour).toBe(23); // But at 23:59:59.999999999
      expect(end.minute).toBe(59);
      expect(end.second).toBe(59);
    });

    it('handles first day of year', () => {
      // Jan 1, 2025
      const instant = Temporal.Instant.from('2025-01-01T12:00:00Z');
      const end = endOfYear(instant);

      expect(end.year).toBe(2025);
      expect(end.month).toBe(12);
      expect(end.day).toBe(31);
      expect(end.hour).toBe(23);
    });

    it('handles instant at different times', () => {
      const morning = Temporal.Instant.from('2025-06-15T08:00:00Z');
      const afternoon = Temporal.Instant.from('2025-06-15T16:30:45Z');
      const evening = Temporal.Instant.from('2025-06-15T23:00:00Z');

      const endMorning = endOfYear(morning);
      const endAfternoon = endOfYear(afternoon);
      const endEvening = endOfYear(evening);

      // All should return the same end of year (Dec 31)
      expect(endMorning.toString()).toBe(endAfternoon.toString());
      expect(endMorning.toString()).toBe(endEvening.toString());
      expect(endMorning.month).toBe(12);
      expect(endMorning.day).toBe(31);
    });

    it('handles each month of the year', () => {
      for (let month = 1; month <= 12; month++) {
        const monthStr = month.toString().padStart(2, '0');
        const instant = Temporal.Instant.from(`2025-${monthStr}-15T12:00:00Z`);
        const end = endOfYear(instant);

        expect(end.year).toBe(2025);
        expect(end.month).toBe(12);
        expect(end.day).toBe(31);
        expect(end.hour).toBe(23);
        expect(end.minute).toBe(59);
        expect(end.second).toBe(59);
      }
    });
  });

  describe('from Temporal.ZonedDateTime', () => {
    it('returns end of year in same timezone', () => {
      // June 15, 2025 (EDT)
      const zoned = Temporal.ZonedDateTime.from(
        '2025-06-15T15:30:00-04:00[America/New_York]'
      );
      const end = endOfYear(zoned);

      expect(end.year).toBe(2025);
      expect(end.month).toBe(12);
      expect(end.day).toBe(31);
      expect(end.hour).toBe(23);
      expect(end.minute).toBe(59);
      expect(end.second).toBe(59);
      expect(end.millisecond).toBe(999);
      expect(end.microsecond).toBe(999);
      expect(end.nanosecond).toBe(999);
      expect(end.timeZoneId).toBe('America/New_York');
    });

    it('returns same day if already December 31st', () => {
      // Dec 31, 2025
      const zoned = Temporal.ZonedDateTime.from(
        '2025-12-31T15:30:00-05:00[America/New_York]'
      );
      const end = endOfYear(zoned);

      expect(end.month).toBe(12);
      expect(end.day).toBe(31);
      expect(end.hour).toBe(23);
    });

    it('handles different timezones', () => {
      // June 15 in Tokyo and NY (EDT)
      const tokyo = Temporal.ZonedDateTime.from(
        '2025-06-15T15:00:00+09:00[Asia/Tokyo]'
      );
      const ny = Temporal.ZonedDateTime.from(
        '2025-06-15T15:00:00-04:00[America/New_York]'
      );

      const endTokyo = endOfYear(tokyo);
      const endNY = endOfYear(ny);

      // Both should be Dec 31 in their respective timezones
      expect(endTokyo.timeZoneId).toBe('Asia/Tokyo');
      expect(endTokyo.month).toBe(12);
      expect(endTokyo.day).toBe(31);
      expect(endTokyo.hour).toBe(23);

      expect(endNY.timeZoneId).toBe('America/New_York');
      expect(endNY.month).toBe(12);
      expect(endNY.day).toBe(31);
      expect(endNY.hour).toBe(23);

      // Different timezones = different instants
      expect(endTokyo.toInstant().toString()).not.toBe(
        endNY.toInstant().toString()
      );
    });

    it('converts to different timezone explicitly', () => {
      const instant = Temporal.Instant.from('2025-06-15T12:00:00Z');
      const nyTime = instant.toZonedDateTimeISO('America/New_York');
      const end = endOfYear(nyTime);

      expect(end.timeZoneId).toBe('America/New_York');
      expect(end.month).toBe(12);
      expect(end.day).toBe(31);
      expect(end.hour).toBe(23);
    });
  });

  describe('year boundaries', () => {
    it('handles first day of year (January 1)', () => {
      const instant = Temporal.Instant.from('2025-01-01T00:00:00Z');
      const end = endOfYear(instant);

      expect(end.year).toBe(2025);
      expect(end.month).toBe(12);
      expect(end.day).toBe(31);
      expect(end.hour).toBe(23);
    });

    it('handles last day of year (December 31)', () => {
      const instant = Temporal.Instant.from('2025-12-31T23:59:59Z');
      const end = endOfYear(instant);

      expect(end.year).toBe(2025);
      expect(end.month).toBe(12);
      expect(end.day).toBe(31);
      expect(end.hour).toBe(23);
    });

    it('handles leap year', () => {
      const instant = Temporal.Instant.from('2024-02-29T12:00:00Z');
      const end = endOfYear(instant);

      expect(end.year).toBe(2024);
      expect(end.month).toBe(12);
      expect(end.day).toBe(31);
    });

    it('handles non-leap year', () => {
      const instant = Temporal.Instant.from('2025-02-28T12:00:00Z');
      const end = endOfYear(instant);

      expect(end.year).toBe(2025);
      expect(end.month).toBe(12);
      expect(end.day).toBe(31);
    });
  });

  describe('DST transitions', () => {
    it('handles year containing DST transitions', () => {
      // Winter 2025 in New York (after DST ended)
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-15T15:00:00-05:00[America/New_York]'
      );
      const end = endOfYear(zoned);

      expect(end.year).toBe(2025);
      expect(end.month).toBe(12);
      expect(end.day).toBe(31);
      expect(end.hour).toBe(23);
    });

    it('handles December 31st DST offset', () => {
      // Dec 31 in New York (EST, not EDT)
      const zoned = Temporal.ZonedDateTime.from(
        '2025-06-15T12:00:00-04:00[America/New_York]'
      );
      const end = endOfYear(zoned);

      expect(end.month).toBe(12);
      expect(end.day).toBe(31);
      expect(end.hour).toBe(23);
      expect(end.offset).toBe('-05:00'); // EST in December
    });
  });

  describe('from Temporal.PlainDate', () => {
    it('returns end of year in specified timezone', () => {
      const date = Temporal.PlainDate.from('2025-06-15');
      const end = endOfYear(date, 'America/New_York');

      expect(end).toBeInstanceOf(Temporal.ZonedDateTime);
      expect(end.year).toBe(2025);
      expect(end.month).toBe(12);
      expect(end.day).toBe(31);
      expect(end.hour).toBe(23);
      expect(end.minute).toBe(59);
      expect(end.second).toBe(59);
      expect(end.millisecond).toBe(999);
      expect(end.timeZoneId).toBe('America/New_York');
    });

    it('same PlainDate produces different instants for different timezones', () => {
      const date = Temporal.PlainDate.from('2025-06-15');
      const endTokyo = endOfYear(date, 'Asia/Tokyo');
      const endNY = endOfYear(date, 'America/New_York');

      // Same calendar date, both return Dec 31
      expect(endTokyo.month).toBe(12);
      expect(endTokyo.day).toBe(31);
      expect(endNY.month).toBe(12);
      expect(endNY.day).toBe(31);

      // But different instants
      expect(endTokyo.toInstant().toString()).not.toBe(
        endNY.toInstant().toString()
      );
    });

    it('handles leap year', () => {
      const date = Temporal.PlainDate.from('2024-02-29');
      const end = endOfYear(date, 'UTC');

      expect(end.year).toBe(2024);
      expect(end.month).toBe(12);
      expect(end.day).toBe(31);
    });
  });

  describe('edge cases', () => {
    it('handles century year (not leap)', () => {
      // 2100 is not a leap year (divisible by 100 but not 400)
      const instant = Temporal.Instant.from('2100-06-15T12:00:00Z');
      const end = endOfYear(instant);

      expect(end.year).toBe(2100);
      expect(end.month).toBe(12);
      expect(end.day).toBe(31);
    });

    it('handles year 2000 (is leap)', () => {
      // 2000 is a leap year (divisible by 400)
      const instant = Temporal.Instant.from('2000-06-15T12:00:00Z');
      const end = endOfYear(instant);

      expect(end.year).toBe(2000);
      expect(end.month).toBe(12);
      expect(end.day).toBe(31);
    });

    it('handles different years consistently', () => {
      const years = [2020, 2021, 2022, 2023, 2024, 2025];

      for (const year of years) {
        const instant = Temporal.Instant.from(`${year}-06-15T12:00:00Z`);
        const end = endOfYear(instant);

        expect(end.year).toBe(year);
        expect(end.month).toBe(12);
        expect(end.day).toBe(31);
        expect(end.hour).toBe(23);
      }
    });

    it('handles nanosecond precision', () => {
      const instant = Temporal.Instant.from('2025-06-15T12:00:00Z');
      const end = endOfYear(instant);

      expect(end.nanosecond).toBe(999);
      expect(end.microsecond).toBe(999);
      expect(end.millisecond).toBe(999);
    });
  });
});
