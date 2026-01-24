import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { toIso } from './toIso';
import { toZonedTime } from './toZonedTime';

describe('toIso', () => {
  describe('from Temporal.ZonedDateTime', () => {
    it('converts ZonedDateTime to UTC ISO string', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T15:00:00-05:00[America/New_York]'
      );
      expect(toIso(zoned)).toBe('2025-01-20T20:00:00Z');
    });

    it('preserves milliseconds', () => {
      const utcString = '2025-01-20T20:00:00.123Z';
      const zoned = toZonedTime(utcString, 'Europe/Paris');
      expect(toIso(zoned)).toBe(utcString);
    });

    it('preserves the same instant across timezone conversions', () => {
      const original = '2025-06-15T14:30:00Z';
      const ny = toZonedTime(original, 'America/New_York');
      const tokyo = toZonedTime(original, 'Asia/Tokyo');

      expect(toIso(ny)).toBe(original);
      expect(toIso(tokyo)).toBe(original);
    });

    it('preserves sub-millisecond precision', () => {
      const utcString = '2025-01-20T20:00:00.123456789Z';
      const zoned = toZonedTime(utcString, 'America/New_York');
      expect(toIso(zoned)).toBe(utcString);
    });

    it('handles midnight boundary', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T00:00:00+09:00[Asia/Tokyo]'
      );
      // Midnight Tokyo = 15:00 UTC previous day
      expect(toIso(zoned)).toBe('2025-01-19T15:00:00Z');
    });
  });

  describe('offset mode', () => {
    it('returns local time with offset suffix', () => {
      const negative = Temporal.ZonedDateTime.from(
        '2025-01-20T15:00:00-05:00[America/New_York]'
      );
      const positive = Temporal.ZonedDateTime.from(
        '2025-01-20T21:00:00+01:00[Europe/Paris]'
      );

      expect(toIso(negative, { mode: 'offset' })).toBe(
        '2025-01-20T15:00:00-05:00'
      );
      expect(toIso(positive, { mode: 'offset' })).toBe(
        '2025-01-20T21:00:00+01:00'
      );
    });

    it('preserves milliseconds', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T15:00:00.123-05:00[America/New_York]'
      );
      expect(toIso(zoned, { mode: 'offset' })).toBe(
        '2025-01-20T15:00:00.123-05:00'
      );
    });
  });

  describe('from Temporal.Instant', () => {
    it('converts Instant to UTC ISO string', () => {
      const instant = Temporal.Instant.from('2025-01-20T20:00:00Z');
      expect(toIso(instant)).toBe('2025-01-20T20:00:00Z');
    });

    it('preserves sub-millisecond precision', () => {
      const instant = Temporal.Instant.from('2025-01-20T20:00:00.123456789Z');
      expect(toIso(instant)).toBe('2025-01-20T20:00:00.123456789Z');
    });
  });
});
