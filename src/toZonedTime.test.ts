import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { toZonedTime } from './toZonedTime';
import { toUtc } from './toUtc';

describe('toZonedTime', () => {
  describe('from ISO string', () => {
    it('converts UTC ISO string to ZonedDateTime in specified timezone', () => {
      const utcString = '2025-01-20T20:00:00.000Z';
      const zoned = toZonedTime(utcString, 'America/New_York');

      expect(zoned).toBeInstanceOf(Temporal.ZonedDateTime);
      expect(zoned.hour).toBe(15); // 3 PM in New York (EST: UTC-5)
      expect(zoned.day).toBe(20);
      expect(zoned.month).toBe(1);
      expect(zoned.year).toBe(2025);
      expect(zoned.timeZoneId).toBe('America/New_York');
    });

    it('handles different timezones correctly', () => {
      const utcString = '2025-01-20T12:00:00.000Z';

      const tokyo = toZonedTime(utcString, 'Asia/Tokyo');
      expect(tokyo.hour).toBe(21); // JST: UTC+9

      const london = toZonedTime(utcString, 'Europe/London');
      expect(london.hour).toBe(12); // GMT: UTC+0

      const losAngeles = toZonedTime(utcString, 'America/Los_Angeles');
      expect(losAngeles.hour).toBe(4); // PST: UTC-8
    });

    it('handles daylight saving time transitions', () => {
      // Summer time (EDT: UTC-4)
      const summer = toZonedTime(
        '2025-07-20T20:00:00.000Z',
        'America/New_York'
      );
      expect(summer.hour).toBe(16); // 4 PM in EDT

      // Winter time (EST: UTC-5)
      const winter = toZonedTime(
        '2025-01-20T20:00:00.000Z',
        'America/New_York'
      );
      expect(winter.hour).toBe(15); // 3 PM in EST
    });
  });

  describe('from Temporal.Instant', () => {
    it('converts Instant to ZonedDateTime in specified timezone', () => {
      const instant = Temporal.Instant.from('2025-01-20T20:00:00Z');
      const zoned = toZonedTime(instant, 'America/New_York');

      expect(zoned).toBeInstanceOf(Temporal.ZonedDateTime);
      expect(zoned.hour).toBe(15); // 3 PM in New York
      expect(zoned.timeZoneId).toBe('America/New_York');
    });

    it('handles multiple timezone conversions from same instant', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');

      const tokyo = toZonedTime(instant, 'Asia/Tokyo');
      const newYork = toZonedTime(instant, 'America/New_York');

      expect(tokyo.hour).toBe(21);
      expect(newYork.hour).toBe(7);
    });
  });

  describe('from Temporal.ZonedDateTime', () => {
    it('converts ZonedDateTime to different timezone', () => {
      const nyTime = Temporal.ZonedDateTime.from(
        '2025-01-20T15:00:00-05:00[America/New_York]'
      );
      const tokyoTime = toZonedTime(nyTime, 'Asia/Tokyo');

      expect(tokyoTime).toBeInstanceOf(Temporal.ZonedDateTime);
      expect(tokyoTime.timeZoneId).toBe('Asia/Tokyo');
      expect(tokyoTime.hour).toBe(5); // 5 AM next day in Tokyo
      expect(tokyoTime.day).toBe(21);
    });

    it('preserves the same instant when converting timezones', () => {
      const original = Temporal.ZonedDateTime.from(
        '2025-01-20T15:00:00-05:00[America/New_York]'
      );
      const tokyo = toZonedTime(original, 'Asia/Tokyo');
      const london = toZonedTime(original, 'Europe/London');

      // All represent the same instant
      expect(original.toInstant().toString()).toBe(
        tokyo.toInstant().toString()
      );
      expect(original.toInstant().toString()).toBe(
        london.toInstant().toString()
      );
    });
  });

  describe('timezone conversion with toUtc', () => {
    it('converts ZonedDateTime to different timezone while preserving instant', () => {
      const ny = Temporal.ZonedDateTime.from('2025-01-20T15:00:00-05:00[America/New_York]');
      const tokyo = toZonedTime(ny, 'Asia/Tokyo');

      // Both should convert back to the same UTC instant
      expect(toUtc(ny).toString()).toBe(toUtc(tokyo).toString());
    });

    it('preserves original timezone when no conversion', () => {
      const original = '2025-06-15T14:30:00Z';

      const ny = toZonedTime(original, 'America/New_York');
      const tokyo = toZonedTime(original, 'Asia/Tokyo');
      const london = toZonedTime(original, 'Europe/London');

      // All should convert back to the same UTC instant
      expect(toUtc(ny).toString()).toBe(original);
      expect(toUtc(tokyo).toString()).toBe(original);
      expect(toUtc(london).toString()).toBe(original);
    });
  });
});
