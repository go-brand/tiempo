import { describe, expect, it } from 'vitest';
import { toZonedTime, toUtc, toUtcString } from './index';
import { Temporal } from '@js-temporal/polyfill';

describe('tiempo', () => {
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
  });

  describe('toUtc', () => {
    describe('from ISO string', () => {
      it('converts UTC ISO string to Temporal.Instant', () => {
        const utcString = '2025-01-20T20:00:00Z';
        const instant = toUtc(utcString);

        expect(instant).toBeInstanceOf(Temporal.Instant);
        expect(instant.toString()).toBe(utcString);
      });

      it('handles milliseconds correctly', () => {
        const utcString = '2025-01-20T20:00:00.123Z';
        const instant = toUtc(utcString);

        expect(instant.toString()).toBe(utcString);
      });
    });

    describe('from Temporal.ZonedDateTime', () => {
      it('converts ZonedDateTime to Temporal.Instant', () => {
        const zoned = Temporal.ZonedDateTime.from(
          '2025-01-20T15:00:00-05:00[America/New_York]'
        );
        const instant = toUtc(zoned);

        expect(instant).toBeInstanceOf(Temporal.Instant);
        expect(instant.toString()).toBe('2025-01-20T20:00:00Z');
      });

      it('preserves the same instant across timezone conversions', () => {
        const original = '2025-06-15T14:30:00Z';

        // Convert through multiple timezones
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

  describe('toUtcString', () => {
    describe('from Temporal.ZonedDateTime', () => {
      it('converts ZonedDateTime to UTC ISO string', () => {
        const zoned = Temporal.ZonedDateTime.from(
          '2025-01-20T15:00:00-05:00[America/New_York]'
        );
        const iso = toUtcString(zoned);

        expect(typeof iso).toBe('string');
        expect(iso).toBe('2025-01-20T20:00:00Z');
      });

      it('handles milliseconds correctly', () => {
        const utcString = '2025-01-20T20:00:00.123Z';
        const zoned = toZonedTime(utcString, 'Europe/Paris');
        const backToIso = toUtcString(zoned);

        expect(backToIso).toBe(utcString);
      });

      it('preserves the same instant across timezone conversions', () => {
        const original = '2025-06-15T14:30:00Z';

        const ny = toZonedTime(original, 'America/New_York');
        const tokyo = toZonedTime(original, 'Asia/Tokyo');
        const london = toZonedTime(original, 'Europe/London');

        // All should convert back to the same UTC ISO string
        expect(toUtcString(ny)).toBe(original);
        expect(toUtcString(tokyo)).toBe(original);
        expect(toUtcString(london)).toBe(original);
      });
    });

    describe('from Temporal.Instant', () => {
      it('converts Instant to UTC ISO string', () => {
        const instant = Temporal.Instant.from('2025-01-20T20:00:00Z');
        const iso = toUtcString(instant);

        expect(typeof iso).toBe('string');
        expect(iso).toBe('2025-01-20T20:00:00Z');
      });

      it('handles milliseconds correctly', () => {
        const instant = Temporal.Instant.from('2025-01-20T20:00:00.456Z');
        const iso = toUtcString(instant);

        expect(iso).toBe('2025-01-20T20:00:00.456Z');
      });
    });
  });

  describe('round-trip conversions', () => {
    it('maintains data integrity: ISO -> ZonedTime -> ISO', () => {
      const original = '2025-03-15T09:45:30.5Z';

      const step1 = toZonedTime(original, 'America/New_York');
      const step2 = toUtcString(step1);
      const step3 = toZonedTime(step2, 'Asia/Tokyo');
      const final = toUtcString(step3);

      expect(final).toBe(original);
    });

    it('maintains data integrity: ISO -> Instant -> ZonedTime -> Instant -> ISO', () => {
      const original = '2025-03-15T09:45:30.5Z';

      const instant1 = toUtc(original);
      const zoned = toZonedTime(instant1, 'America/New_York');
      const instant2 = toUtc(zoned);
      const final = toUtcString(instant2);

      expect(final).toBe(original);
    });

    it('maintains data integrity across all input types', () => {
      const originalIso = '2025-01-20T12:00:00Z';

      // Start with string
      const fromString = toZonedTime(originalIso, 'Asia/Tokyo');

      // Convert to instant and back to zoned
      const instant = toUtc(fromString);
      const fromInstant = toZonedTime(instant, 'Europe/London');

      // Convert between zoned times
      const fromZoned = toZonedTime(fromInstant, 'America/Los_Angeles');

      // All should represent the same instant
      const finalIso = toUtcString(fromZoned);
      expect(finalIso).toBe(originalIso);
    });
  });
});
