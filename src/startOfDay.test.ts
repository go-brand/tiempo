import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { startOfDay } from './startOfDay';

describe('startOfDay', () => {
  describe('from Temporal.Instant', () => {
    it('returns start of day in UTC', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const start = startOfDay(instant);

      expect(start).toBeInstanceOf(Temporal.ZonedDateTime);
      expect(start.year).toBe(2025);
      expect(start.month).toBe(1);
      expect(start.day).toBe(20);
      expect(start.hour).toBe(0);
      expect(start.minute).toBe(0);
      expect(start.second).toBe(0);
      expect(start.millisecond).toBe(0);
      expect(start.microsecond).toBe(0);
      expect(start.nanosecond).toBe(0);
      expect(start.timeZoneId).toBe('UTC');
    });

    it('works with instant at different times', () => {
      const morning = Temporal.Instant.from('2025-01-20T08:00:00Z');
      const afternoon = Temporal.Instant.from('2025-01-20T16:30:45Z');
      const evening = Temporal.Instant.from('2025-01-20T23:00:00Z');

      const startMorning = startOfDay(morning);
      const startAfternoon = startOfDay(afternoon);
      const startEvening = startOfDay(evening);

      // All should return the same start of day (Jan 20 in UTC)
      expect(startMorning.toString()).toBe(startAfternoon.toString());
      expect(startMorning.toString()).toBe(startEvening.toString());
      expect(startMorning.day).toBe(20);
      expect(startMorning.hour).toBe(0);
    });

    it('handles instant at midnight', () => {
      const midnight = Temporal.Instant.from('2025-01-20T00:00:00Z');
      const start = startOfDay(midnight);

      expect(start.hour).toBe(0);
      expect(start.minute).toBe(0);
      expect(start.second).toBe(0);
    });
  });

  describe('from Temporal.ZonedDateTime', () => {
    it('returns start of day in same timezone', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T15:30:00-05:00[America/New_York]'
      );
      const start = startOfDay(zoned);

      expect(start.year).toBe(2025);
      expect(start.month).toBe(1);
      expect(start.day).toBe(20);
      expect(start.hour).toBe(0);
      expect(start.minute).toBe(0);
      expect(start.second).toBe(0);
      expect(start.millisecond).toBe(0);
      expect(start.microsecond).toBe(0);
      expect(start.nanosecond).toBe(0);
      expect(start.timeZoneId).toBe('America/New_York');
    });

    it('works with any time during the day', () => {
      const morning = Temporal.ZonedDateTime.from(
        '2025-01-20T08:00:00-05:00[America/New_York]'
      );
      const afternoon = Temporal.ZonedDateTime.from(
        '2025-01-20T16:30:45-05:00[America/New_York]'
      );
      const evening = Temporal.ZonedDateTime.from(
        '2025-01-20T23:00:00-05:00[America/New_York]'
      );

      const startMorning = startOfDay(morning);
      const startAfternoon = startOfDay(afternoon);
      const startEvening = startOfDay(evening);

      // All should return the exact same instant (start of Jan 20 in NY)
      expect(startMorning.toString()).toBe(startAfternoon.toString());
      expect(startMorning.toString()).toBe(startEvening.toString());
    });

    it('handles different timezones', () => {
      const tokyo = Temporal.ZonedDateTime.from(
        '2025-01-20T15:00:00+09:00[Asia/Tokyo]'
      );
      const ny = Temporal.ZonedDateTime.from(
        '2025-01-20T15:00:00-05:00[America/New_York]'
      );

      const startTokyo = startOfDay(tokyo);
      const startNY = startOfDay(ny);

      expect(startTokyo.timeZoneId).toBe('Asia/Tokyo');
      expect(startTokyo.day).toBe(20);
      expect(startTokyo.hour).toBe(0);

      expect(startNY.timeZoneId).toBe('America/New_York');
      expect(startNY.day).toBe(20);
      expect(startNY.hour).toBe(0);

      // Different timezones = different instants
      expect(startTokyo.toInstant().toString()).not.toBe(
        startNY.toInstant().toString()
      );
    });

    it('converts to different timezone explicitly', () => {
      // Want start of day in New York? Convert first
      const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const nyTime = instant.toZonedDateTimeISO('America/New_York');
      const start = startOfDay(nyTime);

      expect(start.timeZoneId).toBe('America/New_York');
      expect(start.day).toBe(20);
      expect(start.hour).toBe(0);
    });
  });

  describe('DST transitions', () => {
    it('handles spring forward DST transition (midnight does not exist)', () => {
      // March 9, 2025: DST begins in New York (2 AM -> 3 AM)
      // Midnight exists, but 2 AM does not
      const beforeDst = Temporal.ZonedDateTime.from(
        '2025-03-09T01:00:00-05:00[America/New_York]'
      );
      const start = startOfDay(beforeDst);

      expect(start.day).toBe(9);
      expect(start.hour).toBe(0);
      expect(start.minute).toBe(0);
      expect(start.second).toBe(0);
    });

    it('handles fall back DST transition', () => {
      // November 2, 2025: DST ends in New York (2 AM -> 1 AM)
      const duringDst = Temporal.ZonedDateTime.from(
        '2025-11-02T01:00:00-04:00[America/New_York]'
      );
      const start = startOfDay(duringDst);

      expect(start.day).toBe(2);
      expect(start.hour).toBe(0);
      expect(start.minute).toBe(0);
      expect(start.second).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('handles start of month', () => {
      const instant = Temporal.Instant.from('2025-01-01T12:00:00Z');
      const start = startOfDay(instant);

      expect(start.day).toBe(1);
      expect(start.hour).toBe(0);
      expect(start.timeZoneId).toBe('UTC');
    });

    it('handles start of year', () => {
      const instant = Temporal.Instant.from('2025-01-01T12:00:00Z');
      const start = startOfDay(instant);

      expect(start.year).toBe(2025);
      expect(start.month).toBe(1);
      expect(start.day).toBe(1);
      expect(start.hour).toBe(0);
      expect(start.timeZoneId).toBe('UTC');
    });

    it('handles leap year February 29', () => {
      const instant = Temporal.Instant.from('2024-02-29T12:00:00Z');
      const start = startOfDay(instant);

      expect(start.year).toBe(2024);
      expect(start.month).toBe(2);
      expect(start.day).toBe(29);
      expect(start.hour).toBe(0);
      expect(start.timeZoneId).toBe('UTC');
    });
  });
});
