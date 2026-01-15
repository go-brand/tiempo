import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { startOfWeek } from './startOfWeek';

describe('startOfWeek', () => {
  describe('from Temporal.Instant', () => {
    it('returns start of week in UTC', () => {
      // Wednesday Jan 22, 2025
      const instant = Temporal.Instant.from('2025-01-22T12:00:00Z');
      const start = startOfWeek(instant);

      expect(start).toBeInstanceOf(Temporal.ZonedDateTime);
      expect(start.year).toBe(2025);
      expect(start.month).toBe(1);
      expect(start.day).toBe(20); // Monday
      expect(start.hour).toBe(0);
      expect(start.minute).toBe(0);
      expect(start.second).toBe(0);
      expect(start.millisecond).toBe(0);
      expect(start.microsecond).toBe(0);
      expect(start.nanosecond).toBe(0);
      expect(start.timeZoneId).toBe('UTC');
      expect(start.dayOfWeek).toBe(1); // Monday
    });

    it('returns same day if already Monday', () => {
      // Monday Jan 20, 2025 at noon
      const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const start = startOfWeek(instant);

      expect(start.day).toBe(20); // Same Monday
      expect(start.hour).toBe(0); // But at midnight
      expect(start.dayOfWeek).toBe(1);
    });

    it('handles Sunday (last day of week)', () => {
      // Sunday Jan 26, 2025
      const instant = Temporal.Instant.from('2025-01-26T12:00:00Z');
      const start = startOfWeek(instant);

      expect(start.day).toBe(20); // Previous Monday
      expect(start.hour).toBe(0);
      expect(start.dayOfWeek).toBe(1);
    });

    it('handles each day of the week', () => {
      const days = [
        { date: '2025-01-20', name: 'Monday', dow: 1 },
        { date: '2025-01-21', name: 'Tuesday', dow: 2 },
        { date: '2025-01-22', name: 'Wednesday', dow: 3 },
        { date: '2025-01-23', name: 'Thursday', dow: 4 },
        { date: '2025-01-24', name: 'Friday', dow: 5 },
        { date: '2025-01-25', name: 'Saturday', dow: 6 },
        { date: '2025-01-26', name: 'Sunday', dow: 7 },
      ];

      for (const { date, name, dow } of days) {
        const instant = Temporal.Instant.from(`${date}T12:00:00Z`);
        const start = startOfWeek(instant);

        // All should return Monday Jan 20
        expect(start.day).toBe(20);
        expect(start.dayOfWeek).toBe(1);
        expect(start.hour).toBe(0);
      }
    });

    it('handles instant at different times', () => {
      const morning = Temporal.Instant.from('2025-01-22T08:00:00Z');
      const afternoon = Temporal.Instant.from('2025-01-22T16:30:45Z');
      const evening = Temporal.Instant.from('2025-01-22T23:00:00Z');

      const startMorning = startOfWeek(morning);
      const startAfternoon = startOfWeek(afternoon);
      const startEvening = startOfWeek(evening);

      // All should return the same start of week (Monday Jan 20)
      expect(startMorning.toString()).toBe(startAfternoon.toString());
      expect(startMorning.toString()).toBe(startEvening.toString());
      expect(startMorning.day).toBe(20);
      expect(startMorning.dayOfWeek).toBe(1);
    });
  });

  describe('from Temporal.ZonedDateTime', () => {
    it('returns start of week in same timezone', () => {
      // Wednesday Jan 22, 2025
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-22T15:30:00-05:00[America/New_York]'
      );
      const start = startOfWeek(zoned);

      expect(start.year).toBe(2025);
      expect(start.month).toBe(1);
      expect(start.day).toBe(20); // Monday
      expect(start.hour).toBe(0);
      expect(start.minute).toBe(0);
      expect(start.second).toBe(0);
      expect(start.millisecond).toBe(0);
      expect(start.microsecond).toBe(0);
      expect(start.nanosecond).toBe(0);
      expect(start.timeZoneId).toBe('America/New_York');
      expect(start.dayOfWeek).toBe(1);
    });

    it('returns same day if already Monday', () => {
      // Monday Jan 20, 2025
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T15:30:00-05:00[America/New_York]'
      );
      const start = startOfWeek(zoned);

      expect(start.day).toBe(20);
      expect(start.hour).toBe(0);
      expect(start.dayOfWeek).toBe(1);
    });

    it('handles different timezones', () => {
      // Wednesday in Tokyo and NY
      const tokyo = Temporal.ZonedDateTime.from(
        '2025-01-22T15:00:00+09:00[Asia/Tokyo]'
      );
      const ny = Temporal.ZonedDateTime.from(
        '2025-01-22T15:00:00-05:00[America/New_York]'
      );

      const startTokyo = startOfWeek(tokyo);
      const startNY = startOfWeek(ny);

      // Both should be Monday in their respective timezones
      expect(startTokyo.timeZoneId).toBe('Asia/Tokyo');
      expect(startTokyo.day).toBe(20);
      expect(startTokyo.dayOfWeek).toBe(1);
      expect(startTokyo.hour).toBe(0);

      expect(startNY.timeZoneId).toBe('America/New_York');
      expect(startNY.day).toBe(20);
      expect(startNY.dayOfWeek).toBe(1);
      expect(startNY.hour).toBe(0);

      // Different timezones = different instants
      expect(startTokyo.toInstant().toString()).not.toBe(
        startNY.toInstant().toString()
      );
    });

    it('converts to different timezone explicitly', () => {
      const instant = Temporal.Instant.from('2025-01-22T12:00:00Z');
      const nyTime = instant.toZonedDateTimeISO('America/New_York');
      const start = startOfWeek(nyTime);

      expect(start.timeZoneId).toBe('America/New_York');
      expect(start.day).toBe(20);
      expect(start.dayOfWeek).toBe(1);
      expect(start.hour).toBe(0);
    });
  });

  describe('week boundaries', () => {
    it('handles week crossing month boundary', () => {
      // Friday Jan 31, 2025
      const instant = Temporal.Instant.from('2025-01-31T12:00:00Z');
      const start = startOfWeek(instant);

      // Should be Monday Jan 27
      expect(start.day).toBe(27);
      expect(start.month).toBe(1);
      expect(start.dayOfWeek).toBe(1);
    });

    it('handles week crossing year boundary backwards', () => {
      // Tuesday Jan 2, 2024
      const instant = Temporal.Instant.from('2024-01-02T12:00:00Z');
      const start = startOfWeek(instant);

      // Should be Monday Jan 1, 2024
      expect(start.year).toBe(2024);
      expect(start.month).toBe(1);
      expect(start.day).toBe(1);
      expect(start.dayOfWeek).toBe(1);
    });

    it('handles week crossing year boundary forwards', () => {
      // Sunday Dec 31, 2023
      const instant = Temporal.Instant.from('2023-12-31T12:00:00Z');
      const start = startOfWeek(instant);

      // Should be Monday Dec 25, 2023
      expect(start.year).toBe(2023);
      expect(start.month).toBe(12);
      expect(start.day).toBe(25);
      expect(start.dayOfWeek).toBe(1);
    });
  });

  describe('DST transitions', () => {
    it('handles DST transition within the week', () => {
      // March 9, 2025: DST begins in New York (2 AM -> 3 AM)
      // Sunday March 9, 2025 (DST transition day)
      const sunday = Temporal.ZonedDateTime.from(
        '2025-03-09T15:00:00-04:00[America/New_York]'
      );
      const start = startOfWeek(sunday);

      // Should be Monday March 3
      expect(start.day).toBe(3);
      expect(start.month).toBe(3);
      expect(start.hour).toBe(0);
      expect(start.dayOfWeek).toBe(1);
    });

    it('handles fall DST transition', () => {
      // November 2, 2025: DST ends in New York (2 AM -> 1 AM)
      // Sunday November 2, 2025
      const sunday = Temporal.ZonedDateTime.from(
        '2025-11-02T15:00:00-05:00[America/New_York]'
      );
      const start = startOfWeek(sunday);

      // Should be Monday October 27
      expect(start.day).toBe(27);
      expect(start.month).toBe(10);
      expect(start.hour).toBe(0);
      expect(start.dayOfWeek).toBe(1);
    });
  });

  describe('edge cases', () => {
    it('handles start of year on Monday', () => {
      // Monday January 1, 2024
      const instant = Temporal.Instant.from('2024-01-01T12:00:00Z');
      const start = startOfWeek(instant);

      expect(start.year).toBe(2024);
      expect(start.month).toBe(1);
      expect(start.day).toBe(1);
      expect(start.hour).toBe(0);
      expect(start.dayOfWeek).toBe(1);
    });

    it('handles leap year February 29', () => {
      // Thursday February 29, 2024
      const instant = Temporal.Instant.from('2024-02-29T12:00:00Z');
      const start = startOfWeek(instant);

      // Should be Monday February 26
      expect(start.year).toBe(2024);
      expect(start.month).toBe(2);
      expect(start.day).toBe(26);
      expect(start.dayOfWeek).toBe(1);
    });

    it('handles end of year on Sunday', () => {
      // Sunday December 31, 2023
      const instant = Temporal.Instant.from('2023-12-31T23:59:59Z');
      const start = startOfWeek(instant);

      // Should be Monday December 25
      expect(start.year).toBe(2023);
      expect(start.month).toBe(12);
      expect(start.day).toBe(25);
      expect(start.hour).toBe(0);
      expect(start.dayOfWeek).toBe(1);
    });
  });
});
