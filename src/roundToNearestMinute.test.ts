import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { roundToNearestMinute } from './roundToNearestMinute';

describe('roundToNearestMinute', () => {
  describe('default mode (round)', () => {
    it('rounds down when seconds < 30', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:37:29[America/New_York]'
      );
      const result = roundToNearestMinute(time);

      expect(result.hour).toBe(14);
      expect(result.minute).toBe(37);
      expect(result.second).toBe(0);
    });

    it('rounds up when seconds >= 30', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:37:30[America/New_York]'
      );
      const result = roundToNearestMinute(time);

      expect(result.minute).toBe(38);
      expect(result.second).toBe(0);
    });

    it('rounds up when seconds > 30', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:37:42[America/New_York]'
      );
      const result = roundToNearestMinute(time);

      expect(result.minute).toBe(38);
      expect(result.second).toBe(0);
    });

    it('preserves exact minute (no rounding needed)', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:37:00[America/New_York]'
      );
      const result = roundToNearestMinute(time);

      expect(result.minute).toBe(37);
      expect(result.second).toBe(0);
    });

    it('handles rounding across hour boundary', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:59:45[America/New_York]'
      );
      const result = roundToNearestMinute(time);

      expect(result.hour).toBe(15);
      expect(result.minute).toBe(0);
    });
  });

  describe('mode: ceil', () => {
    it('always rounds up (1 second past)', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:37:01[America/New_York]'
      );
      const result = roundToNearestMinute(time, { mode: 'ceil' });

      expect(result.minute).toBe(38);
      expect(result.second).toBe(0);
    });

    it('preserves exact minute (no rounding)', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:37:00[America/New_York]'
      );
      const result = roundToNearestMinute(time, { mode: 'ceil' });

      expect(result.minute).toBe(37);
      expect(result.second).toBe(0);
    });
  });

  describe('mode: floor', () => {
    it('always rounds down (59 seconds)', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:37:59[America/New_York]'
      );
      const result = roundToNearestMinute(time, { mode: 'floor' });

      expect(result.minute).toBe(37);
      expect(result.second).toBe(0);
    });

    it('preserves exact minute (no rounding)', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:37:00[America/New_York]'
      );
      const result = roundToNearestMinute(time, { mode: 'floor' });

      expect(result.minute).toBe(37);
      expect(result.second).toBe(0);
    });
  });

  describe('nearestTo option - 15-minute slots', () => {
    it('rounds to nearest 15-minute mark', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:37:00[America/New_York]'
      );
      const result = roundToNearestMinute(time, { nearestTo: 15 });

      expect(result.hour).toBe(14);
      expect(result.minute).toBe(30); // 37 is closer to 30 than 45
    });

    it('rounds to next 15-minute slot with ceil', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:37:00[America/New_York]'
      );
      const result = roundToNearestMinute(time, { mode: 'ceil', nearestTo: 15 });

      expect(result.hour).toBe(14);
      expect(result.minute).toBe(45);
    });

    it('rounds to current 15-minute slot with floor', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:44:00[America/New_York]'
      );
      const result = roundToNearestMinute(time, {
        mode: 'floor',
        nearestTo: 15,
      });

      expect(result.hour).toBe(14);
      expect(result.minute).toBe(30);
    });

    it('ceil at exact slot boundary stays at boundary', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:30:00[America/New_York]'
      );
      const result = roundToNearestMinute(time, { mode: 'ceil', nearestTo: 15 });

      expect(result.minute).toBe(30);
    });

    it('handles 15-minute slots crossing hour boundary', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:50:00[America/New_York]'
      );
      const result = roundToNearestMinute(time, { mode: 'ceil', nearestTo: 15 });

      expect(result.hour).toBe(15);
      expect(result.minute).toBe(0);
    });
  });

  describe('nearestTo option - 30-minute slots', () => {
    it('rounds to nearest 30-minute mark', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:20:00[America/New_York]'
      );
      const result = roundToNearestMinute(time, { nearestTo: 30 });

      expect(result.minute).toBe(30);
    });

    it('rounds to next 30-minute slot with ceil', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:01:00[America/New_York]'
      );
      const result = roundToNearestMinute(time, { mode: 'ceil', nearestTo: 30 });

      expect(result.minute).toBe(30);
    });

    it('rounds to current 30-minute slot with floor', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:45:00[America/New_York]'
      );
      const result = roundToNearestMinute(time, {
        mode: 'floor',
        nearestTo: 30,
      });

      expect(result.minute).toBe(30);
    });
  });

  describe('nearestTo option - other intervals', () => {
    it('rounds to 5-minute intervals', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:37:00[America/New_York]'
      );
      const result = roundToNearestMinute(time, { nearestTo: 5 });

      expect(result.minute).toBe(35);
    });

    it('rounds to 10-minute intervals', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:37:00[America/New_York]'
      );
      const result = roundToNearestMinute(time, { nearestTo: 10 });

      expect(result.minute).toBe(40);
    });

    it('rounds to 20-minute intervals', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:37:00[America/New_York]'
      );
      const result = roundToNearestMinute(time, { nearestTo: 20 });

      expect(result.minute).toBe(40);
    });
  });

  describe('from Temporal.Instant', () => {
    it('rounds instant to nearest minute (UTC)', () => {
      const instant = Temporal.Instant.from('2025-01-20T14:37:45Z');
      const result = roundToNearestMinute(instant);

      expect(result.minute).toBe(38);
      expect(result.second).toBe(0);
      expect(result.timeZoneId).toBe('UTC');
    });
  });

  describe('timezone preservation', () => {
    it('preserves America/New_York timezone', () => {
      const time = Temporal.ZonedDateTime.from(
        '2025-01-20T14:37:42-05:00[America/New_York]'
      );
      const result = roundToNearestMinute(time);

      expect(result.timeZoneId).toBe('America/New_York');
    });
  });

  describe('real-world scenarios', () => {
    it('booking system - next available 15-minute slot', () => {
      const userRequest = Temporal.ZonedDateTime.from(
        '2025-01-20T14:37:00[America/New_York]'
      );
      const nextSlot = roundToNearestMinute(userRequest, {
        mode: 'ceil',
        nearestTo: 15,
      });

      expect(nextSlot.hour).toBe(14);
      expect(nextSlot.minute).toBe(45);
    });

    it('booking system - start of current 15-minute slot', () => {
      const currentTime = Temporal.ZonedDateTime.from(
        '2025-01-20T14:37:00[America/New_York]'
      );
      const slotStart = roundToNearestMinute(currentTime, {
        mode: 'floor',
        nearestTo: 15,
      });

      expect(slotStart.hour).toBe(14);
      expect(slotStart.minute).toBe(30);
    });

    it('billing - round up to 30-minute increments', () => {
      const sessionEnd = Temporal.ZonedDateTime.from(
        '2025-01-20T11:07:00[America/New_York]'
      );
      const billableEnd = roundToNearestMinute(sessionEnd, {
        mode: 'ceil',
        nearestTo: 30,
      });

      expect(billableEnd.hour).toBe(11);
      expect(billableEnd.minute).toBe(30);
    });

    it('calendar display - round to nearest 15 minutes', () => {
      const eventTime = Temporal.ZonedDateTime.from(
        '2025-01-20T09:07:00[America/New_York]'
      );
      const displayTime = roundToNearestMinute(eventTime, { nearestTo: 15 });

      expect(displayTime.hour).toBe(9);
      expect(displayTime.minute).toBe(0);
    });
  });
});
