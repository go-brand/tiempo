import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { toPlainTime } from './toPlainTime';
import { toZonedTime } from './toZonedTime';
import { isPlainTimeBefore } from './isPlainTimeBefore';

describe('toPlainTime', () => {
  describe('from PlainTimeLike object', () => {
    it('creates time from hour and minute', () => {
      const time = toPlainTime({ hour: 14, minute: 30 });

      expect(time).toBeInstanceOf(Temporal.PlainTime);
      expect(time.hour).toBe(14);
      expect(time.minute).toBe(30);
      expect(time.second).toBe(0);
    });

    it('creates time with all components', () => {
      const time = toPlainTime({
        hour: 14,
        minute: 30,
        second: 45,
        millisecond: 123,
        microsecond: 456,
        nanosecond: 789,
      });

      expect(time.hour).toBe(14);
      expect(time.minute).toBe(30);
      expect(time.second).toBe(45);
      expect(time.millisecond).toBe(123);
      expect(time.microsecond).toBe(456);
      expect(time.nanosecond).toBe(789);
    });

    it('throws for empty object (no time properties)', () => {
      // Temporal.PlainTime.from({}) throws "invalid time-like"
      expect(() => toPlainTime({})).toThrow();
    });

    it('creates time from partial object (only hour)', () => {
      const time = toPlainTime({ hour: 9 });

      expect(time.hour).toBe(9);
      expect(time.minute).toBe(0);
    });

    it('creates time from Temporal.PlainTime instance', () => {
      const original = Temporal.PlainTime.from('14:30:45');
      const time = toPlainTime(original);

      expect(time).toBeInstanceOf(Temporal.PlainTime);
      expect(time.hour).toBe(14);
      expect(time.minute).toBe(30);
      expect(time.second).toBe(45);
    });

    it('creates time from Temporal.PlainDateTime (extracts time)', () => {
      const dateTime = Temporal.PlainDateTime.from('2025-01-20T14:30:45');
      const time = toPlainTime(dateTime);

      expect(time).toBeInstanceOf(Temporal.PlainTime);
      expect(time.hour).toBe(14);
      expect(time.minute).toBe(30);
      expect(time.second).toBe(45);
    });
  });

  describe('from plain time string', () => {
    it('parses HH:MM format', () => {
      const time = toPlainTime('14:30');

      expect(time).toBeInstanceOf(Temporal.PlainTime);
      expect(time.hour).toBe(14);
      expect(time.minute).toBe(30);
      expect(time.second).toBe(0);
    });

    it('parses HH:MM:SS format', () => {
      const time = toPlainTime('14:30:45');

      expect(time).toBeInstanceOf(Temporal.PlainTime);
      expect(time.hour).toBe(14);
      expect(time.minute).toBe(30);
      expect(time.second).toBe(45);
    });

    it('parses HH:MM:SS.mmm format (subsecond precision)', () => {
      const time = toPlainTime('14:30:45.123');

      expect(time).toBeInstanceOf(Temporal.PlainTime);
      expect(time.hour).toBe(14);
      expect(time.minute).toBe(30);
      expect(time.second).toBe(45);
      expect(time.millisecond).toBe(123);
    });

    it('parses full nanosecond precision', () => {
      const time = toPlainTime('14:30:45.123456789');

      expect(time.millisecond).toBe(123);
      expect(time.microsecond).toBe(456);
      expect(time.nanosecond).toBe(789);
    });

    it('parses midnight', () => {
      const time = toPlainTime('00:00');

      expect(time.hour).toBe(0);
      expect(time.minute).toBe(0);
    });

    it('parses end of day', () => {
      const time = toPlainTime('23:59');

      expect(time.hour).toBe(23);
      expect(time.minute).toBe(59);
    });

    it('parses with leading zeros', () => {
      const time = toPlainTime('09:05');

      expect(time.hour).toBe(9);
      expect(time.minute).toBe(5);
    });

    it('throws for invalid time values', () => {
      expect(() => toPlainTime('25:00')).toThrow();
      expect(() => toPlainTime('12:60')).toThrow();
    });
  });

  describe('from ZonedDateTime (single arg)', () => {
    it('extracts time from ZonedDateTime', () => {
      const zdt = toZonedTime('2025-01-20T15:30:45.123Z', 'America/New_York');
      const time = toPlainTime(zdt);

      expect(time).toBeInstanceOf(Temporal.PlainTime);
      expect(time.hour).toBe(10); // 10:30 AM in New York (EST: UTC-5)
      expect(time.minute).toBe(30);
      expect(time.second).toBe(45);
      expect(time.millisecond).toBe(123);
    });

    it('preserves full time precision', () => {
      const zdt = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:45.123456789[America/New_York]'
      );
      const time = toPlainTime(zdt);

      expect(time.hour).toBe(14);
      expect(time.minute).toBe(30);
      expect(time.second).toBe(45);
      expect(time.millisecond).toBe(123);
      expect(time.microsecond).toBe(456);
      expect(time.nanosecond).toBe(789);
    });
  });

  describe('from ISO string with timezone', () => {
    it('converts UTC ISO string to PlainTime in specified timezone', () => {
      const time = toPlainTime('2025-01-20T15:30:00Z', 'America/New_York');

      expect(time).toBeInstanceOf(Temporal.PlainTime);
      expect(time.hour).toBe(10); // 10:30 AM in New York (EST: UTC-5)
      expect(time.minute).toBe(30);
      expect(time.second).toBe(0);
    });

    it('handles different timezones correctly', () => {
      const utcString = '2025-01-20T12:00:00Z';

      const tokyo = toPlainTime(utcString, 'Asia/Tokyo');
      expect(tokyo.hour).toBe(21); // JST: UTC+9

      const london = toPlainTime(utcString, 'Europe/London');
      expect(london.hour).toBe(12); // GMT: UTC+0

      const losAngeles = toPlainTime(utcString, 'America/Los_Angeles');
      expect(losAngeles.hour).toBe(4); // PST: UTC-8
    });

    it('handles daylight saving time transitions', () => {
      // Summer time (EDT: UTC-4)
      const summer = toPlainTime('2025-07-20T20:00:00Z', 'America/New_York');
      expect(summer.hour).toBe(16); // 4 PM in EDT

      // Winter time (EST: UTC-5)
      const winter = toPlainTime('2025-01-20T20:00:00Z', 'America/New_York');
      expect(winter.hour).toBe(15); // 3 PM in EST
    });
  });

  describe('from Date with timezone', () => {
    it('converts Date object to PlainTime in specified timezone', () => {
      const date = new Date('2025-01-20T15:30:00.000Z');
      const time = toPlainTime(date, 'America/New_York');

      expect(time).toBeInstanceOf(Temporal.PlainTime);
      expect(time.hour).toBe(10); // 10:30 AM in New York
      expect(time.minute).toBe(30);
    });

    it('handles Date from Drizzle ORM (timestamptz)', () => {
      const drizzleDate = new Date('2025-01-20T20:00:00.000Z');

      const tokyo = toPlainTime(drizzleDate, 'Asia/Tokyo');
      expect(tokyo.hour).toBe(5); // 5 AM next day in Tokyo (JST: UTC+9)

      const newYork = toPlainTime(drizzleDate, 'America/New_York');
      expect(newYork.hour).toBe(15); // 3 PM in New York
    });
  });

  describe('from Temporal.Instant with timezone', () => {
    it('converts Instant to PlainTime in specified timezone', () => {
      const instant = Temporal.Instant.from('2025-01-20T15:30:00Z');
      const time = toPlainTime(instant, 'America/New_York');

      expect(time).toBeInstanceOf(Temporal.PlainTime);
      expect(time.hour).toBe(10); // 10:30 AM in New York
      expect(time.minute).toBe(30);
    });

    it('handles multiple timezone conversions from same instant', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');

      const tokyo = toPlainTime(instant, 'Asia/Tokyo');
      const newYork = toPlainTime(instant, 'America/New_York');

      expect(tokyo.hour).toBe(21);
      expect(newYork.hour).toBe(7);
    });
  });

  describe('from ZonedDateTime with timezone (converts first)', () => {
    it('converts ZonedDateTime to different timezone then extracts time', () => {
      const nyTime = Temporal.ZonedDateTime.from(
        '2025-01-20T15:00:00-05:00[America/New_York]'
      );
      const tokyoTime = toPlainTime(nyTime, 'Asia/Tokyo');

      expect(tokyoTime.hour).toBe(5); // 5 AM next day in Tokyo
      expect(tokyoTime.minute).toBe(0);
    });
  });

  describe('error handling', () => {
    it('throws when timezone is missing for ISO datetime string', () => {
      // ISO datetime strings need timezone to convert
      expect(() => toPlainTime('2025-01-20T15:30:00Z')).toThrow(
        'Timezone is required unless input is a ZonedDateTime, PlainTimeLike, or plain time string'
      );
    });

    it('throws when timezone is missing for Date', () => {
      expect(() => {
        // @ts-expect-error - testing runtime error for missing timezone
        toPlainTime(new Date());
      }).toThrow('Timezone is required unless input is a ZonedDateTime, PlainTimeLike, or plain time string');
    });

    it('throws when timezone is missing for Instant', () => {
      expect(() => {
        // @ts-expect-error - testing runtime error for missing timezone
        toPlainTime(Temporal.Instant.from('2025-01-20T15:30:00Z'));
      }).toThrow('Timezone is required unless input is a ZonedDateTime, PlainTimeLike, or plain time string');
    });
  });

  describe('edge cases', () => {
    it('handles midnight boundary correctly', () => {
      // 23:30 UTC on Jan 20 → 08:30 next day in Tokyo (but PlainTime has no date)
      const time = toPlainTime('2025-01-20T23:30:00Z', 'Asia/Tokyo');
      expect(time.hour).toBe(8);
      expect(time.minute).toBe(30);
    });

    it('handles half-hour offset timezones (India)', () => {
      // 12:00 UTC → 17:30 in India (UTC+5:30)
      const time = toPlainTime('2025-01-20T12:00:00Z', 'Asia/Kolkata');
      expect(time.hour).toBe(17);
      expect(time.minute).toBe(30);
    });

    it('handles 45-minute offset timezones (Nepal)', () => {
      // 12:00 UTC → 17:45 in Nepal (UTC+5:45)
      const time = toPlainTime('2025-01-20T12:00:00Z', 'Asia/Kathmandu');
      expect(time.hour).toBe(17);
      expect(time.minute).toBe(45);
    });

    it('handles midnight exactly', () => {
      const time = toPlainTime('2025-01-20T05:00:00Z', 'America/New_York'); // EST = UTC-5
      expect(time.hour).toBe(0);
      expect(time.minute).toBe(0);
      expect(time.second).toBe(0);
    });

    it('handles end of day (23:59:59)', () => {
      const time = toPlainTime('2025-01-20T04:59:59Z', 'America/New_York');
      expect(time.hour).toBe(23);
      expect(time.minute).toBe(59);
      expect(time.second).toBe(59);
    });

    it('same instant produces different PlainTimes in different timezones', () => {
      const instant = '2025-01-20T12:00:00Z';

      const utc = toPlainTime(instant, 'UTC');
      const tokyo = toPlainTime(instant, 'Asia/Tokyo');
      const newYork = toPlainTime(instant, 'America/New_York');

      // Verify they're all PlainTime instances
      expect(utc).toBeInstanceOf(Temporal.PlainTime);
      expect(tokyo).toBeInstanceOf(Temporal.PlainTime);
      expect(newYork).toBeInstanceOf(Temporal.PlainTime);

      // Verify they differ as expected
      expect(Temporal.PlainTime.compare(utc, tokyo)).not.toBe(0);
      expect(Temporal.PlainTime.compare(utc, newYork)).not.toBe(0);
      expect(Temporal.PlainTime.compare(tokyo, newYork)).not.toBe(0);
    });
  });

  describe('real-world use cases', () => {
    it('business hours check: is store open?', () => {
      const openTime = Temporal.PlainTime.from('09:00');
      const closeTime = Temporal.PlainTime.from('17:00');

      // 14:00 UTC → 09:00 in New York (store just opened)
      const justOpened = toPlainTime('2025-01-20T14:00:00Z', 'America/New_York');
      expect(isPlainTimeBefore(justOpened, openTime)).toBe(false); // not before open
      expect(isPlainTimeBefore(justOpened, closeTime)).toBe(true); // before close

      // 20:00 UTC → 15:00 in New York (store open)
      const midDay = toPlainTime('2025-01-20T20:00:00Z', 'America/New_York');
      const isOpen =
        !isPlainTimeBefore(midDay, openTime) && isPlainTimeBefore(midDay, closeTime);
      expect(isOpen).toBe(true);

      // 23:00 UTC → 18:00 in New York (store closed)
      const afterClose = toPlainTime('2025-01-20T23:00:00Z', 'America/New_York');
      const isClosed = !isPlainTimeBefore(afterClose, closeTime);
      expect(isClosed).toBe(true);
    });

    it('schedule comparison: is current time before scheduled time?', () => {
      const scheduledTime = Temporal.PlainTime.from('14:30');

      // User in Tokyo checking against a scheduled event
      const userTime = toPlainTime('2025-01-20T05:00:00Z', 'Asia/Tokyo'); // 14:00 in Tokyo
      expect(isPlainTimeBefore(userTime, scheduledTime)).toBe(true);
    });
  });
});
