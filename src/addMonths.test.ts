import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { addMonths } from './addMonths';

describe('addMonths', () => {
  describe('from Temporal.Instant', () => {
    it('adds positive months to instant', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const result = addMonths(instant, 3);

      expect(result).toBeInstanceOf(Temporal.ZonedDateTime);
      expect(result.year).toBe(2025);
      expect(result.month).toBe(4);
      expect(result.day).toBe(20);
      expect(result.hour).toBe(12);
      expect(result.minute).toBe(0);
      expect(result.second).toBe(0);
      expect(result.timeZoneId).toBe('UTC');
    });

    it('adds negative months (subtracts) to instant', () => {
      const instant = Temporal.Instant.from('2025-04-20T12:00:00Z');
      const result = addMonths(instant, -3);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
      expect(result.hour).toBe(12);
      expect(result.timeZoneId).toBe('UTC');
    });

    it('adds zero months (no change)', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const result = addMonths(instant, 0);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
      expect(result.hour).toBe(12);
      expect(result.timeZoneId).toBe('UTC');
    });

    it('preserves time components when adding months', () => {
      const instant = Temporal.Instant.from('2025-01-20T14:30:45.123456789Z');
      const result = addMonths(instant, 2);

      expect(result.hour).toBe(14);
      expect(result.minute).toBe(30);
      expect(result.second).toBe(45);
      expect(result.millisecond).toBe(123);
      expect(result.microsecond).toBe(456);
      expect(result.nanosecond).toBe(789);
    });

    it('handles adding 12+ months (crossing years)', () => {
      const instant = Temporal.Instant.from('2025-01-15T00:00:00Z');
      const result = addMonths(instant, 15);

      expect(result.year).toBe(2026);
      expect(result.month).toBe(4);
      expect(result.day).toBe(15);
    });

    it('handles subtracting months backward across years', () => {
      const instant = Temporal.Instant.from('2025-04-15T00:00:00Z');
      const result = addMonths(instant, -15);

      expect(result.year).toBe(2024);
      expect(result.month).toBe(1);
      expect(result.day).toBe(15);
    });

    it('handles adding months across year boundaries', () => {
      const instant = Temporal.Instant.from('2024-11-20T12:00:00Z');
      const result = addMonths(instant, 3);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(2);
      expect(result.day).toBe(20);
    });
  });

  describe('from Temporal.ZonedDateTime', () => {
    it('adds months and preserves America/New_York timezone', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T15:30:00-05:00[America/New_York]'
      );
      const result = addMonths(zoned, 6);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(7);
      expect(result.day).toBe(20);
      expect(result.hour).toBe(15);
      expect(result.minute).toBe(30);
      expect(result.timeZoneId).toBe('America/New_York');
    });

    it('adds months and preserves Asia/Tokyo timezone', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T09:00:00+09:00[Asia/Tokyo]'
      );
      const result = addMonths(zoned, 4);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(5);
      expect(result.day).toBe(20);
      expect(result.hour).toBe(9);
      expect(result.timeZoneId).toBe('Asia/Tokyo');
    });

    it('adds negative months and preserves timezone', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-06-15T10:00:00-04:00[America/New_York]'
      );
      const result = addMonths(zoned, -4);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(2);
      expect(result.day).toBe(15);
      expect(result.hour).toBe(10);
      expect(result.timeZoneId).toBe('America/New_York');
    });

    it('handles adding months across spring DST transition', () => {
      // January (EST -05:00)
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-15T14:00:00-05:00[America/New_York]'
      );
      const result = addMonths(zoned, 3);

      // April (EDT -04:00)
      expect(result.year).toBe(2025);
      expect(result.month).toBe(4);
      expect(result.day).toBe(15);
      expect(result.hour).toBe(14);
      expect(result.offset).toBe('-04:00');
      expect(result.timeZoneId).toBe('America/New_York');
    });

    it('handles adding months across fall DST transition', () => {
      // September (EDT -04:00)
      const zoned = Temporal.ZonedDateTime.from(
        '2025-09-15T14:00:00-04:00[America/New_York]'
      );
      const result = addMonths(zoned, 3);

      // December (EST -05:00)
      expect(result.year).toBe(2025);
      expect(result.month).toBe(12);
      expect(result.day).toBe(15);
      expect(result.hour).toBe(14);
      expect(result.offset).toBe('-05:00');
      expect(result.timeZoneId).toBe('America/New_York');
    });
  });

  describe('month-end edge cases', () => {
    it('handles Jan 31 + 1 month = Feb 28 (non-leap year)', () => {
      const instant = Temporal.Instant.from('2025-01-31T12:00:00Z');
      const result = addMonths(instant, 1);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(2);
      expect(result.day).toBe(28); // Constrained to Feb 28
      expect(result.hour).toBe(12);
    });

    it('handles Jan 31 + 1 month = Feb 29 (leap year)', () => {
      const instant = Temporal.Instant.from('2024-01-31T12:00:00Z');
      const result = addMonths(instant, 1);

      expect(result.year).toBe(2024);
      expect(result.month).toBe(2);
      expect(result.day).toBe(29); // Leap year
      expect(result.hour).toBe(12);
    });

    it('handles Jan 30 + 1 month = Feb 28 (non-leap year)', () => {
      const instant = Temporal.Instant.from('2025-01-30T12:00:00Z');
      const result = addMonths(instant, 1);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(2);
      expect(result.day).toBe(28);
    });

    it('handles Jan 29 + 1 month = Feb 28 (non-leap year)', () => {
      const instant = Temporal.Instant.from('2025-01-29T12:00:00Z');
      const result = addMonths(instant, 1);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(2);
      expect(result.day).toBe(28);
    });

    it('handles Mar 31 + 1 month = Apr 30', () => {
      const instant = Temporal.Instant.from('2025-03-31T12:00:00Z');
      const result = addMonths(instant, 1);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(4);
      expect(result.day).toBe(30); // April has 30 days
    });

    it('handles May 31 + 1 month = Jun 30', () => {
      const instant = Temporal.Instant.from('2025-05-31T12:00:00Z');
      const result = addMonths(instant, 1);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(6);
      expect(result.day).toBe(30); // June has 30 days
    });

    it('handles Aug 31 - 1 month = Jul 31', () => {
      const instant = Temporal.Instant.from('2025-08-31T12:00:00Z');
      const result = addMonths(instant, -1);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(7);
      expect(result.day).toBe(31); // July has 31 days
    });

    it('handles Mar 31 - 1 month = Feb 28', () => {
      const instant = Temporal.Instant.from('2025-03-31T12:00:00Z');
      const result = addMonths(instant, -1);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(2);
      expect(result.day).toBe(28); // Constrained to Feb 28
    });
  });

  describe('real-world scenarios', () => {
    it('calculates quarterly billing cycles', () => {
      const subscriptionStart = Temporal.Instant.from('2025-01-15T00:00:00Z');
      const q1End = addMonths(subscriptionStart, 3); // Q1
      const q2End = addMonths(subscriptionStart, 6); // Q2
      const q3End = addMonths(subscriptionStart, 9); // Q3
      const q4End = addMonths(subscriptionStart, 12); // Q4

      expect(q1End.month).toBe(4);
      expect(q1End.day).toBe(15);
      expect(q2End.month).toBe(7);
      expect(q3End.month).toBe(10);
      expect(q4End.year).toBe(2026);
      expect(q4End.month).toBe(1);
    });

    it('tracks pregnancy by month', () => {
      const conceptionDate = Temporal.Instant.from('2024-05-01T00:00:00Z');
      const month3 = addMonths(conceptionDate, 3);
      const month6 = addMonths(conceptionDate, 6);
      const month9 = addMonths(conceptionDate, 9);

      expect(month3.year).toBe(2024);
      expect(month3.month).toBe(8); // August
      expect(month6.month).toBe(11); // November
      expect(month9.year).toBe(2025);
      expect(month9.month).toBe(2); // February
    });

    it('schedules monthly meetings', () => {
      const firstMeeting = Temporal.ZonedDateTime.from(
        '2025-01-15T10:00:00-05:00[America/New_York]'
      );

      const meetings = [1, 2, 3, 4, 5, 6].map((n) =>
        addMonths(firstMeeting, n)
      );

      // Verify all meetings maintain day and time
      meetings.forEach((meeting) => {
        expect(meeting.day).toBe(15);
        expect(meeting.hour).toBe(10);
        expect(meeting.minute).toBe(0);
        expect(meeting.timeZoneId).toBe('America/New_York');
      });
    });
  });

  describe('edge cases', () => {
    it('handles leap year Feb 29 + 12 months = Feb 28 (next year)', () => {
      const leapDay = Temporal.Instant.from('2024-02-29T12:00:00Z');
      const result = addMonths(leapDay, 12);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(2);
      expect(result.day).toBe(28); // Not a leap year
    });

    it('handles leap year Feb 29 + 48 months = Feb 29 (4 years later)', () => {
      const leapDay = Temporal.Instant.from('2024-02-29T12:00:00Z');
      const result = addMonths(leapDay, 48);

      expect(result.year).toBe(2028);
      expect(result.month).toBe(2);
      expect(result.day).toBe(29); // 2028 is also a leap year
    });

    it('handles very large month additions (100+ months)', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const result = addMonths(instant, 120); // 10 years

      expect(result.year).toBe(2035);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
    });

    it('handles very large negative month additions', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const result = addMonths(instant, -120); // 10 years back

      expect(result.year).toBe(2015);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
    });

    it('handles consecutive month-end constraints', () => {
      const instant = Temporal.Instant.from('2025-01-31T12:00:00Z');
      const result1 = addMonths(instant, 1); // Feb 28
      const result2 = addMonths(result1.toInstant(), 1); // Mar 28 (not 31)

      expect(result1.month).toBe(2);
      expect(result1.day).toBe(28);
      expect(result2.month).toBe(3);
      expect(result2.day).toBe(28); // Day is preserved as 28
    });
  });
});
