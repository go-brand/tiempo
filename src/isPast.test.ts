import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { isPast } from './isPast';

describe('isPast', () => {
  describe('with ZonedDateTime', () => {
    it('returns true for past dates', () => {
      const yesterday = Temporal.Now.zonedDateTimeISO().subtract({ days: 1 });

      expect(isPast(yesterday)).toBe(true);
    });

    it('returns false for future dates', () => {
      const tomorrow = Temporal.Now.zonedDateTimeISO().add({ days: 1 });

      expect(isPast(tomorrow)).toBe(false);
    });

    it('returns true for dates one second in the past', () => {
      const past = Temporal.Now.zonedDateTimeISO().subtract({ seconds: 1 });

      expect(isPast(past)).toBe(true);
    });

    it('returns false for dates one second in the future', () => {
      const future = Temporal.Now.zonedDateTimeISO().add({ seconds: 1 });

      expect(isPast(future)).toBe(false);
    });

    it('works with different timezones', () => {
      const pastInTokyo = Temporal.Now.zonedDateTimeISO('Asia/Tokyo').subtract({
        hours: 1,
      });
      const pastInNY = Temporal.Now.zonedDateTimeISO(
        'America/New_York'
      ).subtract({ hours: 1 });

      expect(isPast(pastInTokyo)).toBe(true);
      expect(isPast(pastInNY)).toBe(true);
    });
  });

  describe('with Instant', () => {
    it('returns true for past instants', () => {
      const past = Temporal.Now.instant().subtract({ hours: 1 });

      expect(isPast(past)).toBe(true);
    });

    it('returns false for future instants', () => {
      const future = Temporal.Now.instant().add({ hours: 1 });

      expect(isPast(future)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('handles dates far in the past', () => {
      const farPast = Temporal.ZonedDateTime.from(
        '1970-01-01T00:00:00Z[UTC]'
      );

      expect(isPast(farPast)).toBe(true);
    });

    it('handles dates far in the future', () => {
      const farFuture = Temporal.ZonedDateTime.from(
        '2100-01-01T00:00:00Z[UTC]'
      );

      expect(isPast(farFuture)).toBe(false);
    });

    it('handles DST transitions', () => {
      const now = Temporal.Now.zonedDateTimeISO('America/New_York');
      // March 9, 2025: DST begins in New York
      const beforeDst = Temporal.ZonedDateTime.from(
        '2025-03-09T01:30:00-05:00[America/New_York]'
      );

      // Only check if the date is in the past relative to now
      if (now.epochMilliseconds > beforeDst.epochMilliseconds) {
        expect(isPast(beforeDst)).toBe(true);
      } else {
        expect(isPast(beforeDst)).toBe(false);
      }
    });

    it('compares by instant, not calendar datetime', () => {
      // Create a date that appears to be "now" in Tokyo timezone
      // but is actually in the future
      const nowUtc = Temporal.Now.instant();
      const futureInstant = nowUtc.add({ hours: 1 });
      const futureInTokyo = futureInstant.toZonedDateTimeISO('Asia/Tokyo');

      expect(isPast(futureInTokyo)).toBe(false);
    });
  });
});
