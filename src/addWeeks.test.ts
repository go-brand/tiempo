import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { addWeeks } from './addWeeks';

describe('addWeeks', () => {
  describe('from Temporal.Instant', () => {
    it('adds positive weeks to instant', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const result = addWeeks(instant, 2);

      expect(result).toBeInstanceOf(Temporal.ZonedDateTime);
      expect(result.year).toBe(2025);
      expect(result.month).toBe(2);
      expect(result.day).toBe(3); // 2 weeks later
      expect(result.hour).toBe(12);
      expect(result.minute).toBe(0);
      expect(result.second).toBe(0);
      expect(result.timeZoneId).toBe('UTC');
    });

    it('adds negative weeks (subtracts) to instant', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const result = addWeeks(instant, -1);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(13); // 1 week earlier
      expect(result.hour).toBe(12);
      expect(result.timeZoneId).toBe('UTC');
    });

    it('adds zero weeks (no change)', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const result = addWeeks(instant, 0);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
      expect(result.hour).toBe(12);
      expect(result.timeZoneId).toBe('UTC');
    });

    it('preserves time components when adding weeks', () => {
      const instant = Temporal.Instant.from('2025-01-20T14:30:45.123456789Z');
      const result = addWeeks(instant, 3);

      expect(result.hour).toBe(14);
      expect(result.minute).toBe(30);
      expect(result.second).toBe(45);
      expect(result.millisecond).toBe(123);
      expect(result.microsecond).toBe(456);
      expect(result.nanosecond).toBe(789);
    });

    it('handles adding multiple weeks forward', () => {
      const instant = Temporal.Instant.from('2025-01-01T00:00:00Z');
      const result = addWeeks(instant, 10);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(3);
      expect(result.day).toBe(12); // 10 weeks = 70 days
    });

    it('handles subtracting multiple weeks backward', () => {
      const instant = Temporal.Instant.from('2025-03-12T00:00:00Z');
      const result = addWeeks(instant, -10);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(1); // 10 weeks back
    });

    it('handles adding weeks across month boundaries', () => {
      const instant = Temporal.Instant.from('2025-01-31T12:00:00Z');
      const result = addWeeks(instant, 4);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(2);
      expect(result.day).toBe(28); // Jan 31 + 28 days = Feb 28
    });

    it('handles adding weeks across year boundaries', () => {
      const instant = Temporal.Instant.from('2024-12-25T12:00:00Z');
      const result = addWeeks(instant, 2);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(8); // Crosses into 2025
    });

    it('handles large week values (52+ weeks)', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const result = addWeeks(instant, 52);

      expect(result.year).toBe(2026);
      expect(result.month).toBe(1);
      expect(result.day).toBe(19); // ~1 year later
    });
  });

  describe('from Temporal.ZonedDateTime', () => {
    it('adds weeks and preserves America/New_York timezone', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T15:30:00-05:00[America/New_York]'
      );
      const result = addWeeks(zoned, 2);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(2);
      expect(result.day).toBe(3);
      expect(result.hour).toBe(15);
      expect(result.minute).toBe(30);
      expect(result.timeZoneId).toBe('America/New_York');
    });

    it('adds weeks and preserves Asia/Tokyo timezone', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T09:00:00+09:00[Asia/Tokyo]'
      );
      const result = addWeeks(zoned, 3);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(2);
      expect(result.day).toBe(10);
      expect(result.hour).toBe(9);
      expect(result.timeZoneId).toBe('Asia/Tokyo');
    });

    it('adds negative weeks and preserves timezone', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-02-10T10:00:00-05:00[America/New_York]'
      );
      const result = addWeeks(zoned, -2);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(27);
      expect(result.hour).toBe(10);
      expect(result.timeZoneId).toBe('America/New_York');
    });

    it('handles adding weeks across spring DST transition (March 9, 2025)', () => {
      // Week before DST transition
      const zoned = Temporal.ZonedDateTime.from(
        '2025-03-03T14:00:00-05:00[America/New_York]'
      );
      const result = addWeeks(zoned, 1);

      // After DST transition (spring forward to -04:00)
      expect(result.year).toBe(2025);
      expect(result.month).toBe(3);
      expect(result.day).toBe(10);
      expect(result.hour).toBe(14); // Clock time preserved
      expect(result.offset).toBe('-04:00'); // Offset changed
      expect(result.timeZoneId).toBe('America/New_York');
    });

    it('handles adding weeks across fall DST transition (November 2, 2025)', () => {
      // Week before DST transition
      const zoned = Temporal.ZonedDateTime.from(
        '2025-10-27T14:00:00-04:00[America/New_York]'
      );
      const result = addWeeks(zoned, 1);

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
    it('calculates 2-week sprint cycles', () => {
      const sprintStart = Temporal.Instant.from('2025-01-06T00:00:00Z'); // Sprint 1 start
      const sprint2 = addWeeks(sprintStart, 2);
      const sprint3 = addWeeks(sprintStart, 4);
      const sprint4 = addWeeks(sprintStart, 6);

      expect(sprint2.day).toBe(20); // Jan 20
      expect(sprint3.day).toBe(3); // Feb 3
      expect(sprint3.month).toBe(2);
      expect(sprint4.day).toBe(17); // Feb 17
    });

    it('schedules bi-weekly meetings', () => {
      const meeting1 = Temporal.ZonedDateTime.from(
        '2025-01-06T10:00:00-05:00[America/New_York]'
      );

      const meetings = [1, 2, 3, 4, 5, 6].map((n) => addWeeks(meeting1, n * 2));

      // Verify all meetings are at 10:00 AM
      meetings.forEach((meeting) => {
        expect(meeting.hour).toBe(10);
        expect(meeting.minute).toBe(0);
        expect(meeting.timeZoneId).toBe('America/New_York');
      });

      // First few meetings
      const firstMeeting = meetings[0];
      const secondMeeting = meetings[1];
      expect(firstMeeting?.day).toBe(20); // Jan 20
      expect(secondMeeting?.day).toBe(3); // Feb 3
      expect(secondMeeting?.month).toBe(2);
    });

    it('tracks pregnancy milestones (40-week cycles)', () => {
      const conceptionDate = Temporal.Instant.from('2024-05-01T00:00:00Z');
      const week12 = addWeeks(conceptionDate, 12); // First trimester end
      const week28 = addWeeks(conceptionDate, 28); // Second trimester end
      const week40 = addWeeks(conceptionDate, 40); // Due date

      expect(week12.month).toBe(7); // Late July
      expect(week28.month).toBe(11); // November
      expect(week40.year).toBe(2025);
      expect(week40.month).toBe(2); // February 2025
    });
  });

  describe('edge cases', () => {
    it('handles leap year transitions', () => {
      const leapDay = Temporal.Instant.from('2024-02-29T12:00:00Z');
      const result = addWeeks(leapDay, 52);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(2);
      expect(result.day).toBe(27); // 52 weeks later (not leap year)
    });

    it('handles month end dates correctly', () => {
      const instant = Temporal.Instant.from('2025-01-31T12:00:00Z');
      const result = addWeeks(instant, 1);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(2);
      expect(result.day).toBe(7); // Jan 31 + 7 days = Feb 7
      expect(result.hour).toBe(12);
    });

    it('handles very large week additions (100+ weeks)', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const result = addWeeks(instant, 104); // 2 years

      expect(result.year).toBe(2027);
      expect(result.month).toBe(1);
      expect(result.day).toBe(18);
    });

    it('handles very large negative week additions', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const result = addWeeks(instant, -104); // 2 years back

      expect(result.year).toBe(2023);
      expect(result.month).toBe(1);
      expect(result.day).toBe(23);
    });
  });
});
