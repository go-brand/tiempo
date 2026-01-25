import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { endOfDay } from './endOfDay';

describe('endOfDay', () => {
  describe('from Temporal.Instant', () => {
    it('returns end of day in UTC', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const end = endOfDay(instant);

      expect(end).toBeInstanceOf(Temporal.ZonedDateTime);
      expect(end.year).toBe(2025);
      expect(end.month).toBe(1);
      expect(end.day).toBe(20);
      expect(end.hour).toBe(23);
      expect(end.minute).toBe(59);
      expect(end.second).toBe(59);
      expect(end.millisecond).toBe(999);
      expect(end.microsecond).toBe(999);
      expect(end.nanosecond).toBe(999);
      expect(end.timeZoneId).toBe('UTC');
    });

    it('returns last nanosecond before next day', () => {
      const instant = Temporal.Instant.from('2025-01-20T00:00:00Z');
      const end = endOfDay(instant);

      // Adding one nanosecond should roll over to next day
      const nextDay = end.add({ nanoseconds: 1 });
      expect(nextDay.day).toBe(21);
      expect(nextDay.hour).toBe(0);
      expect(nextDay.minute).toBe(0);
      expect(nextDay.second).toBe(0);
      expect(nextDay.nanosecond).toBe(0);
    });

    it('works with instant at different times', () => {
      const morning = Temporal.Instant.from('2025-01-20T08:00:00Z');
      const afternoon = Temporal.Instant.from('2025-01-20T16:30:45Z');
      const evening = Temporal.Instant.from('2025-01-20T23:00:00Z');

      const endMorning = endOfDay(morning);
      const endAfternoon = endOfDay(afternoon);
      const endEvening = endOfDay(evening);

      // All should return the same end of day (Jan 20 in UTC)
      expect(endMorning.toString()).toBe(endAfternoon.toString());
      expect(endMorning.toString()).toBe(endEvening.toString());
      expect(endMorning.day).toBe(20);
      expect(endMorning.hour).toBe(23);
    });
  });

  describe('from Temporal.ZonedDateTime', () => {
    it('returns end of day in same timezone', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T15:30:00-05:00[America/New_York]'
      );
      const end = endOfDay(zoned);

      expect(end.year).toBe(2025);
      expect(end.month).toBe(1);
      expect(end.day).toBe(20);
      expect(end.hour).toBe(23);
      expect(end.minute).toBe(59);
      expect(end.second).toBe(59);
      expect(end.millisecond).toBe(999);
      expect(end.microsecond).toBe(999);
      expect(end.nanosecond).toBe(999);
      expect(end.timeZoneId).toBe('America/New_York');
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

      const endMorning = endOfDay(morning);
      const endAfternoon = endOfDay(afternoon);
      const endEvening = endOfDay(evening);

      // All should return the exact same instant (end of Jan 20 in NY)
      expect(endMorning.toString()).toBe(endAfternoon.toString());
      expect(endMorning.toString()).toBe(endEvening.toString());
    });

    it('handles different timezones', () => {
      const tokyo = Temporal.ZonedDateTime.from(
        '2025-01-20T15:00:00+09:00[Asia/Tokyo]'
      );
      const ny = Temporal.ZonedDateTime.from(
        '2025-01-20T15:00:00-05:00[America/New_York]'
      );

      const endTokyo = endOfDay(tokyo);
      const endNY = endOfDay(ny);

      expect(endTokyo.timeZoneId).toBe('Asia/Tokyo');
      expect(endTokyo.day).toBe(20);
      expect(endTokyo.hour).toBe(23);

      expect(endNY.timeZoneId).toBe('America/New_York');
      expect(endNY.day).toBe(20);
      expect(endNY.hour).toBe(23);

      // Different timezones = different instants
      expect(endTokyo.toInstant().toString()).not.toBe(
        endNY.toInstant().toString()
      );
    });

    it('converts to different timezone explicitly', () => {
      // Want end of day in New York? Convert first
      const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const nyTime = instant.toZonedDateTimeISO('America/New_York');
      const end = endOfDay(nyTime);

      expect(end.timeZoneId).toBe('America/New_York');
      expect(end.day).toBe(20);
      expect(end.hour).toBe(23);
    });
  });

  describe('DST transitions', () => {
    it('handles spring forward DST transition', () => {
      // March 9, 2025: DST begins in New York (2 AM -> 3 AM)
      const beforeDst = Temporal.ZonedDateTime.from(
        '2025-03-09T01:00:00-05:00[America/New_York]'
      );
      const end = endOfDay(beforeDst);

      expect(end.day).toBe(9);
      expect(end.hour).toBe(23);
      expect(end.minute).toBe(59);
      expect(end.second).toBe(59);
    });

    it('handles fall back DST transition', () => {
      // November 2, 2025: DST ends in New York (2 AM -> 1 AM)
      const duringDst = Temporal.ZonedDateTime.from(
        '2025-11-02T01:00:00-04:00[America/New_York]'
      );
      const end = endOfDay(duringDst);

      expect(end.day).toBe(2);
      expect(end.hour).toBe(23);
      expect(end.minute).toBe(59);
      expect(end.second).toBe(59);
    });
  });

  describe('from Temporal.PlainDate', () => {
    it('returns end of day in specified timezone', () => {
      const date = Temporal.PlainDate.from('2025-01-20');
      const end = endOfDay(date, 'America/New_York');

      expect(end).toBeInstanceOf(Temporal.ZonedDateTime);
      expect(end.year).toBe(2025);
      expect(end.month).toBe(1);
      expect(end.day).toBe(20);
      expect(end.hour).toBe(23);
      expect(end.minute).toBe(59);
      expect(end.second).toBe(59);
      expect(end.millisecond).toBe(999);
      expect(end.microsecond).toBe(999);
      expect(end.nanosecond).toBe(999);
      expect(end.timeZoneId).toBe('America/New_York');
    });

    it('same PlainDate produces different instants for different timezones', () => {
      const date = Temporal.PlainDate.from('2025-01-20');
      const endTokyo = endOfDay(date, 'Asia/Tokyo');
      const endNY = endOfDay(date, 'America/New_York');

      // Same calendar date, but different instants
      expect(endTokyo.day).toBe(20);
      expect(endNY.day).toBe(20);
      expect(endTokyo.toInstant().toString()).not.toBe(
        endNY.toInstant().toString()
      );

      // Tokyo end of day happens before NY end of day
      expect(
        Temporal.Instant.compare(endTokyo.toInstant(), endNY.toInstant())
      ).toBe(-1);
    });

    it('works with UTC timezone', () => {
      const date = Temporal.PlainDate.from('2025-01-20');
      const end = endOfDay(date, 'UTC');

      expect(end.day).toBe(20);
      expect(end.hour).toBe(23);
      expect(end.minute).toBe(59);
      expect(end.second).toBe(59);
      expect(end.timeZoneId).toBe('UTC');
    });

    it('handles leap year February 29', () => {
      const date = Temporal.PlainDate.from('2024-02-29');
      const end = endOfDay(date, 'America/New_York');

      expect(end.year).toBe(2024);
      expect(end.month).toBe(2);
      expect(end.day).toBe(29);
      expect(end.hour).toBe(23);
    });

    it('adding one nanosecond rolls over to next day', () => {
      const date = Temporal.PlainDate.from('2025-01-20');
      const end = endOfDay(date, 'America/New_York');

      const nextDay = end.add({ nanoseconds: 1 });
      expect(nextDay.day).toBe(21);
      expect(nextDay.hour).toBe(0);
      expect(nextDay.minute).toBe(0);
      expect(nextDay.second).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('handles end of month', () => {
      const instant = Temporal.Instant.from('2025-01-31T12:00:00Z');
      const end = endOfDay(instant);

      expect(end.day).toBe(31);
      expect(end.hour).toBe(23);
      expect(end.timeZoneId).toBe('UTC');
    });

    it('handles end of year', () => {
      const instant = Temporal.Instant.from('2025-12-31T12:00:00Z');
      const end = endOfDay(instant);

      expect(end.year).toBe(2025);
      expect(end.month).toBe(12);
      expect(end.day).toBe(31);
      expect(end.hour).toBe(23);
      expect(end.timeZoneId).toBe('UTC');
    });

    it('handles leap year February 29', () => {
      const instant = Temporal.Instant.from('2024-02-29T12:00:00Z');
      const end = endOfDay(instant);

      expect(end.year).toBe(2024);
      expect(end.month).toBe(2);
      expect(end.day).toBe(29);
      expect(end.hour).toBe(23);
      expect(end.timeZoneId).toBe('UTC');
    });
  });
});
