import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { toUtcString } from './toUtcString';
import { toZonedTime } from './toZonedTime';

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
