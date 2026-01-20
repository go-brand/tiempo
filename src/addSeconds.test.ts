import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { addSeconds } from './addSeconds';

describe('addSeconds', () => {
  describe('from Temporal.Instant', () => {
    it('adds positive seconds to instant', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const result = addSeconds(instant, 45);

      expect(result).toBeInstanceOf(Temporal.ZonedDateTime);
      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
      expect(result.hour).toBe(12);
      expect(result.minute).toBe(0);
      expect(result.second).toBe(45);
      expect(result.timeZoneId).toBe('UTC');
    });

    it('adds negative seconds (subtracts) to instant', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:45Z');
      const result = addSeconds(instant, -30);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
      expect(result.hour).toBe(12);
      expect(result.minute).toBe(0);
      expect(result.second).toBe(15);
      expect(result.timeZoneId).toBe('UTC');
    });

    it('adds zero seconds (no change)', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:30Z');
      const result = addSeconds(instant, 0);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
      expect(result.hour).toBe(12);
      expect(result.minute).toBe(0);
      expect(result.second).toBe(30);
      expect(result.timeZoneId).toBe('UTC');
    });

    it('preserves time components when adding seconds', () => {
      const instant = Temporal.Instant.from('2025-01-20T14:30:45.123456789Z');
      const result = addSeconds(instant, 10);

      expect(result.hour).toBe(14);
      expect(result.minute).toBe(30);
      expect(result.second).toBe(55);
      expect(result.millisecond).toBe(123);
      expect(result.microsecond).toBe(456);
      expect(result.nanosecond).toBe(789);
    });

    it('handles adding seconds across minute boundaries', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:50Z');
      const result = addSeconds(instant, 20);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
      expect(result.hour).toBe(12);
      expect(result.minute).toBe(1);
      expect(result.second).toBe(10);
    });

    it('handles subtracting seconds across minute boundaries', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:10Z');
      const result = addSeconds(instant, -20);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
      expect(result.hour).toBe(11);
      expect(result.minute).toBe(59);
      expect(result.second).toBe(50);
    });

    it('handles adding 60+ seconds (crossing minutes)', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const result = addSeconds(instant, 125);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
      expect(result.hour).toBe(12);
      expect(result.minute).toBe(2);
      expect(result.second).toBe(5);
    });

    it('handles adding seconds across hour boundaries', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:59:50Z');
      const result = addSeconds(instant, 20);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
      expect(result.hour).toBe(13);
      expect(result.minute).toBe(0);
      expect(result.second).toBe(10);
    });

    it('handles adding seconds across day boundaries', () => {
      const instant = Temporal.Instant.from('2025-01-20T23:59:50Z');
      const result = addSeconds(instant, 20);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(21);
      expect(result.hour).toBe(0);
      expect(result.minute).toBe(0);
      expect(result.second).toBe(10);
    });

    it('handles large second values (86400+ seconds = 1+ days)', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const result = addSeconds(instant, 86400); // 24 hours

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(21);
      expect(result.hour).toBe(12);
      expect(result.minute).toBe(0);
      expect(result.second).toBe(0);
    });
  });

  describe('from Temporal.ZonedDateTime', () => {
    it('adds seconds and preserves America/New_York timezone', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T15:30:00-05:00[America/New_York]'
      );
      const result = addSeconds(zoned, 90);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
      expect(result.hour).toBe(15);
      expect(result.minute).toBe(31);
      expect(result.second).toBe(30);
      expect(result.timeZoneId).toBe('America/New_York');
    });

    it('adds seconds and preserves Asia/Tokyo timezone', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T09:00:00+09:00[Asia/Tokyo]'
      );
      const result = addSeconds(zoned, 45);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
      expect(result.hour).toBe(9);
      expect(result.minute).toBe(0);
      expect(result.second).toBe(45);
      expect(result.timeZoneId).toBe('Asia/Tokyo');
    });

    it('adds negative seconds and preserves timezone', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T10:00:30-05:00[America/New_York]'
      );
      const result = addSeconds(zoned, -45);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
      expect(result.hour).toBe(9);
      expect(result.minute).toBe(59);
      expect(result.second).toBe(45);
      expect(result.timeZoneId).toBe('America/New_York');
    });

    it('handles adding seconds through DST transition', () => {
      // Seconds before DST
      const zoned = Temporal.ZonedDateTime.from(
        '2025-03-09T01:59:55-05:00[America/New_York]'
      );
      const result = addSeconds(zoned, 10);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(3);
      expect(result.day).toBe(9);
      expect(result.hour).toBe(3);
      expect(result.minute).toBe(0);
      expect(result.second).toBe(5);
      expect(result.offset).toBe('-04:00');
    });
  });

  describe('real-world scenarios', () => {
    it('calculates video timestamps', () => {
      const videoStart = Temporal.Instant.from('2025-01-20T00:00:00Z');
      const intro = addSeconds(videoStart, 15);
      const chapter1 = addSeconds(videoStart, 90);
      const chapter2 = addSeconds(videoStart, 300);

      expect(intro.second).toBe(15);
      expect(chapter1.minute).toBe(1);
      expect(chapter1.second).toBe(30);
      expect(chapter2.minute).toBe(5);
      expect(chapter2.second).toBe(0);
    });

    it('tracks countdown timer', () => {
      const deadline = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const minus30 = addSeconds(deadline, -30);
      const minus10 = addSeconds(deadline, -10);
      const minus5 = addSeconds(deadline, -5);

      expect(minus30.minute).toBe(59);
      expect(minus30.second).toBe(30);
      expect(minus10.second).toBe(50);
      expect(minus5.second).toBe(55);
    });

    it('calculates race split times', () => {
      const raceStart = Temporal.ZonedDateTime.from(
        '2025-01-20T08:00:00-05:00[America/New_York]'
      );
      const km1 = addSeconds(raceStart, 245); // 4:05
      const km5 = addSeconds(raceStart, 1225); // 20:25
      const km10 = addSeconds(raceStart, 2450); // 40:50

      expect(km1.minute).toBe(4);
      expect(km1.second).toBe(5);
      expect(km5.minute).toBe(20);
      expect(km5.second).toBe(25);
      expect(km10.minute).toBe(40);
      expect(km10.second).toBe(50);
    });

    it('schedules ad breaks in streaming', () => {
      const streamStart = Temporal.Instant.from('2025-01-20T20:00:00Z');
      const ad1 = addSeconds(streamStart, 600); // 10 min
      const ad2 = addSeconds(streamStart, 1800); // 30 min
      const ad3 = addSeconds(streamStart, 3600); // 60 min

      expect(ad1.minute).toBe(10);
      expect(ad2.minute).toBe(30);
      expect(ad3.hour).toBe(21);
      expect(ad3.minute).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('handles adding exactly 60 seconds', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:30Z');
      const result = addSeconds(instant, 60);

      expect(result.minute).toBe(1);
      expect(result.second).toBe(30);
    });

    it('handles subtracting exactly 60 seconds', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:30Z');
      const result = addSeconds(instant, -60);

      expect(result.hour).toBe(11);
      expect(result.minute).toBe(59);
      expect(result.second).toBe(30);
    });

    it('handles very large second additions (100000+ seconds)', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const result = addSeconds(instant, 100000);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(21);
      expect(result.hour).toBe(15);
      expect(result.minute).toBe(46);
      expect(result.second).toBe(40);
    });

    it('handles very large negative second additions', () => {
      const instant = Temporal.Instant.from('2025-01-21T15:46:40Z');
      const result = addSeconds(instant, -100000);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
      expect(result.hour).toBe(12);
      expect(result.minute).toBe(0);
      expect(result.second).toBe(0);
    });

    it('handles adding seconds from 00:00:00', () => {
      const instant = Temporal.Instant.from('2025-01-20T00:00:00Z');
      const result = addSeconds(instant, 1);

      expect(result.day).toBe(20);
      expect(result.hour).toBe(0);
      expect(result.minute).toBe(0);
      expect(result.second).toBe(1);
    });

    it('handles subtracting seconds from 00:00:00', () => {
      const instant = Temporal.Instant.from('2025-01-20T00:00:00Z');
      const result = addSeconds(instant, -1);

      expect(result.day).toBe(19);
      expect(result.hour).toBe(23);
      expect(result.minute).toBe(59);
      expect(result.second).toBe(59);
    });

    it('handles year boundary crossing with seconds', () => {
      const instant = Temporal.Instant.from('2024-12-31T23:59:55Z');
      const result = addSeconds(instant, 10);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(1);
      expect(result.hour).toBe(0);
      expect(result.minute).toBe(0);
      expect(result.second).toBe(5);
    });

    it('handles adding seconds with fractional precision preservation', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00.999999999Z');
      const result = addSeconds(instant, 1);

      expect(result.second).toBe(1);
      expect(result.millisecond).toBe(999);
      expect(result.microsecond).toBe(999);
      expect(result.nanosecond).toBe(999);
    });
  });
});
