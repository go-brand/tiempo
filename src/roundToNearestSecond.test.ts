import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { roundToNearestSecond } from './roundToNearestSecond';

describe('roundToNearestSecond', () => {
  describe('default mode (round)', () => {
    it('rounds down when milliseconds < 500', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:37:42.499[America/New_York]'
      );
      const result = roundToNearestSecond(time);

      expect(result.second).toBe(42);
      expect(result.millisecond).toBe(0);
    });

    it('rounds up when milliseconds >= 500', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:37:42.500[America/New_York]'
      );
      const result = roundToNearestSecond(time);

      expect(result.second).toBe(43);
      expect(result.millisecond).toBe(0);
    });

    it('rounds up when milliseconds > 500', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:37:42.567[America/New_York]'
      );
      const result = roundToNearestSecond(time);

      expect(result.second).toBe(43);
      expect(result.millisecond).toBe(0);
    });

    it('preserves exact second (no rounding needed)', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:37:42[America/New_York]'
      );
      const result = roundToNearestSecond(time);

      expect(result.second).toBe(42);
      expect(result.millisecond).toBe(0);
    });

    it('handles rounding across minute boundary', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:37:59.600[America/New_York]'
      );
      const result = roundToNearestSecond(time);

      expect(result.minute).toBe(38);
      expect(result.second).toBe(0);
    });
  });

  describe('mode: ceil', () => {
    it('always rounds up (1 millisecond past)', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:37:42.001[America/New_York]'
      );
      const result = roundToNearestSecond(time, { mode: 'ceil' });

      expect(result.second).toBe(43);
      expect(result.millisecond).toBe(0);
    });

    it('preserves exact second (no rounding)', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:37:42[America/New_York]'
      );
      const result = roundToNearestSecond(time, { mode: 'ceil' });

      expect(result.second).toBe(42);
      expect(result.millisecond).toBe(0);
    });
  });

  describe('mode: floor', () => {
    it('always rounds down (999 milliseconds)', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:37:42.999[America/New_York]'
      );
      const result = roundToNearestSecond(time, { mode: 'floor' });

      expect(result.second).toBe(42);
      expect(result.millisecond).toBe(0);
    });

    it('preserves exact second (no rounding)', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:37:42[America/New_York]'
      );
      const result = roundToNearestSecond(time, { mode: 'floor' });

      expect(result.second).toBe(42);
      expect(result.millisecond).toBe(0);
    });

    it('removes sub-second precision', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:37:42.123456789[America/New_York]'
      );
      const result = roundToNearestSecond(time, { mode: 'floor' });

      expect(result.second).toBe(42);
      expect(result.millisecond).toBe(0);
      expect(result.microsecond).toBe(0);
      expect(result.nanosecond).toBe(0);
    });
  });

  describe('nearestTo option', () => {
    it('rounds to 10-second intervals', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:37:42[America/New_York]'
      );
      const result = roundToNearestSecond(time, { nearestTo: 10 });

      expect(result.second).toBe(40);
    });

    it('rounds to 10-second intervals with ceil', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:37:42[America/New_York]'
      );
      const result = roundToNearestSecond(time, { mode: 'ceil', nearestTo: 10 });

      expect(result.second).toBe(50);
    });

    it('rounds to 10-second intervals with floor', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:37:48[America/New_York]'
      );
      const result = roundToNearestSecond(time, {
        mode: 'floor',
        nearestTo: 10,
      });

      expect(result.second).toBe(40);
    });

    it('rounds to 15-second intervals', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:37:22[America/New_York]'
      );
      const result = roundToNearestSecond(time, { nearestTo: 15 });

      expect(result.second).toBe(15);
    });

    it('rounds to 30-second intervals', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:37:42[America/New_York]'
      );
      const result = roundToNearestSecond(time, { nearestTo: 30 });

      expect(result.second).toBe(30);
    });

    it('rounds to 5-second intervals', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:37:42[America/New_York]'
      );
      const result = roundToNearestSecond(time, { nearestTo: 5 });

      expect(result.second).toBe(40);
    });

    it('handles 10-second slots crossing minute boundary', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:37:55[America/New_York]'
      );
      const result = roundToNearestSecond(time, { mode: 'ceil', nearestTo: 10 });

      expect(result.minute).toBe(38);
      expect(result.second).toBe(0);
    });
  });

  describe('from Temporal.Instant', () => {
    it('rounds instant to nearest second (UTC)', () => {
      const instant = Temporal.Instant.from('2025-01-20T14:37:42.567Z');
      const result = roundToNearestSecond(instant);

      expect(result.second).toBe(43);
      expect(result.millisecond).toBe(0);
      expect(result.timeZoneId).toBe('UTC');
    });
  });

  describe('timezone preservation', () => {
    it('preserves America/New_York timezone', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:37:42.567-05:00[America/New_York]'
      );
      const result = roundToNearestSecond(time);

      expect(result.timeZoneId).toBe('America/New_York');
    });
  });

  describe('real-world scenarios', () => {
    it('video timestamp - round to 10-second markers', () => {
      const timestamp = Temporal.ZonedDateTime.from(
        '2025-01-20T00:02:37[UTC]'
      );
      const marker = roundToNearestSecond(timestamp, { nearestTo: 10 });

      expect(marker.minute).toBe(2);
      expect(marker.second).toBe(40);
    });

    it('logging - remove sub-second precision', () => {
      const logTime = Temporal.ZonedDateTime.from(
        '2025-01-20T14:37:42.123456789[America/New_York]'
      );
      const cleanTime = roundToNearestSecond(logTime, { mode: 'floor' });

      expect(cleanTime.millisecond).toBe(0);
      expect(cleanTime.microsecond).toBe(0);
      expect(cleanTime.nanosecond).toBe(0);
    });

    it('countdown timer - round up to next second', () => {
      const currentTime = Temporal.ZonedDateTime.from(
        '2025-01-20T14:37:42.100[America/New_York]'
      );
      const nextSecond = roundToNearestSecond(currentTime, { mode: 'ceil' });

      expect(nextSecond.second).toBe(43);
    });
  });
});
