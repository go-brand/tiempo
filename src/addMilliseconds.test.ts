import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { addMilliseconds } from './addMilliseconds';

describe('addMilliseconds', () => {
  describe('from Temporal.Instant', () => {
    it('adds positive milliseconds to instant', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00.000Z');
      const result = addMilliseconds(instant, 500);

      expect(result).toBeInstanceOf(Temporal.ZonedDateTime);
      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
      expect(result.hour).toBe(12);
      expect(result.minute).toBe(0);
      expect(result.second).toBe(0);
      expect(result.millisecond).toBe(500);
      expect(result.timeZoneId).toBe('UTC');
    });

    it('adds negative milliseconds (subtracts) to instant', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00.800Z');
      const result = addMilliseconds(instant, -300);

      expect(result.millisecond).toBe(500);
      expect(result.second).toBe(0);
    });

    it('adds zero milliseconds (no change)', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00.500Z');
      const result = addMilliseconds(instant, 0);

      expect(result.millisecond).toBe(500);
    });

    it('preserves microsecond and nanosecond precision', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00.123456789Z');
      const result = addMilliseconds(instant, 100);

      expect(result.millisecond).toBe(223);
      expect(result.microsecond).toBe(456);
      expect(result.nanosecond).toBe(789);
    });

    it('handles rollover to seconds (1000ms = 1s)', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00.800Z');
      const result = addMilliseconds(instant, 500);

      expect(result.second).toBe(1);
      expect(result.millisecond).toBe(300);
    });

    it('handles rollover across multiple seconds', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00.000Z');
      const result = addMilliseconds(instant, 2500);

      expect(result.second).toBe(2);
      expect(result.millisecond).toBe(500);
    });

    it('handles negative rollover from seconds', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:01.200Z');
      const result = addMilliseconds(instant, -500);

      expect(result.second).toBe(0);
      expect(result.millisecond).toBe(700);
    });

    it('handles adding milliseconds across minute boundaries', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:59.800Z');
      const result = addMilliseconds(instant, 300);

      expect(result.minute).toBe(1);
      expect(result.second).toBe(0);
      expect(result.millisecond).toBe(100);
    });

    it('handles large millisecond values crossing days', () => {
      const instant = Temporal.Instant.from('2025-01-20T23:59:59.000Z');
      const result = addMilliseconds(instant, 2000);

      expect(result.day).toBe(21);
      expect(result.hour).toBe(0);
      expect(result.minute).toBe(0);
      expect(result.second).toBe(1);
      expect(result.millisecond).toBe(0);
    });
  });

  describe('from Temporal.ZonedDateTime', () => {
    it('adds milliseconds and preserves timezone', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T15:30:00.000-05:00[America/New_York]'
      );
      const result = addMilliseconds(zoned, 750);

      expect(result.millisecond).toBe(750);
      expect(result.timeZoneId).toBe('America/New_York');
    });

    it('handles milliseconds through DST transition', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-03-09T01:59:59.500-05:00[America/New_York]'
      );
      const result = addMilliseconds(zoned, 600);

      expect(result.hour).toBe(3);
      expect(result.second).toBe(0);
      expect(result.millisecond).toBe(100);
      expect(result.offset).toBe('-04:00');
    });
  });

  describe('real-world scenarios', () => {
    it('tracks animation frame timing (60fps = ~16.67ms per frame)', () => {
      const frameStart = Temporal.Instant.from('2025-01-20T12:00:00.000Z');
      const frame1 = addMilliseconds(frameStart, 16);
      const frame2 = addMilliseconds(frameStart, 33);
      const frame60 = addMilliseconds(frameStart, 1000);

      expect(frame1.millisecond).toBe(16);
      expect(frame2.millisecond).toBe(33);
      expect(frame60.second).toBe(1);
      expect(frame60.millisecond).toBe(0);
    });

    it('measures performance timing', () => {
      const perfStart = Temporal.Instant.from('2025-01-20T12:00:00.000Z');
      const checkpoint1 = addMilliseconds(perfStart, 123);
      const checkpoint2 = addMilliseconds(perfStart, 456);
      const perfEnd = addMilliseconds(perfStart, 789);

      expect(checkpoint1.millisecond).toBe(123);
      expect(checkpoint2.millisecond).toBe(456);
      expect(perfEnd.millisecond).toBe(789);
    });

    it('calculates network latency', () => {
      const requestTime = Temporal.Instant.from('2025-01-20T12:00:00.000Z');
      const responseTime = addMilliseconds(requestTime, 87); // 87ms latency

      expect(responseTime.millisecond).toBe(87);
    });
  });

  describe('edge cases', () => {
    it('handles exactly 1000 milliseconds', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00.000Z');
      const result = addMilliseconds(instant, 1000);

      expect(result.second).toBe(1);
      expect(result.millisecond).toBe(0);
    });

    it('handles very large millisecond values (millions)', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00.000Z');
      const result = addMilliseconds(instant, 1000000); // 1000 seconds

      expect(result.minute).toBe(16);
      expect(result.second).toBe(40);
    });

    it('handles milliseconds with existing microsecond/nanosecond values', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00.999999999Z');
      const result = addMilliseconds(instant, 1);

      expect(result.second).toBe(1);
      expect(result.millisecond).toBe(0);
      expect(result.microsecond).toBe(999);
      expect(result.nanosecond).toBe(999);
    });

    it('handles negative milliseconds from zero', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00.000Z');
      const result = addMilliseconds(instant, -1);

      expect(result.second).toBe(59);
      expect(result.minute).toBe(59);
      expect(result.hour).toBe(11);
      expect(result.millisecond).toBe(999);
    });

    it('handles year boundary with milliseconds', () => {
      const instant = Temporal.Instant.from('2024-12-31T23:59:59.500Z');
      const result = addMilliseconds(instant, 600);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(1);
      expect(result.second).toBe(0);
      expect(result.millisecond).toBe(100);
    });

    it('handles precise millisecond addition without loss', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00.123Z');
      const result = addMilliseconds(instant, 456);

      expect(result.millisecond).toBe(579);
    });
  });
});
