import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { toPlainDate } from './toPlainDate';
import { toZonedTime } from './toZonedTime';
import { isPlainDateBefore, isPlainDateEqual } from './index';

describe('toPlainDate', () => {
  describe('from PlainDateLike object', () => {
    it('creates date from year, month, day', () => {
      const date = toPlainDate({ year: 2025, month: 1, day: 20 });

      expect(date).toBeInstanceOf(Temporal.PlainDate);
      expect(date.year).toBe(2025);
      expect(date.month).toBe(1);
      expect(date.day).toBe(20);
    });

    it('creates date from Temporal.PlainDate instance', () => {
      const original = Temporal.PlainDate.from('2025-07-04');
      const date = toPlainDate(original);

      expect(date).toBeInstanceOf(Temporal.PlainDate);
      expect(date.year).toBe(2025);
      expect(date.month).toBe(7);
      expect(date.day).toBe(4);
    });

    it('creates date from Temporal.PlainDateTime (extracts date)', () => {
      const dateTime = Temporal.PlainDateTime.from('2025-01-20T14:30:45');
      const date = toPlainDate(dateTime);

      expect(date).toBeInstanceOf(Temporal.PlainDate);
      expect(date.year).toBe(2025);
      expect(date.month).toBe(1);
      expect(date.day).toBe(20);
    });

    it('handles leap year date', () => {
      const date = toPlainDate({ year: 2024, month: 2, day: 29 });

      expect(date.year).toBe(2024);
      expect(date.month).toBe(2);
      expect(date.day).toBe(29);
    });

    it('constrains out-of-range values in PlainDateLike (Temporal default)', () => {
      // Unlike strings, PlainDateLike uses overflow: 'constrain' by default
      // This is Temporal API behavior, not tiempo-specific
      const feb29 = toPlainDate({ year: 2025, month: 2, day: 29 }); // Not a leap year
      expect(feb29.month).toBe(2);
      expect(feb29.day).toBe(28); // Constrained to Feb 28

      const month13 = toPlainDate({ year: 2025, month: 13, day: 1 });
      expect(month13.month).toBe(12); // Constrained to December
    });
  });

  describe('from plain date string', () => {
    it('parses YYYY-MM-DD format', () => {
      const date = toPlainDate('2025-01-20');

      expect(date).toBeInstanceOf(Temporal.PlainDate);
      expect(date.year).toBe(2025);
      expect(date.month).toBe(1);
      expect(date.day).toBe(20);
    });

    it('parses first day of year', () => {
      const date = toPlainDate('2025-01-01');

      expect(date.year).toBe(2025);
      expect(date.month).toBe(1);
      expect(date.day).toBe(1);
    });

    it('parses last day of year', () => {
      const date = toPlainDate('2025-12-31');

      expect(date.year).toBe(2025);
      expect(date.month).toBe(12);
      expect(date.day).toBe(31);
    });

    it('parses leap year date', () => {
      const date = toPlainDate('2024-02-29');

      expect(date.year).toBe(2024);
      expect(date.month).toBe(2);
      expect(date.day).toBe(29);
    });

    it('parses with leading zeros', () => {
      const date = toPlainDate('2025-03-05');

      expect(date.month).toBe(3);
      expect(date.day).toBe(5);
    });

    it('throws for invalid date values', () => {
      expect(() => toPlainDate('2025-13-01')).toThrow();
      expect(() => toPlainDate('2025-01-32')).toThrow();
      expect(() => toPlainDate('2025-02-29')).toThrow(); // 2025 is not a leap year
    });
  });

  describe('from ZonedDateTime (single arg)', () => {
    it('extracts date from ZonedDateTime', () => {
      const zdt = toZonedTime('2025-01-20T15:30:45.123Z', 'America/New_York');
      const date = toPlainDate(zdt);

      expect(date).toBeInstanceOf(Temporal.PlainDate);
      expect(date.year).toBe(2025);
      expect(date.month).toBe(1);
      expect(date.day).toBe(20);
    });

    it('preserves date from ZonedDateTime in different timezone', () => {
      const zdt = Temporal.ZonedDateTime.from('2025-07-04T14:30:45[America/New_York]');
      const date = toPlainDate(zdt);

      expect(date.year).toBe(2025);
      expect(date.month).toBe(7);
      expect(date.day).toBe(4);
    });
  });

  describe('from ISO string with timezone', () => {
    it('converts UTC ISO string to PlainDate in specified timezone', () => {
      const date = toPlainDate('2025-01-20T15:30:00Z', 'America/New_York');

      expect(date).toBeInstanceOf(Temporal.PlainDate);
      expect(date.year).toBe(2025);
      expect(date.month).toBe(1);
      expect(date.day).toBe(20);
    });

    it('handles different timezones correctly', () => {
      const utcString = '2025-01-20T12:00:00Z';

      const tokyo = toPlainDate(utcString, 'Asia/Tokyo');
      expect(tokyo.day).toBe(20);

      const london = toPlainDate(utcString, 'Europe/London');
      expect(london.day).toBe(20);

      const losAngeles = toPlainDate(utcString, 'America/Los_Angeles');
      expect(losAngeles.day).toBe(20);
    });
  });

  describe('from Date with timezone', () => {
    it('converts Date object to PlainDate in specified timezone', () => {
      const jsDate = new Date('2025-01-20T15:30:00.000Z');
      const date = toPlainDate(jsDate, 'America/New_York');

      expect(date).toBeInstanceOf(Temporal.PlainDate);
      expect(date.year).toBe(2025);
      expect(date.month).toBe(1);
      expect(date.day).toBe(20);
    });

    it('handles Date from Drizzle ORM (timestamptz)', () => {
      const drizzleDate = new Date('2025-01-20T20:00:00.000Z');

      const tokyo = toPlainDate(drizzleDate, 'Asia/Tokyo');
      expect(tokyo.day).toBe(21); // Next day in Tokyo

      const newYork = toPlainDate(drizzleDate, 'America/New_York');
      expect(newYork.day).toBe(20); // Same day in New York
    });
  });

  describe('from Temporal.Instant with timezone', () => {
    it('converts Instant to PlainDate in specified timezone', () => {
      const instant = Temporal.Instant.from('2025-01-20T15:30:00Z');
      const date = toPlainDate(instant, 'America/New_York');

      expect(date).toBeInstanceOf(Temporal.PlainDate);
      expect(date.year).toBe(2025);
      expect(date.month).toBe(1);
      expect(date.day).toBe(20);
    });

    it('handles multiple timezone conversions from same instant', () => {
      const instant = Temporal.Instant.from('2025-01-20T23:00:00Z');

      const tokyo = toPlainDate(instant, 'Asia/Tokyo');
      const newYork = toPlainDate(instant, 'America/New_York');

      expect(tokyo.day).toBe(21); // Jan 21 in Tokyo (UTC+9)
      expect(newYork.day).toBe(20); // Jan 20 in New York (UTC-5)
    });
  });

  describe('from ZonedDateTime with timezone (converts first)', () => {
    it('converts ZonedDateTime to different timezone then extracts date', () => {
      const nyTime = Temporal.ZonedDateTime.from('2025-01-20T23:00:00-05:00[America/New_York]');
      const tokyoDate = toPlainDate(nyTime, 'Asia/Tokyo');

      // 23:00 NY (Jan 20) = 04:00+9 = 13:00 next day Tokyo (Jan 21)
      expect(tokyoDate.day).toBe(21);
    });
  });

  describe('error handling', () => {
    it('throws when timezone is missing for ISO datetime string', () => {
      // ISO datetime strings need timezone to convert
      expect(() => toPlainDate('2025-01-20T15:30:00Z')).toThrow(
        'Timezone is required unless input is a ZonedDateTime, PlainDateLike, or plain date string'
      );
    });

    it('throws when timezone is missing for Date', () => {
      expect(() => {
        // @ts-expect-error - testing runtime error for missing timezone
        toPlainDate(new Date());
      }).toThrow('Timezone is required unless input is a ZonedDateTime, PlainDateLike, or plain date string');
    });

    it('throws when timezone is missing for Instant', () => {
      expect(() => {
        // @ts-expect-error - testing runtime error for missing timezone
        toPlainDate(Temporal.Instant.from('2025-01-20T15:30:00Z'));
      }).toThrow('Timezone is required unless input is a ZonedDateTime, PlainDateLike, or plain date string');
    });
  });

  describe('date boundary crossings', () => {
    it('late UTC time becomes next day in ahead-of-UTC timezone', () => {
      // 23:00 UTC on Jan 20 → 08:00 Jan 21 in Tokyo (UTC+9)
      const date = toPlainDate('2025-01-20T23:00:00Z', 'Asia/Tokyo');
      expect(date.year).toBe(2025);
      expect(date.month).toBe(1);
      expect(date.day).toBe(21);
    });

    it('early UTC time becomes previous day in behind-UTC timezone', () => {
      // 02:00 UTC on Jan 21 → 21:00 Jan 20 in New York (UTC-5)
      const date = toPlainDate('2025-01-21T02:00:00Z', 'America/New_York');
      expect(date.year).toBe(2025);
      expect(date.month).toBe(1);
      expect(date.day).toBe(20);
    });

    it('midnight UTC crossing with positive offset', () => {
      // 00:30 UTC on Jan 21 → 09:30 Jan 21 in Tokyo
      const tokyo = toPlainDate('2025-01-21T00:30:00Z', 'Asia/Tokyo');
      expect(tokyo.day).toBe(21);

      // 15:00 UTC on Jan 20 → 00:00 Jan 21 in Tokyo (exactly midnight)
      const tokyoMidnight = toPlainDate('2025-01-20T15:00:00Z', 'Asia/Tokyo');
      expect(tokyoMidnight.day).toBe(21);
    });

    it('midnight UTC crossing with negative offset', () => {
      // 04:30 UTC on Jan 21 → 23:30 Jan 20 in New York (EST)
      const ny = toPlainDate('2025-01-21T04:30:00Z', 'America/New_York');
      expect(ny.day).toBe(20);

      // 05:00 UTC on Jan 21 → 00:00 Jan 21 in New York (exactly midnight)
      const nyMidnight = toPlainDate('2025-01-21T05:00:00Z', 'America/New_York');
      expect(nyMidnight.day).toBe(21);
    });

    it('same instant produces different dates in different timezones', () => {
      const instant = '2025-01-20T20:00:00Z';

      const utc = toPlainDate(instant, 'UTC');
      const tokyo = toPlainDate(instant, 'Asia/Tokyo'); // 05:00 Jan 21
      const honolulu = toPlainDate(instant, 'Pacific/Honolulu'); // 10:00 Jan 20

      expect(utc.day).toBe(20);
      expect(tokyo.day).toBe(21); // Next day
      expect(honolulu.day).toBe(20); // Same day
    });
  });

  describe('year boundary crossings', () => {
    it('Dec 31 UTC becomes Jan 1 in ahead-of-UTC timezone', () => {
      // 20:00 UTC Dec 31, 2024 → 05:00 Jan 1, 2025 in Tokyo
      const date = toPlainDate('2024-12-31T20:00:00Z', 'Asia/Tokyo');
      expect(date.year).toBe(2025);
      expect(date.month).toBe(1);
      expect(date.day).toBe(1);
    });

    it('Jan 1 UTC becomes Dec 31 in behind-UTC timezone', () => {
      // 03:00 UTC Jan 1, 2025 → 22:00 Dec 31, 2024 in New York
      const date = toPlainDate('2025-01-01T03:00:00Z', 'America/New_York');
      expect(date.year).toBe(2024);
      expect(date.month).toBe(12);
      expect(date.day).toBe(31);
    });
  });

  describe('month boundary crossings', () => {
    it('last day of month UTC becomes first day of next month in positive offset', () => {
      // 20:00 UTC Jan 31 → 05:00 Feb 1 in Tokyo
      const date = toPlainDate('2025-01-31T20:00:00Z', 'Asia/Tokyo');
      expect(date.month).toBe(2);
      expect(date.day).toBe(1);
    });

    it('first day of month UTC becomes last day of previous month in negative offset', () => {
      // 03:00 UTC Feb 1 → 22:00 Jan 31 in New York
      const date = toPlainDate('2025-02-01T03:00:00Z', 'America/New_York');
      expect(date.month).toBe(1);
      expect(date.day).toBe(31);
    });
  });

  describe('leap year handling', () => {
    it('Feb 28 UTC becomes Feb 29 in leap year (positive offset)', () => {
      // 20:00 UTC Feb 28, 2024 → 05:00 Feb 29, 2024 in Tokyo (2024 is leap year)
      const date = toPlainDate('2024-02-28T20:00:00Z', 'Asia/Tokyo');
      expect(date.month).toBe(2);
      expect(date.day).toBe(29);
    });

    it('Feb 29 exists in leap year', () => {
      const date = toPlainDate('2024-02-29T12:00:00Z', 'UTC');
      expect(date.month).toBe(2);
      expect(date.day).toBe(29);
    });

    it('Feb 28 UTC becomes Mar 1 in non-leap year (positive offset)', () => {
      // 20:00 UTC Feb 28, 2025 → 05:00 Mar 1, 2025 in Tokyo (2025 is not leap year)
      const date = toPlainDate('2025-02-28T20:00:00Z', 'Asia/Tokyo');
      expect(date.month).toBe(3);
      expect(date.day).toBe(1);
    });

    it('Mar 1 UTC becomes Feb 29 in leap year (negative offset)', () => {
      // 03:00 UTC Mar 1, 2024 → 22:00 Feb 29, 2024 in New York
      const date = toPlainDate('2024-03-01T03:00:00Z', 'America/New_York');
      expect(date.month).toBe(2);
      expect(date.day).toBe(29);
    });
  });

  describe('daylight saving time transitions', () => {
    it('handles spring forward (Mar 2025 - US)', () => {
      // March 9, 2025: US springs forward at 2:00 AM EST → 3:00 AM EDT
      // Before transition (still EST: UTC-5)
      const before = toPlainDate('2025-03-09T06:00:00Z', 'America/New_York'); // 1:00 AM EST
      expect(before.month).toBe(3);
      expect(before.day).toBe(9);

      // After transition (now EDT: UTC-4)
      const after = toPlainDate('2025-03-09T08:00:00Z', 'America/New_York'); // 4:00 AM EDT
      expect(after.month).toBe(3);
      expect(after.day).toBe(9);
    });

    it('handles fall back (Nov 2025 - US)', () => {
      // November 2, 2025: US falls back at 2:00 AM EDT → 1:00 AM EST
      // Before transition (still EDT: UTC-4)
      const before = toPlainDate('2025-11-02T05:00:00Z', 'America/New_York'); // 1:00 AM EDT
      expect(before.month).toBe(11);
      expect(before.day).toBe(2);

      // After transition (now EST: UTC-5)
      const after = toPlainDate('2025-11-02T07:00:00Z', 'America/New_York'); // 2:00 AM EST
      expect(after.month).toBe(11);
      expect(after.day).toBe(2);
    });

    it('summer vs winter: same UTC time has different local context', () => {
      // 23:00 UTC in summer (EDT) vs winter (EST)
      const summer = toPlainDate('2025-07-20T23:00:00Z', 'America/New_York'); // 7 PM EDT, still Jul 20
      const winter = toPlainDate('2025-01-20T23:00:00Z', 'America/New_York'); // 6 PM EST, still Jan 20

      expect(summer.day).toBe(20);
      expect(winter.day).toBe(20);
    });
  });

  describe('half-hour and 45-minute offset timezones', () => {
    it('handles India (UTC+5:30)', () => {
      // 20:00 UTC → 01:30 next day in India
      const date = toPlainDate('2025-01-20T20:00:00Z', 'Asia/Kolkata');
      expect(date.day).toBe(21);
    });

    it('handles Nepal (UTC+5:45)', () => {
      // 20:00 UTC → 01:45 next day in Nepal
      const date = toPlainDate('2025-01-20T20:00:00Z', 'Asia/Kathmandu');
      expect(date.day).toBe(21);
    });

    it('handles Newfoundland (UTC-3:30)', () => {
      // 03:00 UTC → 23:30 previous day in Newfoundland (NST)
      const date = toPlainDate('2025-01-21T03:00:00Z', 'America/St_Johns');
      expect(date.day).toBe(20);
    });

    it('handles Chatham Islands (UTC+12:45 / UTC+13:45 DST)', () => {
      // One of the most extreme offsets
      // January is summer in Southern Hemisphere, so UTC+13:45 (CHADT)
      // 10:00 UTC Jan 20 → 23:45 Jan 20 in Chatham (still same day)
      const sameDay = toPlainDate('2025-01-20T10:00:00Z', 'Pacific/Chatham');
      expect(sameDay.day).toBe(20);

      // 10:30 UTC Jan 20 → 00:15 Jan 21 in Chatham (crosses to next day)
      const nextDay = toPlainDate('2025-01-20T10:30:00Z', 'Pacific/Chatham');
      expect(nextDay.day).toBe(21);
    });
  });

  describe('International Date Line edge cases', () => {
    it('Kiritimati (UTC+14) - furthest ahead', () => {
      // 09:00 UTC Jan 20 → 23:00 Jan 20 in Kiritimati
      const early = toPlainDate('2025-01-20T09:00:00Z', 'Pacific/Kiritimati');
      expect(early.day).toBe(20);

      // 11:00 UTC Jan 20 → 01:00 Jan 21 in Kiritimati
      const late = toPlainDate('2025-01-20T11:00:00Z', 'Pacific/Kiritimati');
      expect(late.day).toBe(21);
    });

    it('Baker Island (UTC-12) - furthest behind', () => {
      // 11:00 UTC Jan 20 → 23:00 Jan 19 in Baker Island
      const date = toPlainDate('2025-01-20T11:00:00Z', 'Etc/GMT+12');
      expect(date.day).toBe(19);
    });

    it('same instant can span 3 calendar days', () => {
      // At certain times, the world spans 3 calendar days
      // 10:30 UTC Jan 20 shows this range
      const instant = '2025-01-20T10:30:00Z';

      const kiritimati = toPlainDate(instant, 'Pacific/Kiritimati'); // UTC+14 → 00:30 Jan 21
      const london = toPlainDate(instant, 'Europe/London'); // UTC+0 → 10:30 Jan 20
      const bakerIsland = toPlainDate(instant, 'Etc/GMT+12'); // UTC-12 → 22:30 Jan 19

      expect(kiritimati.day).toBe(21);
      expect(london.day).toBe(20);
      expect(bakerIsland.day).toBe(19);
    });
  });

  describe('real-world use cases', () => {
    it('event scheduling: what date is this meeting in my timezone?', () => {
      // Meeting scheduled for 22:00 UTC on Jan 20
      const meetingUtc = '2025-01-20T22:00:00Z';

      // For someone in New York: 5 PM Jan 20
      const nyDate = toPlainDate(meetingUtc, 'America/New_York');
      expect(nyDate.day).toBe(20);

      // For someone in Tokyo: 7 AM Jan 21
      const tokyoDate = toPlainDate(meetingUtc, 'Asia/Tokyo');
      expect(tokyoDate.day).toBe(21);
    });

    it('deadline checking: is today the deadline?', () => {
      const deadline = Temporal.PlainDate.from('2025-01-20');

      // 03:00 UTC Jan 21 - is it still Jan 20 somewhere?
      const instant = '2025-01-21T03:00:00Z';

      const nyDate = toPlainDate(instant, 'America/New_York'); // Still Jan 20
      const londonDate = toPlainDate(instant, 'Europe/London'); // Jan 21

      expect(isPlainDateEqual(nyDate, deadline)).toBe(true);
      expect(isPlainDateEqual(londonDate, deadline)).toBe(false);
    });

    it('birthday calculation: is it their birthday yet?', () => {
      const birthday = Temporal.PlainDate.from('2025-01-15');

      // It's 2025-01-14T20:00:00Z - is it their birthday yet?
      const instant = '2025-01-14T20:00:00Z';

      const tokyo = toPlainDate(instant, 'Asia/Tokyo'); // Jan 15 - birthday!
      const newYork = toPlainDate(instant, 'America/New_York'); // Jan 14 - not yet

      expect(isPlainDateEqual(tokyo, birthday)).toBe(true);
      expect(isPlainDateBefore(newYork, birthday)).toBe(true);
    });

    it('flight arrival: what day do I land?', () => {
      // Flight lands at 02:00 UTC Jan 21
      const landingUtc = '2025-01-21T02:00:00Z';

      // Landing in New York: 9 PM Jan 20
      const nyArrival = toPlainDate(landingUtc, 'America/New_York');
      expect(nyArrival.day).toBe(20);

      // Landing in Tokyo: 11 AM Jan 21
      const tokyoArrival = toPlainDate(landingUtc, 'Asia/Tokyo');
      expect(tokyoArrival.day).toBe(21);
    });

    it('comparing dates across timezones', () => {
      const instant1 = '2025-01-20T20:00:00Z';
      const instant2 = '2025-01-21T10:00:00Z';

      const date1Tokyo = toPlainDate(instant1, 'Asia/Tokyo'); // Jan 21
      const date2Ny = toPlainDate(instant2, 'America/New_York'); // Jan 21

      // Both are Jan 21 in their respective timezones
      expect(date1Tokyo.day).toBe(21);
      expect(date2Ny.day).toBe(21);
      expect(isPlainDateEqual(date1Tokyo, date2Ny)).toBe(true);
    });
  });

  describe('comparison with isPlainDateBefore', () => {
    it('dates from different instants can be compared', () => {
      const earlier = toPlainDate('2025-01-15T12:00:00Z', 'UTC');
      const later = toPlainDate('2025-01-20T12:00:00Z', 'UTC');

      expect(isPlainDateBefore(earlier, later)).toBe(true);
      expect(isPlainDateBefore(later, earlier)).toBe(false);
    });

    it('same date in different timezones compares equal', () => {
      // Both represent Jan 20
      const date1 = toPlainDate('2025-01-20T12:00:00Z', 'UTC');
      const date2 = toPlainDate('2025-01-20T20:00:00Z', 'America/New_York'); // Still Jan 20 in NY

      expect(isPlainDateEqual(date1, date2)).toBe(true);
    });
  });
});
