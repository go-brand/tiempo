import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { toUtc } from './toUtc';
import { toZonedTime } from './toZonedTime';
import { toIso } from './toIso';

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

  describe('from Unix timestamp', () => {
    it('converts Unix timestamp (milliseconds) to Temporal.Instant', () => {
      const timestamp = 1737403200000; // 2025-01-20T20:00:00.000Z
      const instant = toUtc(timestamp);

      expect(instant).toBeInstanceOf(Temporal.Instant);
      expect(instant.toString()).toBe('2025-01-20T20:00:00Z');
      expect(instant.epochMilliseconds).toBe(timestamp);
    });

    it('handles Unix timestamp from database BIGINT', () => {
      // Common pattern: PostgreSQL storing timestamps as BIGINT
      const dbTimestamp = 1770417255786;
      const instant = toUtc(dbTimestamp);

      expect(instant).toBeInstanceOf(Temporal.Instant);
      expect(instant.epochMilliseconds).toBe(dbTimestamp);
    });

    it('preserves millisecond precision from timestamp', () => {
      const timestamp = 1737403200123; // .123 milliseconds
      const instant = toUtc(timestamp);

      expect(instant.epochMilliseconds).toBe(timestamp);
      expect(instant.toString()).toBe('2025-01-20T20:00:00.123Z');
    });

    it('handles Unix timestamp round-trip conversion', () => {
      const originalTimestamp = 1737403200999;

      // timestamp → Instant → ZonedDateTime → Instant
      const instant1 = toUtc(originalTimestamp);
      const zoned = toZonedTime(instant1, 'America/New_York');
      const instant2 = toUtc(zoned);

      expect(instant1.epochMilliseconds).toBe(originalTimestamp);
      expect(instant2.epochMilliseconds).toBe(originalTimestamp);
      expect(instant1.toString()).toBe(instant2.toString());
    });

    it('ensures Unix timestamp and Date produce identical results', () => {
      const timestamp = 1737403200000;
      const date = new Date(timestamp);

      const fromTimestamp = toUtc(timestamp);
      const fromDate = toUtc(date);

      expect(fromTimestamp.toString()).toBe(fromDate.toString());
      expect(fromTimestamp.epochMilliseconds).toBe(fromDate.epochMilliseconds);
    });
  });

  describe('from Date', () => {
    it('converts Date object to Temporal.Instant', () => {
      const date = new Date('2025-01-20T20:00:00.000Z');
      const instant = toUtc(date);

      expect(instant).toBeInstanceOf(Temporal.Instant);
      expect(instant.toString()).toBe('2025-01-20T20:00:00Z');
    });

    it('handles Date from Drizzle ORM (timestamptz)', () => {
      // Simulating a Date object returned from Drizzle with mode: 'date'
      const drizzleDate = new Date('2025-01-20T20:00:00.000Z');
      const instant = toUtc(drizzleDate);

      expect(instant).toBeInstanceOf(Temporal.Instant);
      expect(instant.toString()).toBe('2025-01-20T20:00:00Z');
      expect(instant.epochMilliseconds).toBe(drizzleDate.getTime());
    });

    it('preserves millisecond precision from Date', () => {
      const date = new Date('2025-01-20T20:00:00.123Z');
      const instant = toUtc(date);

      expect(instant.toString()).toBe('2025-01-20T20:00:00.123Z');
    });

    it('handles Date round-trip conversion', () => {
      const originalDate = new Date('2025-01-20T12:30:45.678Z');

      // Date → Instant → ZonedDateTime → Instant
      const instant1 = toUtc(originalDate);
      const zoned = toZonedTime(instant1, 'America/New_York');
      const instant2 = toUtc(zoned);

      expect(instant1.toString()).toBe(instant2.toString());
      expect(instant1.epochMilliseconds).toBe(originalDate.getTime());
    });
  });

  describe('Instant vs ZonedDateTime[UTC] equivalence', () => {
    it('proves Instant and ZonedDateTime[UTC] represent the same moment', () => {
      const utcString = '2025-01-20T20:00:00.123Z';

      // Create both types from the same ISO string
      const instant = Temporal.Instant.from(utcString);
      const zonedUTC = Temporal.ZonedDateTime.from(`${utcString}[UTC]`);

      // Both should serialize to the same UTC string via toIso
      expect(toIso(instant)).toBe(utcString);
      expect(toIso(zonedUTC)).toBe(utcString);
    });

    it('proves toUtc(string) and Instant.from(string) are equivalent', () => {
      const utcString = '2025-01-20T15:30:45.999Z';

      const viaToUtc = toUtc(utcString);
      const viaInstantFrom = Temporal.Instant.from(utcString);

      // Both paths produce identical results
      expect(toIso(viaToUtc)).toBe(toIso(viaInstantFrom));
      expect(viaToUtc.toString()).toBe(viaInstantFrom.toString());
    });

    it('proves toUtc(zoned) and zoned.toInstant() are equivalent', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T15:00:00-05:00[America/New_York]'
      );

      const viaToUtc = toUtc(zoned);
      const viaToInstant = zoned.toInstant();

      // Both paths produce identical results
      expect(toIso(viaToUtc)).toBe(toIso(viaToInstant));
      expect(viaToUtc.toString()).toBe(viaToInstant.toString());
    });

    it('proves Instant is timezone-agnostic while ZonedDateTime[UTC] is timezone-aware', () => {
      const utcString = '2025-01-20T12:00:00Z';

      const instant = Temporal.Instant.from(utcString);
      const zonedUTC = Temporal.ZonedDateTime.from(`${utcString}[UTC]`);

      // Instant has no timezone property
      expect('timeZoneId' in instant).toBe(false);

      // ZonedDateTime is aware of its UTC timezone
      expect(zonedUTC.timeZoneId).toBe('UTC');

      // But they represent the exact same moment
      expect(toIso(instant)).toBe(toIso(zonedUTC));
      expect(instant.epochMilliseconds).toBe(zonedUTC.epochMilliseconds);
    });

    it('proves both types survive round-trip conversions identically', () => {
      const original = '2025-03-15T18:45:12.5Z';

      // Round-trip via Instant
      const instant = Temporal.Instant.from(original);
      const zonedFromInstant = toZonedTime(instant, 'America/Denver');
      const backToInstant = toUtc(zonedFromInstant);

      // Round-trip via ZonedDateTime[UTC]
      const zonedUTC = Temporal.ZonedDateTime.from(`${original}[UTC]`);
      const zonedFromUTC = toZonedTime(zonedUTC, 'America/Denver');
      const backToUTC = toUtc(zonedFromUTC);

      // Both produce identical results
      expect(toIso(backToInstant)).toBe(original);
      expect(toIso(backToUTC)).toBe(original);
      expect(toIso(backToInstant)).toBe(toIso(backToUTC));
    });
  });
});
