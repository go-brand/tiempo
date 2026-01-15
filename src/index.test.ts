import { describe, it, expect } from 'vitest';
import { utcToZonedTime, zonedTimeToUtc } from './index';

describe('tiempo', () => {
  describe('utcToZonedTime', () => {
    it('converts UTC ISO string to ZonedDateTime in specified timezone', () => {
      const utcString = '2025-01-20T20:00:00.000Z';
      const zoned = utcToZonedTime(utcString, 'America/New_York');

      expect(zoned.hour).toBe(15); // 3 PM in New York (EST: UTC-5)
      expect(zoned.day).toBe(20);
      expect(zoned.month).toBe(1);
      expect(zoned.year).toBe(2025);
      expect(zoned.timeZoneId).toBe('America/New_York');
    });

    it('handles different timezones correctly', () => {
      const utcString = '2025-01-20T12:00:00.000Z';

      const tokyo = utcToZonedTime(utcString, 'Asia/Tokyo');
      expect(tokyo.hour).toBe(21); // JST: UTC+9

      const london = utcToZonedTime(utcString, 'Europe/London');
      expect(london.hour).toBe(12); // GMT: UTC+0

      const losAngeles = utcToZonedTime(utcString, 'America/Los_Angeles');
      expect(losAngeles.hour).toBe(4); // PST: UTC-8
    });

    it('handles daylight saving time transitions', () => {
      // Summer time (EDT: UTC-4)
      const summer = utcToZonedTime('2025-07-20T20:00:00.000Z', 'America/New_York');
      expect(summer.hour).toBe(16); // 4 PM in EDT

      // Winter time (EST: UTC-5)
      const winter = utcToZonedTime('2025-01-20T20:00:00.000Z', 'America/New_York');
      expect(winter.hour).toBe(15); // 3 PM in EST
    });
  });

  describe('zonedTimeToUtc', () => {
    it('converts ZonedDateTime back to UTC ISO string', () => {
      const utcString = '2025-01-20T20:00:00Z';
      const zoned = utcToZonedTime(utcString, 'America/New_York');
      const backToUtc = zonedTimeToUtc(zoned);

      expect(backToUtc).toBe(utcString);
    });

    it('handles milliseconds correctly', () => {
      const utcString = '2025-01-20T20:00:00.123Z';
      const zoned = utcToZonedTime(utcString, 'Europe/Paris');
      const backToUtc = zonedTimeToUtc(zoned);

      expect(backToUtc).toBe(utcString);
    });

    it('preserves the same instant across timezone conversions', () => {
      const original = '2025-06-15T14:30:00Z';

      // Convert through multiple timezones
      const ny = utcToZonedTime(original, 'America/New_York');
      const tokyo = utcToZonedTime(original, 'Asia/Tokyo');
      const london = utcToZonedTime(original, 'Europe/London');

      // All should convert back to the same UTC instant
      expect(zonedTimeToUtc(ny)).toBe(original);
      expect(zonedTimeToUtc(tokyo)).toBe(original);
      expect(zonedTimeToUtc(london)).toBe(original);
    });
  });

  describe('round-trip conversion', () => {
    it('maintains data integrity through multiple conversions', () => {
      const original = '2025-03-15T09:45:30.5Z';

      // UTC -> NY -> UTC -> Tokyo -> UTC
      const step1 = utcToZonedTime(original, 'America/New_York');
      const step2 = zonedTimeToUtc(step1);
      const step3 = utcToZonedTime(step2, 'Asia/Tokyo');
      const final = zonedTimeToUtc(step3);

      expect(final).toBe(original);
    });
  });
});
