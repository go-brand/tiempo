import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { endOfWeek } from './endOfWeek';

describe('endOfWeek', () => {
  describe('from Temporal.Instant', () => {
    it('returns end of week in UTC', () => {
      // Wednesday Jan 22, 2025
      const instant = Temporal.Instant.from('2025-01-22T12:00:00Z');
      const end = endOfWeek(instant);

      expect(end).toBeInstanceOf(Temporal.ZonedDateTime);
      expect(end.year).toBe(2025);
      expect(end.month).toBe(1);
      expect(end.day).toBe(26); // Sunday
      expect(end.hour).toBe(23);
      expect(end.minute).toBe(59);
      expect(end.second).toBe(59);
      expect(end.millisecond).toBe(999);
      expect(end.microsecond).toBe(999);
      expect(end.nanosecond).toBe(999);
      expect(end.timeZoneId).toBe('UTC');
      expect(end.dayOfWeek).toBe(7); // Sunday
    });

    it('returns same day if already Sunday', () => {
      // Sunday Jan 26, 2025 at noon
      const instant = Temporal.Instant.from('2025-01-26T12:00:00Z');
      const end = endOfWeek(instant);

      expect(end.day).toBe(26); // Same Sunday
      expect(end.hour).toBe(23); // But at end of day
      expect(end.minute).toBe(59);
      expect(end.second).toBe(59);
      expect(end.dayOfWeek).toBe(7);
    });

    it('handles Monday (first day of week)', () => {
      // Monday Jan 20, 2025
      const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const end = endOfWeek(instant);

      expect(end.day).toBe(26); // Next Sunday
      expect(end.hour).toBe(23);
      expect(end.dayOfWeek).toBe(7);
    });

    it('handles each day of the week', () => {
      const days = [
        { date: '2025-01-20' },
        { date: '2025-01-21' },
        { date: '2025-01-22' },
        { date: '2025-01-23' },
        { date: '2025-01-24' },
        { date: '2025-01-25' },
        { date: '2025-01-26' },
      ];

      for (const { date } of days) {
        const instant = Temporal.Instant.from(`${date}T12:00:00Z`);
        const end = endOfWeek(instant);

        // All should return Sunday Jan 26
        expect(end.day).toBe(26);
        expect(end.dayOfWeek).toBe(7);
        expect(end.hour).toBe(23);
        expect(end.minute).toBe(59);
        expect(end.second).toBe(59);
      }
    });

    it('handles instant at different times', () => {
      const morning = Temporal.Instant.from('2025-01-22T08:00:00Z');
      const afternoon = Temporal.Instant.from('2025-01-22T16:30:45Z');
      const evening = Temporal.Instant.from('2025-01-22T23:00:00Z');

      const endMorning = endOfWeek(morning);
      const endAfternoon = endOfWeek(afternoon);
      const endEvening = endOfWeek(evening);

      // All should return the same end of week (Sunday Jan 26)
      expect(endMorning.toString()).toBe(endAfternoon.toString());
      expect(endMorning.toString()).toBe(endEvening.toString());
      expect(endMorning.day).toBe(26);
      expect(endMorning.dayOfWeek).toBe(7);
    });
  });

  describe('from Temporal.ZonedDateTime', () => {
    it('returns end of week in same timezone', () => {
      // Wednesday Jan 22, 2025
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-22T15:30:00-05:00[America/New_York]'
      );
      const end = endOfWeek(zoned);

      expect(end.year).toBe(2025);
      expect(end.month).toBe(1);
      expect(end.day).toBe(26); // Sunday
      expect(end.hour).toBe(23);
      expect(end.minute).toBe(59);
      expect(end.second).toBe(59);
      expect(end.millisecond).toBe(999);
      expect(end.microsecond).toBe(999);
      expect(end.nanosecond).toBe(999);
      expect(end.timeZoneId).toBe('America/New_York');
      expect(end.dayOfWeek).toBe(7);
    });

    it('returns same day if already Sunday', () => {
      // Sunday Jan 26, 2025
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-26T15:30:00-05:00[America/New_York]'
      );
      const end = endOfWeek(zoned);

      expect(end.day).toBe(26);
      expect(end.hour).toBe(23);
      expect(end.minute).toBe(59);
      expect(end.dayOfWeek).toBe(7);
    });

    it('handles different timezones', () => {
      // Wednesday in Tokyo and NY
      const tokyo = Temporal.ZonedDateTime.from(
        '2025-01-22T15:00:00+09:00[Asia/Tokyo]'
      );
      const ny = Temporal.ZonedDateTime.from(
        '2025-01-22T15:00:00-05:00[America/New_York]'
      );

      const endTokyo = endOfWeek(tokyo);
      const endNY = endOfWeek(ny);

      // Both should be Sunday in their respective timezones
      expect(endTokyo.timeZoneId).toBe('Asia/Tokyo');
      expect(endTokyo.day).toBe(26);
      expect(endTokyo.dayOfWeek).toBe(7);
      expect(endTokyo.hour).toBe(23);

      expect(endNY.timeZoneId).toBe('America/New_York');
      expect(endNY.day).toBe(26);
      expect(endNY.dayOfWeek).toBe(7);
      expect(endNY.hour).toBe(23);

      // Different timezones = different instants
      expect(endTokyo.toInstant().toString()).not.toBe(
        endNY.toInstant().toString()
      );
    });

    it('converts to different timezone explicitly', () => {
      const instant = Temporal.Instant.from('2025-01-22T12:00:00Z');
      const nyTime = instant.toZonedDateTimeISO('America/New_York');
      const end = endOfWeek(nyTime);

      expect(end.timeZoneId).toBe('America/New_York');
      expect(end.day).toBe(26);
      expect(end.dayOfWeek).toBe(7);
      expect(end.hour).toBe(23);
    });
  });

  describe('week boundaries', () => {
    it('handles week crossing month boundary', () => {
      // Monday Jan 27, 2025
      const instant = Temporal.Instant.from('2025-01-27T12:00:00Z');
      const end = endOfWeek(instant);

      // Should be Sunday Feb 2
      expect(end.day).toBe(2);
      expect(end.month).toBe(2);
      expect(end.dayOfWeek).toBe(7);
    });

    it('handles week crossing year boundary backwards', () => {
      // Sunday Jan 7, 2024
      const instant = Temporal.Instant.from('2024-01-07T12:00:00Z');
      const end = endOfWeek(instant);

      // Should be Sunday Jan 7, 2024 (same day)
      expect(end.year).toBe(2024);
      expect(end.month).toBe(1);
      expect(end.day).toBe(7);
      expect(end.dayOfWeek).toBe(7);
    });

    it('handles week crossing year boundary forwards', () => {
      // Monday Dec 25, 2023
      const instant = Temporal.Instant.from('2023-12-25T12:00:00Z');
      const end = endOfWeek(instant);

      // Should be Sunday Dec 31, 2023
      expect(end.year).toBe(2023);
      expect(end.month).toBe(12);
      expect(end.day).toBe(31);
      expect(end.dayOfWeek).toBe(7);
    });

    it('handles week crossing into new year', () => {
      // Tuesday Dec 26, 2023
      const instant = Temporal.Instant.from('2023-12-26T12:00:00Z');
      const end = endOfWeek(instant);

      // Should be Sunday Dec 31, 2023
      expect(end.year).toBe(2023);
      expect(end.month).toBe(12);
      expect(end.day).toBe(31);
      expect(end.dayOfWeek).toBe(7);
    });
  });

  describe('DST transitions', () => {
    it('handles DST transition within the week', () => {
      // March 9, 2025: DST begins in New York (2 AM -> 3 AM)
      // Thursday March 6, 2025
      const thursday = Temporal.ZonedDateTime.from(
        '2025-03-06T15:00:00-05:00[America/New_York]'
      );
      const end = endOfWeek(thursday);

      // Should be Sunday March 9 (DST transition day)
      // Week is: Mon Mar 3 - Sun Mar 9 (DST happens on Sun)
      expect(end.day).toBe(9);
      expect(end.month).toBe(3);
      expect(end.hour).toBe(23);
      expect(end.dayOfWeek).toBe(7);
    });

    it('handles fall DST transition', () => {
      // November 2, 2025: DST ends in New York (2 AM -> 1 AM)
      // Thursday October 30, 2025
      const thursday = Temporal.ZonedDateTime.from(
        '2025-10-30T15:00:00-04:00[America/New_York]'
      );
      const end = endOfWeek(thursday);

      // Should be Sunday November 2 (DST transition day)
      // Week is: Mon Oct 27 - Sun Nov 2 (DST ends on Sun)
      expect(end.day).toBe(2);
      expect(end.month).toBe(11);
      expect(end.hour).toBe(23);
      expect(end.dayOfWeek).toBe(7);
    });
  });

  describe('from Temporal.PlainDate', () => {
    it('returns end of week in specified timezone', () => {
      // Wednesday Jan 22, 2025
      const date = Temporal.PlainDate.from('2025-01-22');
      const end = endOfWeek(date, 'America/New_York');

      expect(end).toBeInstanceOf(Temporal.ZonedDateTime);
      expect(end.year).toBe(2025);
      expect(end.month).toBe(1);
      expect(end.day).toBe(26); // Sunday
      expect(end.hour).toBe(23);
      expect(end.minute).toBe(59);
      expect(end.second).toBe(59);
      expect(end.millisecond).toBe(999);
      expect(end.timeZoneId).toBe('America/New_York');
      expect(end.dayOfWeek).toBe(7);
    });

    it('same PlainDate produces different instants for different timezones', () => {
      const date = Temporal.PlainDate.from('2025-01-22');
      const endTokyo = endOfWeek(date, 'Asia/Tokyo');
      const endNY = endOfWeek(date, 'America/New_York');

      // Same calendar date, both return Sunday Jan 26
      expect(endTokyo.day).toBe(26);
      expect(endNY.day).toBe(26);
      expect(endTokyo.dayOfWeek).toBe(7);
      expect(endNY.dayOfWeek).toBe(7);

      // But different instants
      expect(endTokyo.toInstant().toString()).not.toBe(
        endNY.toInstant().toString()
      );
    });

    it('handles week crossing month boundary', () => {
      // Monday Jan 27, 2025
      const date = Temporal.PlainDate.from('2025-01-27');
      const end = endOfWeek(date, 'UTC');

      // Should be Sunday Feb 2
      expect(end.day).toBe(2);
      expect(end.month).toBe(2);
      expect(end.dayOfWeek).toBe(7);
    });
  });

  describe('edge cases', () => {
    it('handles start of year on Monday', () => {
      // Monday January 1, 2024
      const instant = Temporal.Instant.from('2024-01-01T12:00:00Z');
      const end = endOfWeek(instant);

      expect(end.year).toBe(2024);
      expect(end.month).toBe(1);
      expect(end.day).toBe(7);
      expect(end.hour).toBe(23);
      expect(end.dayOfWeek).toBe(7);
    });

    it('handles leap year February 29', () => {
      // Thursday February 29, 2024
      const instant = Temporal.Instant.from('2024-02-29T12:00:00Z');
      const end = endOfWeek(instant);

      // Should be Sunday March 3
      expect(end.year).toBe(2024);
      expect(end.month).toBe(3);
      expect(end.day).toBe(3);
      expect(end.dayOfWeek).toBe(7);
    });

    it('handles end of year on Sunday', () => {
      // Sunday December 31, 2023
      const instant = Temporal.Instant.from('2023-12-31T00:00:00Z');
      const end = endOfWeek(instant);

      // Should be Sunday December 31 (same day)
      expect(end.year).toBe(2023);
      expect(end.month).toBe(12);
      expect(end.day).toBe(31);
      expect(end.hour).toBe(23);
      expect(end.dayOfWeek).toBe(7);
    });

    it('precision is exact to nanosecond', () => {
      const instant = Temporal.Instant.from('2025-01-22T12:00:00Z');
      const end = endOfWeek(instant);

      expect(end.millisecond).toBe(999);
      expect(end.microsecond).toBe(999);
      expect(end.nanosecond).toBe(999);
    });
  });
});
