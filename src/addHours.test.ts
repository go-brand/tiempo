import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { addHours } from './addHours';

describe('addHours', () => {
  describe('from Temporal.Instant', () => {
    it('adds positive hours to instant', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const result = addHours(instant, 6);

      expect(result).toBeInstanceOf(Temporal.ZonedDateTime);
      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
      expect(result.hour).toBe(18);
      expect(result.minute).toBe(0);
      expect(result.second).toBe(0);
      expect(result.timeZoneId).toBe('UTC');
    });

    it('adds negative hours (subtracts) to instant', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const result = addHours(instant, -5);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
      expect(result.hour).toBe(7);
      expect(result.timeZoneId).toBe('UTC');
    });

    it('adds zero hours (no change)', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const result = addHours(instant, 0);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
      expect(result.hour).toBe(12);
      expect(result.timeZoneId).toBe('UTC');
    });

    it('preserves time components when adding hours', () => {
      const instant = Temporal.Instant.from('2025-01-20T14:30:45.123456789Z');
      const result = addHours(instant, 3);

      expect(result.hour).toBe(17);
      expect(result.minute).toBe(30);
      expect(result.second).toBe(45);
      expect(result.millisecond).toBe(123);
      expect(result.microsecond).toBe(456);
      expect(result.nanosecond).toBe(789);
    });

    it('handles adding hours across day boundaries', () => {
      const instant = Temporal.Instant.from('2025-01-20T22:00:00Z');
      const result = addHours(instant, 5);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(21);
      expect(result.hour).toBe(3);
    });

    it('handles subtracting hours across day boundaries', () => {
      const instant = Temporal.Instant.from('2025-01-20T02:00:00Z');
      const result = addHours(instant, -5);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(19);
      expect(result.hour).toBe(21);
    });

    it('handles adding 24+ hours (multiple days)', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const result = addHours(instant, 48);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(22);
      expect(result.hour).toBe(12);
    });

    it('handles adding hours across month boundaries', () => {
      const instant = Temporal.Instant.from('2025-01-31T20:00:00Z');
      const result = addHours(instant, 10);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(2);
      expect(result.day).toBe(1);
      expect(result.hour).toBe(6);
    });

    it('handles adding hours across year boundaries', () => {
      const instant = Temporal.Instant.from('2024-12-31T20:00:00Z');
      const result = addHours(instant, 10);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(1);
      expect(result.hour).toBe(6);
    });

    it('handles large hour values (100+ hours)', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const result = addHours(instant, 168); // 7 days

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(27);
      expect(result.hour).toBe(12);
    });
  });

  describe('from Temporal.ZonedDateTime', () => {
    it('adds hours and preserves America/New_York timezone', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T15:30:00-05:00[America/New_York]'
      );
      const result = addHours(zoned, 8);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
      expect(result.hour).toBe(23);
      expect(result.minute).toBe(30);
      expect(result.timeZoneId).toBe('America/New_York');
    });

    it('adds hours and preserves Asia/Tokyo timezone', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T09:00:00+09:00[Asia/Tokyo]'
      );
      const result = addHours(zoned, 12);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
      expect(result.hour).toBe(21);
      expect(result.timeZoneId).toBe('Asia/Tokyo');
    });

    it('adds negative hours and preserves timezone', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T10:00:00-05:00[America/New_York]'
      );
      const result = addHours(zoned, -3);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
      expect(result.hour).toBe(7);
      expect(result.timeZoneId).toBe('America/New_York');
    });

    it('handles adding hours through spring DST transition (March 9, 2025)', () => {
      // Before DST: 1:00 AM EST
      const zoned = Temporal.ZonedDateTime.from(
        '2025-03-09T01:00:00-05:00[America/New_York]'
      );
      const result = addHours(zoned, 2);

      // After DST: 4:00 AM EDT (clock skips 2 AM -> 3 AM)
      expect(result.year).toBe(2025);
      expect(result.month).toBe(3);
      expect(result.day).toBe(9);
      expect(result.hour).toBe(4); // 1 AM + 2 hours = 4 AM (3 AM skipped)
      expect(result.offset).toBe('-04:00');
      expect(result.timeZoneId).toBe('America/New_York');
    });

    it('handles adding hours through fall DST transition (November 2, 2025)', () => {
      // Before DST: 1:00 AM EDT
      const zoned = Temporal.ZonedDateTime.from(
        '2025-11-02T01:00:00-04:00[America/New_York]'
      );
      const result = addHours(zoned, 2);

      // After DST: 2:00 AM EST (1 AM happens twice)
      expect(result.year).toBe(2025);
      expect(result.month).toBe(11);
      expect(result.day).toBe(2);
      expect(result.hour).toBe(2);
      expect(result.offset).toBe('-05:00'); // Now EST
      expect(result.timeZoneId).toBe('America/New_York');
    });

    it('handles adding hours across midnight with DST', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-03-08T23:00:00-05:00[America/New_York]'
      );
      const result = addHours(zoned, 4);

      // Crosses into March 9 and DST transition
      expect(result.year).toBe(2025);
      expect(result.month).toBe(3);
      expect(result.day).toBe(9);
      expect(result.hour).toBe(4);
      expect(result.offset).toBe('-04:00');
    });
  });

  describe('real-world scenarios', () => {
    it('calculates meeting times across timezones', () => {
      const meeting = Temporal.ZonedDateTime.from(
        '2025-01-20T09:00:00-08:00[America/Los_Angeles]'
      );

      // 3-hour meeting
      const meetingEnd = addHours(meeting, 3);

      expect(meetingEnd.hour).toBe(12);
      expect(meetingEnd.minute).toBe(0);
      expect(meetingEnd.timeZoneId).toBe('America/Los_Angeles');
    });

    it('tracks flight durations', () => {
      const departure = Temporal.ZonedDateTime.from(
        '2025-03-15T14:00:00-04:00[America/New_York]'
      );
      const flightDuration = 6; // 6-hour flight
      const arrival = addHours(departure, flightDuration);

      expect(arrival.hour).toBe(20);
      expect(arrival.day).toBe(15);
      expect(arrival.timeZoneId).toBe('America/New_York');
    });

    it('schedules shift rotations (8-hour shifts)', () => {
      const shiftStart = Temporal.Instant.from('2025-01-20T06:00:00Z');
      const morningEnd = addHours(shiftStart, 8); // 6 AM - 2 PM
      const afternoonEnd = addHours(shiftStart, 16); // 2 PM - 10 PM
      const nightEnd = addHours(shiftStart, 24); // 10 PM - 6 AM

      expect(morningEnd.hour).toBe(14);
      expect(afternoonEnd.hour).toBe(22);
      expect(nightEnd.hour).toBe(6);
      expect(nightEnd.day).toBe(21);
    });

    it('calculates time until deadline', () => {
      const now = Temporal.Instant.from('2025-01-20T09:00:00Z');
      const deadline = addHours(now, 72); // 72 hours = 3 days

      expect(deadline.day).toBe(23);
      expect(deadline.hour).toBe(9);
    });
  });

  describe('edge cases', () => {
    it('handles adding exactly 24 hours', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const result = addHours(instant, 24);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(21);
      expect(result.hour).toBe(12);
    });

    it('handles subtracting exactly 24 hours', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const result = addHours(instant, -24);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(19);
      expect(result.hour).toBe(12);
    });

    it('handles very large hour additions (1000+ hours)', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const result = addHours(instant, 1000);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(3);
      expect(result.day).toBe(3); // ~41 days later
      expect(result.hour).toBe(4);
    });

    it('handles very large negative hour additions', () => {
      const instant = Temporal.Instant.from('2025-02-28T20:00:00Z');
      const result = addHours(instant, -1000);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(18);
      expect(result.hour).toBe(4);
    });

    it('handles fractional day rollover (23 hours)', () => {
      const instant = Temporal.Instant.from('2025-01-20T00:00:00Z');
      const result = addHours(instant, 23);

      expect(result.day).toBe(20); // Still same day
      expect(result.hour).toBe(23);
    });

    it('handles DST spring forward missing hour', () => {
      // At 2 AM, clocks spring forward to 3 AM
      const beforeDST = Temporal.ZonedDateTime.from(
        '2025-03-09T01:30:00-05:00[America/New_York]'
      );
      const result = addHours(beforeDST, 1);

      expect(result.hour).toBe(3); // 2:30 AM doesn't exist
      expect(result.minute).toBe(30);
      expect(result.offset).toBe('-04:00');
    });

    it('handles DST fall back repeated hour', () => {
      // At 2 AM, clocks fall back to 1 AM
      // First 1 AM (before fall back)
      const beforeFallBack = Temporal.ZonedDateTime.from(
        '2025-11-02T01:00:00-04:00[America/New_York]'
      );
      const result = addHours(beforeFallBack, 1);

      // Should be second 1 AM (after fall back)
      expect(result.hour).toBe(1);
      expect(result.offset).toBe('-05:00');
    });
  });
});
