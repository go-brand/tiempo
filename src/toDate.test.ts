import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { toDate } from './toDate';
import { toUtc } from './toUtc';
import { toZonedTime } from './toZonedTime';

describe('toDate', () => {
  describe('from Temporal.Instant', () => {
    it('converts Instant to Date object', () => {
      const instant = Temporal.Instant.from('2025-01-20T20:00:00Z');
      const date = toDate(instant);

      expect(date).toBeInstanceOf(Date);
      expect(date.toISOString()).toBe('2025-01-20T20:00:00.000Z');
    });

    it('preserves millisecond precision', () => {
      const instant = Temporal.Instant.from('2025-01-20T20:00:00.123Z');
      const date = toDate(instant);

      expect(date.toISOString()).toBe('2025-01-20T20:00:00.123Z');
    });

    it('handles different timestamps correctly', () => {
      const instant1 = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const instant2 = Temporal.Instant.from('2025-12-31T23:59:59.999Z');

      const date1 = toDate(instant1);
      const date2 = toDate(instant2);

      expect(date1.toISOString()).toBe('2025-01-20T12:00:00.000Z');
      expect(date2.toISOString()).toBe('2025-12-31T23:59:59.999Z');
    });
  });

  describe('from Temporal.ZonedDateTime', () => {
    it('converts ZonedDateTime to Date object (preserves instant)', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T15:00:00-05:00[America/New_York]'
      );
      const date = toDate(zoned);

      expect(date).toBeInstanceOf(Date);
      // The instant is 8 PM UTC (3 PM NY time + 5 hours)
      expect(date.toISOString()).toBe('2025-01-20T20:00:00.000Z');
    });

    it('handles different timezones correctly', () => {
      const tokyo = Temporal.ZonedDateTime.from(
        '2025-01-21T05:00:00+09:00[Asia/Tokyo]'
      );
      const newYork = Temporal.ZonedDateTime.from(
        '2025-01-20T15:00:00-05:00[America/New_York]'
      );

      const date1 = toDate(tokyo);
      const date2 = toDate(newYork);

      // Both represent the same instant (8 PM UTC)
      expect(date1.toISOString()).toBe('2025-01-20T20:00:00.000Z');
      expect(date2.toISOString()).toBe('2025-01-20T20:00:00.000Z');
      expect(date1.getTime()).toBe(date2.getTime());
    });
  });

  describe('round-trip conversions', () => {
    it('Date → Instant → Date preserves value', () => {
      const original = new Date('2025-01-20T20:00:00.123Z');
      const instant = toUtc(original);
      const roundTrip = toDate(instant);

      expect(roundTrip.toISOString()).toBe(original.toISOString());
      expect(roundTrip.getTime()).toBe(original.getTime());
    });

    it('Date → ZonedDateTime → Date preserves value', () => {
      const original = new Date('2025-01-20T20:00:00.456Z');
      const zoned = toZonedTime(original, 'America/New_York');
      const roundTrip = toDate(zoned);

      expect(roundTrip.toISOString()).toBe(original.toISOString());
      expect(roundTrip.getTime()).toBe(original.getTime());
    });

    it('Date → Instant → ZonedDateTime → Date preserves value', () => {
      const original = new Date('2025-06-15T14:30:45.789Z');

      // Complex round trip through multiple conversions
      const instant = toUtc(original);
      const tokyo = toZonedTime(instant, 'Asia/Tokyo');
      const newYork = toZonedTime(tokyo, 'America/New_York');
      const backToInstant = toUtc(newYork);
      const roundTrip = toDate(backToInstant);

      expect(roundTrip.toISOString()).toBe(original.toISOString());
      expect(roundTrip.getTime()).toBe(original.getTime());
    });
  });

  describe('Drizzle ORM integration', () => {
    it('simulates reading from database and converting to Temporal', () => {
      // Simulate Drizzle returning a Date object
      const drizzleDate = new Date('2025-01-20T20:00:00.000Z');

      // Convert to Temporal for business logic
      const instant = toUtc(drizzleDate);
      const userTimezone = toZonedTime(instant, 'America/New_York');

      expect(userTimezone.hour).toBe(15); // 3 PM in New York
      expect(userTimezone.day).toBe(20);
    });

    it('simulates converting Temporal back to Date for database storage', () => {
      // User schedules a post for 3 PM New York time
      const scheduledTime = Temporal.ZonedDateTime.from(
        '2025-01-20T15:00:00-05:00[America/New_York]'
      );

      // Convert to Date for Drizzle storage
      const dateForDb = toDate(scheduledTime);

      expect(dateForDb.toISOString()).toBe('2025-01-20T20:00:00.000Z');
    });

    it('simulates full Drizzle ORM workflow', () => {
      // 1. Read from database (Drizzle returns Date)
      const fromDb = new Date('2025-01-20T20:00:00.000Z');

      // 2. Convert to user's timezone for display
      const userView = toZonedTime(fromDb, 'America/Los_Angeles');
      expect(userView.hour).toBe(12); // Noon in LA

      // 3. User reschedules to 2 PM LA time
      const rescheduled = userView.with({ hour: 14 });

      // 4. Convert back to Date for database storage
      const backToDb = toDate(rescheduled);
      expect(backToDb.toISOString()).toBe('2025-01-20T22:00:00.000Z');

      // 5. Verify round-trip preserves the instant
      const instant1 = toUtc(fromDb);
      const instant2 = toUtc(rescheduled);
      expect(instant2.epochMilliseconds - instant1.epochMilliseconds).toBe(
        2 * 60 * 60 * 1000
      ); // 2 hours difference
    });
  });
});
