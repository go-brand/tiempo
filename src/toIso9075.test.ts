import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { toIso9075 } from './toIso9075';
import { toZonedTime } from './toZonedTime';

describe('toIso9075', () => {
  describe('default behavior (UTC, complete)', () => {
    it('formats ZonedDateTime converting to UTC', () => {
      // 7pm New York (EDT) = 11pm UTC
      const zoned = Temporal.ZonedDateTime.from(
        '2019-09-18T19:00:52-04:00[America/New_York]'
      );
      expect(toIso9075(zoned)).toBe('2019-09-18 23:00:52');
    });

    it('formats Instant in UTC', () => {
      const instant = Temporal.Instant.from('2019-09-18T19:00:52Z');
      expect(toIso9075(instant)).toBe('2019-09-18 19:00:52');
    });

    it('pads single-digit values', () => {
      const zoned = Temporal.ZonedDateTime.from('2019-01-05T09:05:03[UTC]');
      expect(toIso9075(zoned)).toBe('2019-01-05 09:05:03');
    });
  });

  describe('mode option', () => {
    it('local mode preserves local time', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T15:00:00-05:00[America/New_York]'
      );
      expect(toIso9075(zoned, { mode: 'local' })).toBe('2025-01-20 15:00:00');
    });

    it('local mode with different timezones', () => {
      const tokyo = Temporal.ZonedDateTime.from(
        '2025-01-20T09:00:00+09:00[Asia/Tokyo]'
      );
      expect(toIso9075(tokyo, { mode: 'local' })).toBe('2025-01-20 09:00:00');
      // 9am Tokyo = midnight UTC
      expect(toIso9075(tokyo, { mode: 'utc' })).toBe('2025-01-20 00:00:00');
    });
  });

  describe('representation option', () => {
    const zoned = Temporal.ZonedDateTime.from('2019-09-18T19:00:52[UTC]');

    it('date only', () => {
      expect(toIso9075(zoned, { representation: 'date' })).toBe('2019-09-18');
    });

    it('time only', () => {
      expect(toIso9075(zoned, { representation: 'time' })).toBe('19:00:52');
    });
  });

  describe('combined options', () => {
    it('local mode with date representation', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T15:30:45-05:00[America/New_York]'
      );
      expect(
        toIso9075(zoned, { mode: 'local', representation: 'date' })
      ).toBe('2025-01-20');
    });

    it('utc mode with time representation', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T15:30:45-05:00[America/New_York]'
      );
      // 15:30 EST = 20:30 UTC
      expect(toIso9075(zoned, { mode: 'utc', representation: 'time' })).toBe(
        '20:30:45'
      );
    });
  });

  describe('Instant with representation', () => {
    it('supports date and time representations', () => {
      const instant = Temporal.Instant.from('2025-01-20T20:00:00Z');
      expect(toIso9075(instant, { representation: 'date' })).toBe('2025-01-20');
      expect(toIso9075(instant, { representation: 'time' })).toBe('20:00:00');
    });
  });

  describe('edge cases', () => {
    it('handles years before 1000 (no 4-digit padding)', () => {
      // Year 999 should output as "999" not "0999"
      const zoned = Temporal.ZonedDateTime.from('0999-06-15T12:00:00[UTC]');
      expect(toIso9075(zoned)).toBe('999-06-15 12:00:00');
    });

    it('drops sub-second precision (SQL DATETIME compatibility)', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T15:30:45.123456789[UTC]'
      );
      expect(toIso9075(zoned)).toBe('2025-01-20 15:30:45');
    });

    it('handles midnight boundary crossing date', () => {
      // 11pm New York = 4am UTC next day (EST is UTC-5)
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T23:00:00-05:00[America/New_York]'
      );
      expect(toIso9075(zoned)).toBe('2025-01-21 04:00:00');
      expect(toIso9075(zoned, { mode: 'local' })).toBe('2025-01-20 23:00:00');
    });
  });

  describe('integration with toZonedTime', () => {
    it('round-trips through timezone conversion', () => {
      const utc = '2025-01-20T20:00:00Z';
      const ny = toZonedTime(utc, 'America/New_York');

      // UTC mode: back to original UTC time
      expect(toIso9075(ny)).toBe('2025-01-20 20:00:00');

      // Local mode: 8pm UTC = 3pm Eastern (EST is UTC-5)
      expect(toIso9075(ny, { mode: 'local' })).toBe('2025-01-20 15:00:00');
    });
  });
});
