import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { addYears } from './addYears';

describe('addYears', () => {
  describe('from Temporal.Instant', () => {
    it('adds positive years to instant', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const result = addYears(instant, 5);

      expect(result).toBeInstanceOf(Temporal.ZonedDateTime);
      expect(result.year).toBe(2030);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
      expect(result.hour).toBe(12);
      expect(result.minute).toBe(0);
      expect(result.second).toBe(0);
      expect(result.timeZoneId).toBe('UTC');
    });

    it('adds negative years (subtracts) to instant', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const result = addYears(instant, -10);

      expect(result.year).toBe(2015);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
      expect(result.hour).toBe(12);
      expect(result.timeZoneId).toBe('UTC');
    });

    it('adds zero years (no change)', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const result = addYears(instant, 0);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
      expect(result.hour).toBe(12);
      expect(result.timeZoneId).toBe('UTC');
    });

    it('preserves time components when adding years', () => {
      const instant = Temporal.Instant.from('2025-01-20T14:30:45.123456789Z');
      const result = addYears(instant, 3);

      expect(result.hour).toBe(14);
      expect(result.minute).toBe(30);
      expect(result.second).toBe(45);
      expect(result.millisecond).toBe(123);
      expect(result.microsecond).toBe(456);
      expect(result.nanosecond).toBe(789);
    });

    it('handles adding single year', () => {
      const instant = Temporal.Instant.from('2025-06-15T00:00:00Z');
      const result = addYears(instant, 1);

      expect(result.year).toBe(2026);
      expect(result.month).toBe(6);
      expect(result.day).toBe(15);
    });

    it('handles subtracting single year', () => {
      const instant = Temporal.Instant.from('2025-06-15T00:00:00Z');
      const result = addYears(instant, -1);

      expect(result.year).toBe(2024);
      expect(result.month).toBe(6);
      expect(result.day).toBe(15);
    });

    it('handles adding multiple decades', () => {
      const instant = Temporal.Instant.from('2025-01-01T00:00:00Z');
      const result = addYears(instant, 50);

      expect(result.year).toBe(2075);
      expect(result.month).toBe(1);
      expect(result.day).toBe(1);
    });

    it('handles subtracting multiple decades', () => {
      const instant = Temporal.Instant.from('2025-01-01T00:00:00Z');
      const result = addYears(instant, -50);

      expect(result.year).toBe(1975);
      expect(result.month).toBe(1);
      expect(result.day).toBe(1);
    });
  });

  describe('from Temporal.ZonedDateTime', () => {
    it('adds years and preserves America/New_York timezone', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T15:30:00-05:00[America/New_York]'
      );
      const result = addYears(zoned, 3);

      expect(result.year).toBe(2028);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
      expect(result.hour).toBe(15);
      expect(result.minute).toBe(30);
      expect(result.timeZoneId).toBe('America/New_York');
    });

    it('adds years and preserves Asia/Tokyo timezone', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T09:00:00+09:00[Asia/Tokyo]'
      );
      const result = addYears(zoned, 7);

      expect(result.year).toBe(2032);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
      expect(result.hour).toBe(9);
      expect(result.timeZoneId).toBe('Asia/Tokyo');
    });

    it('adds negative years and preserves timezone', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-06-15T10:00:00-04:00[America/New_York]'
      );
      const result = addYears(zoned, -5);

      expect(result.year).toBe(2020);
      expect(result.month).toBe(6);
      expect(result.day).toBe(15);
      expect(result.hour).toBe(10);
      expect(result.timeZoneId).toBe('America/New_York');
    });

    it('handles adding years with DST offset differences', () => {
      // January (EST -05:00)
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-15T14:00:00-05:00[America/New_York]'
      );
      const result = addYears(zoned, 2);

      // January 2027 (still EST -05:00)
      expect(result.year).toBe(2027);
      expect(result.month).toBe(1);
      expect(result.day).toBe(15);
      expect(result.hour).toBe(14);
      expect(result.offset).toBe('-05:00');
      expect(result.timeZoneId).toBe('America/New_York');
    });

    it('handles subtracting years with DST offset differences', () => {
      // July (EDT -04:00)
      const zoned = Temporal.ZonedDateTime.from(
        '2025-07-15T14:00:00-04:00[America/New_York]'
      );
      const result = addYears(zoned, -3);

      // July 2022 (still EDT -04:00)
      expect(result.year).toBe(2022);
      expect(result.month).toBe(7);
      expect(result.day).toBe(15);
      expect(result.hour).toBe(14);
      expect(result.offset).toBe('-04:00');
      expect(result.timeZoneId).toBe('America/New_York');
    });
  });

  describe('leap year edge cases', () => {
    it('handles Feb 29 + 1 year = Feb 28 (non-leap year)', () => {
      const leapDay = Temporal.Instant.from('2024-02-29T12:00:00Z');
      const result = addYears(leapDay, 1);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(2);
      expect(result.day).toBe(28); // Constrained to Feb 28
      expect(result.hour).toBe(12);
    });

    it('handles Feb 29 + 4 years = Feb 29 (next leap year)', () => {
      const leapDay = Temporal.Instant.from('2024-02-29T12:00:00Z');
      const result = addYears(leapDay, 4);

      expect(result.year).toBe(2028);
      expect(result.month).toBe(2);
      expect(result.day).toBe(29); // 2028 is a leap year
    });

    it('handles Feb 29 + 8 years = Feb 29 (leap year)', () => {
      const leapDay = Temporal.Instant.from('2024-02-29T12:00:00Z');
      const result = addYears(leapDay, 8);

      expect(result.year).toBe(2032);
      expect(result.month).toBe(2);
      expect(result.day).toBe(29);
    });

    it('handles Feb 29 - 4 years = Feb 29 (previous leap year)', () => {
      const leapDay = Temporal.Instant.from('2024-02-29T12:00:00Z');
      const result = addYears(leapDay, -4);

      expect(result.year).toBe(2020);
      expect(result.month).toBe(2);
      expect(result.day).toBe(29); // 2020 is a leap year
    });

    it('handles Feb 29 - 1 year = Feb 28 (non-leap year)', () => {
      const leapDay = Temporal.Instant.from('2024-02-29T12:00:00Z');
      const result = addYears(leapDay, -1);

      expect(result.year).toBe(2023);
      expect(result.month).toBe(2);
      expect(result.day).toBe(28); // 2023 is not a leap year
    });

    it('handles leap year century edge case (2100 is not a leap year)', () => {
      const leapDay = Temporal.Instant.from('2096-02-29T12:00:00Z');
      const result = addYears(leapDay, 4);

      expect(result.year).toBe(2100);
      expect(result.month).toBe(2);
      expect(result.day).toBe(28); // 2100 is not a leap year (not divisible by 400)
    });

    it('handles leap year century edge case (2000 is a leap year)', () => {
      const leapDay = Temporal.Instant.from('1996-02-29T12:00:00Z');
      const result = addYears(leapDay, 4);

      expect(result.year).toBe(2000);
      expect(result.month).toBe(2);
      expect(result.day).toBe(29); // 2000 is a leap year (divisible by 400)
    });

    it('handles non-leap day across leap years unchanged', () => {
      const instant = Temporal.Instant.from('2024-02-28T12:00:00Z');
      const result = addYears(instant, 1);

      expect(result.year).toBe(2025);
      expect(result.month).toBe(2);
      expect(result.day).toBe(28); // Feb 28 stays Feb 28
    });
  });

  describe('real-world scenarios', () => {
    it('calculates age milestones', () => {
      const birthDate = Temporal.Instant.from('1990-05-15T00:00:00Z');
      const age18 = addYears(birthDate, 18);
      const age21 = addYears(birthDate, 21);
      const age65 = addYears(birthDate, 65);

      expect(age18.year).toBe(2008);
      expect(age18.month).toBe(5);
      expect(age18.day).toBe(15);

      expect(age21.year).toBe(2011);
      expect(age65.year).toBe(2055);
    });

    it('tracks contract renewal dates', () => {
      const contractStart = Temporal.ZonedDateTime.from(
        '2025-01-01T00:00:00-05:00[America/New_York]'
      );
      const year1 = addYears(contractStart, 1);
      const year2 = addYears(contractStart, 2);
      const year5 = addYears(contractStart, 5);

      expect(year1.year).toBe(2026);
      expect(year1.day).toBe(1);
      expect(year2.year).toBe(2027);
      expect(year5.year).toBe(2030);

      // All maintain timezone
      [year1, year2, year5].forEach((renewal) => {
        expect(renewal.timeZoneId).toBe('America/New_York');
      });
    });

    it('schedules anniversary events', () => {
      const weddingDate = Temporal.ZonedDateTime.from(
        '2020-06-15T14:00:00-04:00[America/New_York]'
      );

      const anniversaries = [1, 5, 10, 25, 50].map((years) =>
        addYears(weddingDate, years)
      );

      anniversaries.forEach((anniversary, index) => {
        expect(anniversary.month).toBe(6);
        expect(anniversary.day).toBe(15);
        expect(anniversary.hour).toBe(14);
        expect(anniversary.minute).toBe(0);
      });

      expect(anniversaries[0]?.year).toBe(2021); // 1st
      expect(anniversaries[1]?.year).toBe(2025); // 5th
      expect(anniversaries[2]?.year).toBe(2030); // 10th
      expect(anniversaries[3]?.year).toBe(2045); // 25th
      expect(anniversaries[4]?.year).toBe(2070); // 50th
    });
  });

  describe('edge cases', () => {
    it('handles very large year additions (100+ years)', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const result = addYears(instant, 200);

      expect(result.year).toBe(2225);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
    });

    it('handles very large negative year additions', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const result = addYears(instant, -200);

      expect(result.year).toBe(1825);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
    });

    it('preserves month and day across years', () => {
      const instant = Temporal.Instant.from('2025-12-31T23:59:59Z');
      const result = addYears(instant, 10);

      expect(result.year).toBe(2035);
      expect(result.month).toBe(12);
      expect(result.day).toBe(31);
      expect(result.hour).toBe(23);
      expect(result.minute).toBe(59);
      expect(result.second).toBe(59);
    });

    it('handles year transitions through multiple leap years', () => {
      const instant = Temporal.Instant.from('2020-02-15T12:00:00Z');
      const result = addYears(instant, 16); // 2020, 2024, 2028, 2032, 2036 are leap years

      expect(result.year).toBe(2036);
      expect(result.month).toBe(2);
      expect(result.day).toBe(15);
    });

    it('handles BC to AD transitions (year 0 edge case)', () => {
      // Note: Temporal uses ISO 8601 calendar, year 0 = 1 BC
      const instant = Temporal.Instant.from('0000-06-15T12:00:00Z');
      const result = addYears(instant, 1);

      expect(result.year).toBe(1);
      expect(result.month).toBe(6);
      expect(result.day).toBe(15);
    });

    it('handles negative year values', () => {
      const instant = Temporal.Instant.from('0100-06-15T12:00:00Z');
      const result = addYears(instant, -200);

      expect(result.year).toBe(-100);
      expect(result.month).toBe(6);
      expect(result.day).toBe(15);
    });
  });
});
