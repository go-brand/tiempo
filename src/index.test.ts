import { describe, expect, it } from 'vitest';
import { toZonedTime, toUtc, toIso } from './index';
import { Temporal } from '@js-temporal/polyfill';

describe('tiempo integration', () => {
  describe('round-trip conversions', () => {
    it('maintains data integrity: ISO -> ZonedTime -> ISO', () => {
      const original = '2025-03-15T09:45:30.5Z';

      const step1 = toZonedTime(original, 'America/New_York');
      const step2 = toIso(step1);
      const step3 = toZonedTime(step2, 'Asia/Tokyo');
      const final = toIso(step3);

      expect(final).toBe(original);
    });

    it('maintains data integrity: ISO -> Instant -> ZonedTime -> Instant -> ISO', () => {
      const original = '2025-03-15T09:45:30.5Z';

      const instant1 = toUtc(original);
      const zoned = toZonedTime(instant1, 'America/New_York');
      const instant2 = toUtc(zoned);
      const final = toIso(instant2);

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
      const finalIso = toIso(fromZoned);
      expect(finalIso).toBe(originalIso);
    });

    it('handles complex timezone hopping without data loss', () => {
      const original = '2025-12-25T00:00:00.999Z';

      // Christmas midnight UTC through various timezones
      const step1 = toZonedTime(original, 'Pacific/Auckland'); // +13
      const step2 = toZonedTime(step1, 'America/Los_Angeles'); // -8
      const step3 = toZonedTime(step2, 'Europe/Paris'); // +1
      const step4 = toZonedTime(step3, 'Asia/Kolkata'); // +5:30
      const final = toIso(step4);

      expect(final).toBe(original);
    });

    it('preserves millisecond precision through conversions', () => {
      const original = '2025-01-20T15:30:45.123456789Z';

      const instant = Temporal.Instant.from(original);
      const zoned1 = toZonedTime(instant, 'America/New_York');
      const zoned2 = toZonedTime(zoned1, 'Asia/Tokyo');
      const backToInstant = toUtc(zoned2);

      // Temporal.Instant preserves nanosecond precision
      expect(backToInstant.epochNanoseconds).toBe(instant.epochNanoseconds);
    });
  });

  describe('cross-function consistency', () => {
    it('ensures toUtc and toIso produce consistent results', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T15:00:00-05:00[America/New_York]'
      );

      const viaToUtc = toUtc(zoned).toString();
      const viaToUtcString = toIso(zoned);

      expect(viaToUtc).toBe(viaToUtcString);
    });

    it('ensures all functions handle the same instant consistently', () => {
      const isoString = '2025-06-15T10:30:00Z';
      const instant = Temporal.Instant.from(isoString);
      const zoned = Temporal.ZonedDateTime.from(`${isoString}[UTC]`);

      // All functions should produce identical UTC strings
      expect(toIso(instant)).toBe(isoString);
      expect(toIso(zoned)).toBe(isoString);
      expect(toUtc(isoString).toString()).toBe(isoString);
      expect(toUtc(zoned).toString()).toBe(isoString);
    });

    it('ensures toZonedTime produces identical instants from all input types', () => {
      const isoString = '2025-01-20T12:00:00Z';
      const instant = Temporal.Instant.from(isoString);
      const zonedUTC = Temporal.ZonedDateTime.from(`${isoString}[UTC]`);

      const fromString = toZonedTime(isoString, 'America/New_York');
      const fromInstant = toZonedTime(instant, 'America/New_York');
      const fromZoned = toZonedTime(zonedUTC, 'America/New_York');

      // All should represent the same instant
      expect(toIso(fromString)).toBe(isoString);
      expect(toIso(fromInstant)).toBe(isoString);
      expect(toIso(fromZoned)).toBe(isoString);

      // All should have identical epoch milliseconds
      expect(fromString.epochMilliseconds).toBe(fromInstant.epochMilliseconds);
      expect(fromString.epochMilliseconds).toBe(fromZoned.epochMilliseconds);
    });
  });
});
