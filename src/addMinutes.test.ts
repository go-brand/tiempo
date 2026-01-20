import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { addMinutes } from './addMinutes';

describe('addMinutes', () => {
  describe('from Temporal.Instant', () => {
    it('adds positive minutes to instant', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const result = addMinutes(instant, 45);

      expect(result).toBeInstanceOf(Temporal.ZonedDateTime);
      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
      expect(result.hour).toBe(12);
      expect(result.minute).toBe(45);
      expect(result.second).toBe(0);
      expect(result.timeZoneId).toBe('UTC');
    });

    it('adds negative minutes (subtracts) to instant', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:30:00Z');
      const result = addMinutes(instant, -15);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
      expect(result.hour).toBe(12);
      expect(result.minute).toBe(15);
      expect(result.timeZoneId).toBe('UTC');
    });

    it('adds zero minutes (no change)', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:30:00Z');
      const result = addMinutes(instant, 0);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
      expect(result.hour).toBe(12);
      expect(result.minute).toBe(30);
      expect(result.timeZoneId).toBe('UTC');
    });

    it('preserves time components when adding minutes', () => {
      const instant = Temporal.Instant.from('2025-01-20T14:30:45.123456789Z');
      const result = addMinutes(instant, 20);

      expect(result.hour).toBe(14);
      expect(result.minute).toBe(50);
      expect(result.second).toBe(45);
      expect(result.millisecond).toBe(123);
      expect(result.microsecond).toBe(456);
      expect(result.nanosecond).toBe(789);
    });

    it('handles adding minutes across hour boundaries', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:50:00Z');
      const result = addMinutes(instant, 20);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
      expect(result.hour).toBe(13);
      expect(result.minute).toBe(10);
    });

    it('handles subtracting minutes across hour boundaries', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:10:00Z');
      const result = addMinutes(instant, -20);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
      expect(result.hour).toBe(11);
      expect(result.minute).toBe(50);
    });

    it('handles adding 60+ minutes (crossing hours)', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const result = addMinutes(instant, 125);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
      expect(result.hour).toBe(14);
      expect(result.minute).toBe(5);
    });

    it('handles adding minutes across day boundaries', () => {
      const instant = Temporal.Instant.from('2025-01-20T23:50:00Z');
      const result = addMinutes(instant, 20);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(21);
      expect(result.hour).toBe(0);
      expect(result.minute).toBe(10);
    });

    it('handles adding minutes across month boundaries', () => {
      const instant = Temporal.Instant.from('2025-01-31T23:50:00Z');
      const result = addMinutes(instant, 20);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(2);
      expect(result.day).toBe(1);
      expect(result.hour).toBe(0);
      expect(result.minute).toBe(10);
    });

    it('handles large minute values (1440+ minutes = 1+ days)', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const result = addMinutes(instant, 1440); // 24 hours

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(21);
      expect(result.hour).toBe(12);
      expect(result.minute).toBe(0);
    });
  });

  describe('from Temporal.ZonedDateTime', () => {
    it('adds minutes and preserves America/New_York timezone', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T15:30:00-05:00[America/New_York]'
      );
      const result = addMinutes(zoned, 90);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
      expect(result.hour).toBe(17);
      expect(result.minute).toBe(0);
      expect(result.timeZoneId).toBe('America/New_York');
    });

    it('adds minutes and preserves Asia/Tokyo timezone', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T09:00:00+09:00[Asia/Tokyo]'
      );
      const result = addMinutes(zoned, 45);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
      expect(result.hour).toBe(9);
      expect(result.minute).toBe(45);
      expect(result.timeZoneId).toBe('Asia/Tokyo');
    });

    it('adds negative minutes and preserves timezone', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T10:30:00-05:00[America/New_York]'
      );
      const result = addMinutes(zoned, -45);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
      expect(result.hour).toBe(9);
      expect(result.minute).toBe(45);
      expect(result.timeZoneId).toBe('America/New_York');
    });

    it('handles adding minutes through spring DST transition', () => {
      // 1:55 AM EST, adding 10 minutes crosses into DST
      const zoned = Temporal.ZonedDateTime.from(
        '2025-03-09T01:55:00-05:00[America/New_York]'
      );
      const result = addMinutes(zoned, 10);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(3);
      expect(result.day).toBe(9);
      expect(result.hour).toBe(3); // Skips 2 AM hour
      expect(result.minute).toBe(5);
      expect(result.offset).toBe('-04:00');
      expect(result.timeZoneId).toBe('America/New_York');
    });

    it('handles adding minutes through fall DST transition', () => {
      // 1:55 AM EDT, DST ends at 2 AM
      const zoned = Temporal.ZonedDateTime.from(
        '2025-11-02T01:55:00-04:00[America/New_York]'
      );
      const result = addMinutes(zoned, 10);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(11);
      expect(result.day).toBe(2);
      expect(result.hour).toBe(1); // 1 AM happens twice
      expect(result.minute).toBe(5);
      expect(result.offset).toBe('-05:00'); // Now EST
      expect(result.timeZoneId).toBe('America/New_York');
    });
  });

  describe('real-world scenarios', () => {
    it('calculates cooking timer durations', () => {
      const startCooking = Temporal.Instant.from('2025-01-20T18:00:00Z');
      const stage1 = addMinutes(startCooking, 15); // Preheat
      const stage2 = addMinutes(startCooking, 30); // Add ingredients
      const done = addMinutes(startCooking, 45); // Done

      expect(stage1.minute).toBe(15);
      expect(stage2.minute).toBe(30);
      expect(done.minute).toBe(45);
    });

    it('tracks meeting buffer times', () => {
      const meetingStart = Temporal.ZonedDateTime.from(
        '2025-01-20T14:00:00-05:00[America/New_York]'
      );
      const meetingEnd = addMinutes(meetingStart, 30);
      const bufferEnd = addMinutes(meetingEnd, 5); // 5-min buffer

      expect(meetingEnd.hour).toBe(14);
      expect(meetingEnd.minute).toBe(30);
      expect(bufferEnd.hour).toBe(14);
      expect(bufferEnd.minute).toBe(35);
    });

    it('schedules presentation time slots', () => {
      const eventStart = Temporal.Instant.from('2025-01-20T09:00:00Z');
      const slot1End = addMinutes(eventStart, 15);
      const slot2End = addMinutes(eventStart, 30);
      const slot3End = addMinutes(eventStart, 45);
      const eventEnd = addMinutes(eventStart, 60);

      expect(slot1End.minute).toBe(15);
      expect(slot2End.minute).toBe(30);
      expect(slot3End.minute).toBe(45);
      expect(eventEnd.hour).toBe(10);
      expect(eventEnd.minute).toBe(0);
    });

    it('calculates transit time', () => {
      const departure = Temporal.ZonedDateTime.from(
        '2025-01-20T08:30:00-05:00[America/New_York]'
      );
      const arrival = addMinutes(departure, 37); // 37-minute commute

      expect(arrival.hour).toBe(9);
      expect(arrival.minute).toBe(7);
      expect(arrival.timeZoneId).toBe('America/New_York');
    });
  });

  describe('edge cases', () => {
    it('handles adding exactly 60 minutes', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:30:00Z');
      const result = addMinutes(instant, 60);

      expect(result.hour).toBe(13);
      expect(result.minute).toBe(30);
    });

    it('handles subtracting exactly 60 minutes', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:30:00Z');
      const result = addMinutes(instant, -60);

      expect(result.hour).toBe(11);
      expect(result.minute).toBe(30);
    });

    it('handles very large minute additions (10000+ minutes)', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const result = addMinutes(instant, 10000);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(27);
      expect(result.hour).toBe(10);
      expect(result.minute).toBe(40);
    });

    it('handles very large negative minute additions', () => {
      const instant = Temporal.Instant.from('2025-01-27T10:40:00Z');
      const result = addMinutes(instant, -10000);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
      expect(result.hour).toBe(12);
      expect(result.minute).toBe(0);
    });

    it('handles adding minutes from 00:00', () => {
      const instant = Temporal.Instant.from('2025-01-20T00:00:00Z');
      const result = addMinutes(instant, 1);

      expect(result.day).toBe(20);
      expect(result.hour).toBe(0);
      expect(result.minute).toBe(1);
    });

    it('handles subtracting minutes from 00:00', () => {
      const instant = Temporal.Instant.from('2025-01-20T00:00:00Z');
      const result = addMinutes(instant, -1);

      expect(result.day).toBe(19);
      expect(result.hour).toBe(23);
      expect(result.minute).toBe(59);
    });

    it('handles year boundary crossing with minutes', () => {
      const instant = Temporal.Instant.from('2024-12-31T23:55:00Z');
      const result = addMinutes(instant, 10);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(1);
      expect(result.hour).toBe(0);
      expect(result.minute).toBe(5);
    });
  });
});
