import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { roundToNearestHour } from './roundToNearestHour';

describe('roundToNearestHour', () => {
  describe('default mode (round)', () => {
    it('rounds down when minutes < 30', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:29:59[America/New_York]'
      );
      const result = roundToNearestHour(time);

      expect(result.hour).toBe(14);
      expect(result.minute).toBe(0);
      expect(result.second).toBe(0);
    });

    it('rounds up when minutes >= 30', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:00[America/New_York]'
      );
      const result = roundToNearestHour(time);

      expect(result.hour).toBe(15);
      expect(result.minute).toBe(0);
    });

    it('rounds up when minutes > 30', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:37:42[America/New_York]'
      );
      const result = roundToNearestHour(time);

      expect(result.hour).toBe(15);
      expect(result.minute).toBe(0);
      expect(result.second).toBe(0);
    });

    it('preserves exact hour (no rounding needed)', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:00:00[America/New_York]'
      );
      const result = roundToNearestHour(time);

      expect(result.hour).toBe(14);
      expect(result.minute).toBe(0);
    });

    it('handles rounding across day boundary', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T23:45:00[America/New_York]'
      );
      const result = roundToNearestHour(time);

      expect(result.day).toBe(21);
      expect(result.hour).toBe(0);
    });
  });

  describe('mode: ceil', () => {
    it('always rounds up (1 minute past)', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:01:00[America/New_York]'
      );
      const result = roundToNearestHour(time, { mode: 'ceil' });

      expect(result.hour).toBe(15);
      expect(result.minute).toBe(0);
    });

    it('preserves exact hour (no rounding)', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:00:00[America/New_York]'
      );
      const result = roundToNearestHour(time, { mode: 'ceil' });

      expect(result.hour).toBe(14);
      expect(result.minute).toBe(0);
    });

    it('rounds up even 1 second past', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:00:01[America/New_York]'
      );
      const result = roundToNearestHour(time, { mode: 'ceil' });

      expect(result.hour).toBe(15);
    });
  });

  describe('mode: floor', () => {
    it('always rounds down (59 minutes)', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:59:59[America/New_York]'
      );
      const result = roundToNearestHour(time, { mode: 'floor' });

      expect(result.hour).toBe(14);
      expect(result.minute).toBe(0);
    });

    it('preserves exact hour (no rounding)', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:00:00[America/New_York]'
      );
      const result = roundToNearestHour(time, { mode: 'floor' });

      expect(result.hour).toBe(14);
      expect(result.minute).toBe(0);
    });
  });

  describe('nearestTo option', () => {
    it('rounds to 6-hour blocks', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:00:00[America/New_York]'
      );
      const result = roundToNearestHour(time, { nearestTo: 6 });

      expect(result.hour).toBe(12); // Nearest to 12:00 (not 18:00)
      expect(result.minute).toBe(0);
    });

    it('rounds to 6-hour blocks with ceil', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:00:00[America/New_York]'
      );
      const result = roundToNearestHour(time, { mode: 'ceil', nearestTo: 6 });

      expect(result.hour).toBe(18);
      expect(result.minute).toBe(0);
    });

    it('rounds to 6-hour blocks with floor', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T17:00:00[America/New_York]'
      );
      const result = roundToNearestHour(time, { mode: 'floor', nearestTo: 6 });

      expect(result.hour).toBe(12);
    });

    it('rounds to 2-hour blocks', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T15:30:00[America/New_York]'
      );
      const result = roundToNearestHour(time, { nearestTo: 2 });

      expect(result.hour).toBe(16);
    });

    it('rounds to 12-hour blocks (half day)', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T07:00:00[America/New_York]'
      );
      const result = roundToNearestHour(time, { nearestTo: 12 });

      expect(result.hour).toBe(12);
    });
  });

  describe('from Temporal.Instant', () => {
    it('rounds instant to nearest hour (UTC)', () => {
      const instant = Temporal.Instant.from('2025-01-20T14:45:00Z');
      const result = roundToNearestHour(instant);

      expect(result.hour).toBe(15);
      expect(result.minute).toBe(0);
      expect(result.timeZoneId).toBe('UTC');
    });
  });

  describe('timezone preservation', () => {
    it('preserves America/New_York timezone', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:37:00-05:00[America/New_York]'
      );
      const result = roundToNearestHour(time);

      expect(result.timeZoneId).toBe('America/New_York');
    });

    it('preserves Asia/Tokyo timezone', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:37:00+09:00[Asia/Tokyo]'
      );
      const result = roundToNearestHour(time);

      expect(result.timeZoneId).toBe('Asia/Tokyo');
    });
  });

  describe('real-world scenarios', () => {
    it('shift scheduling - round to 6-hour shifts', () => {
      const clockIn = Temporal.ZonedDateTime.from(
        '2025-01-20T08:15:00[America/New_York]'
      );
      const shiftStart = roundToNearestHour(clockIn, {
        mode: 'floor',
        nearestTo: 6,
      });

      expect(shiftStart.hour).toBe(6);
    });

    it('display approximate time', () => {
      const exactTime = Temporal.ZonedDateTime.from(
        '2025-01-20T14:37:42[America/New_York]'
      );
      const approxTime = roundToNearestHour(exactTime);

      expect(approxTime.hour).toBe(15);
      expect(approxTime.toString()).toContain('15:00:00');
    });
  });
});
