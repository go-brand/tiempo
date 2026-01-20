import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { addDays } from './addDays';

describe('addDays', () => {
  describe('from Temporal.Instant', () => {
    it('adds positive days to instant', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const result = addDays(instant, 5);

      expect(result).toBeInstanceOf(Temporal.ZonedDateTime);
      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(25);
      expect(result.hour).toBe(12);
      expect(result.minute).toBe(0);
      expect(result.second).toBe(0);
      expect(result.timeZoneId).toBe('UTC');
    });

    it('adds negative days (subtracts) to instant', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const result = addDays(instant, -7);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(13);
      expect(result.hour).toBe(12);
      expect(result.timeZoneId).toBe('UTC');
    });

    it('adds zero days (no change)', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const result = addDays(instant, 0);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
      expect(result.hour).toBe(12);
      expect(result.timeZoneId).toBe('UTC');
    });

    it('preserves time components when adding days', () => {
      const instant = Temporal.Instant.from('2025-01-20T14:30:45.123456789Z');
      const result = addDays(instant, 3);

      expect(result.hour).toBe(14);
      expect(result.minute).toBe(30);
      expect(result.second).toBe(45);
      expect(result.millisecond).toBe(123);
      expect(result.microsecond).toBe(456);
      expect(result.nanosecond).toBe(789);
    });

    it('handles adding multiple days forward', () => {
      const instant = Temporal.Instant.from('2025-01-01T00:00:00Z');
      const result = addDays(instant, 45);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(2);
      expect(result.day).toBe(15);
    });

    it('handles subtracting multiple days backward', () => {
      const instant = Temporal.Instant.from('2025-02-15T00:00:00Z');
      const result = addDays(instant, -45);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(1);
    });

    it('handles adding days across month boundaries', () => {
      const instant = Temporal.Instant.from('2025-01-28T12:00:00Z');
      const result = addDays(instant, 7);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(2);
      expect(result.day).toBe(4);
    });

    it('handles adding days across year boundaries', () => {
      const instant = Temporal.Instant.from('2024-12-25T12:00:00Z');
      const result = addDays(instant, 10);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(4);
    });

    it('handles large day values (365+ days)', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const result = addDays(instant, 365);

      expect(result.year).toBe(2026);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
    });
  });

  describe('from Temporal.ZonedDateTime', () => {
    it('adds days and preserves America/New_York timezone', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T15:30:00-05:00[America/New_York]'
      );
      const result = addDays(zoned, 10);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(30);
      expect(result.hour).toBe(15);
      expect(result.minute).toBe(30);
      expect(result.timeZoneId).toBe('America/New_York');
    });

    it('adds days and preserves Asia/Tokyo timezone', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T09:00:00+09:00[Asia/Tokyo]'
      );
      const result = addDays(zoned, 7);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(27);
      expect(result.hour).toBe(9);
      expect(result.timeZoneId).toBe('Asia/Tokyo');
    });

    it('adds negative days and preserves timezone', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-02-10T10:00:00-05:00[America/New_York]'
      );
      const result = addDays(zoned, -15);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(26);
      expect(result.hour).toBe(10);
      expect(result.timeZoneId).toBe('America/New_York');
    });

    it('handles adding days across spring DST transition (March 9, 2025)', () => {
      // Day before DST transition
      const zoned = Temporal.ZonedDateTime.from(
        '2025-03-08T14:00:00-05:00[America/New_York]'
      );
      const result = addDays(zoned, 2);

      // After DST transition (spring forward to -04:00)
      expect(result.year).toBe(2025);
      expect(result.month).toBe(3);
      expect(result.day).toBe(10);
      expect(result.hour).toBe(14); // Clock time preserved
      expect(result.offset).toBe('-04:00'); // Offset changed
      expect(result.timeZoneId).toBe('America/New_York');
    });

    it('handles adding days across fall DST transition (November 2, 2025)', () => {
      // Day before DST transition
      const zoned = Temporal.ZonedDateTime.from(
        '2025-11-01T14:00:00-04:00[America/New_York]'
      );
      const result = addDays(zoned, 2);

      // After DST transition (fall back to -05:00)
      expect(result.year).toBe(2025);
      expect(result.month).toBe(11);
      expect(result.day).toBe(3);
      expect(result.hour).toBe(14); // Clock time preserved
      expect(result.offset).toBe('-05:00'); // Offset changed
      expect(result.timeZoneId).toBe('America/New_York');
    });
  });

  describe('real-world scenarios', () => {
    it('calculates project deadlines', () => {
      const projectStart = Temporal.Instant.from('2025-01-06T00:00:00Z');
      const milestone1 = addDays(projectStart, 30); // 30-day sprint
      const milestone2 = addDays(projectStart, 60);
      const finalDeadline = addDays(projectStart, 90);

      expect(milestone1.day).toBe(5); // Feb 5
      expect(milestone1.month).toBe(2);
      expect(milestone2.day).toBe(7); // Mar 7
      expect(milestone2.month).toBe(3);
      expect(finalDeadline.day).toBe(6); // Apr 6
      expect(finalDeadline.month).toBe(4);
    });

    it('tracks vacation days', () => {
      const vacationStart = Temporal.ZonedDateTime.from(
        '2025-07-01T00:00:00-04:00[America/New_York]'
      );
      const vacationEnd = addDays(vacationStart, 14);

      expect(vacationEnd.month).toBe(7);
      expect(vacationEnd.day).toBe(15);
      expect(vacationEnd.timeZoneId).toBe('America/New_York');
    });

    it('calculates delivery estimates', () => {
      const orderDate = Temporal.Instant.from('2025-01-20T15:00:00Z');
      const standardShipping = addDays(orderDate, 5);
      const expressShipping = addDays(orderDate, 2);

      expect(standardShipping.day).toBe(25);
      expect(expressShipping.day).toBe(22);
    });
  });

  describe('edge cases', () => {
    it('handles leap year transitions', () => {
      const leapDay = Temporal.Instant.from('2024-02-29T12:00:00Z');
      const result = addDays(leapDay, 365);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(2);
      expect(result.day).toBe(28); // 365 days later (not leap year)
    });

    it('handles month end dates correctly', () => {
      const instant = Temporal.Instant.from('2025-01-31T12:00:00Z');
      const result = addDays(instant, 1);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(2);
      expect(result.day).toBe(1);
      expect(result.hour).toBe(12);
    });

    it('handles adding days from Feb 28 to Mar 1 (non-leap year)', () => {
      const instant = Temporal.Instant.from('2025-02-28T12:00:00Z');
      const result = addDays(instant, 1);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(3);
      expect(result.day).toBe(1);
    });

    it('handles adding days from Feb 28 to Mar 1 (leap year)', () => {
      const instant = Temporal.Instant.from('2024-02-28T12:00:00Z');
      const result = addDays(instant, 2);

      expect(result.year).toBe(2024);
      expect(result.month).toBe(3);
      expect(result.day).toBe(1);
    });

    it('handles very large day additions (1000+ days)', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const result = addDays(instant, 1000);

      expect(result.year).toBe(2027);
      expect(result.month).toBe(10);
      expect(result.day).toBe(17);
    });

    it('handles very large negative day additions', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const result = addDays(instant, -1000);

      expect(result.year).toBe(2022);
      expect(result.month).toBe(4);
      expect(result.day).toBe(26);
    });
  });
});
