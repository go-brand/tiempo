import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { isFuture } from './isFuture';

describe('isFuture', () => {
  describe('with ZonedDateTime', () => {
    it('returns true for future dates', () => {
      const tomorrow = Temporal.Now.zonedDateTimeISO().add({ days: 1 });

      expect(isFuture(tomorrow)).toBe(true);
    });

    it('returns false for past dates', () => {
      const yesterday = Temporal.Now.zonedDateTimeISO().subtract({ days: 1 });

      expect(isFuture(yesterday)).toBe(false);
    });

    it('returns false for current instant', () => {
      const now = Temporal.Now.zonedDateTimeISO();

      expect(isFuture(now)).toBe(false);
    });

    it('returns true for dates one second in the future', () => {
      const future = Temporal.Now.zonedDateTimeISO().add({ seconds: 1 });

      expect(isFuture(future)).toBe(true);
    });

    it('returns false for dates one second in the past', () => {
      const past = Temporal.Now.zonedDateTimeISO().subtract({ seconds: 1 });

      expect(isFuture(past)).toBe(false);
    });

    it('works with different timezones', () => {
      const futureInTokyo = Temporal.Now.zonedDateTimeISO('Asia/Tokyo').add({
        hours: 1,
      });
      const futureInNY = Temporal.Now.zonedDateTimeISO(
        'America/New_York'
      ).add({ hours: 1 });

      expect(isFuture(futureInTokyo)).toBe(true);
      expect(isFuture(futureInNY)).toBe(true);
    });
  });

  describe('with Instant', () => {
    it('returns true for future instants', () => {
      const future = Temporal.Now.instant().add({ hours: 1 });

      expect(isFuture(future)).toBe(true);
    });

    it('returns false for past instants', () => {
      const past = Temporal.Now.instant().subtract({ hours: 1 });

      expect(isFuture(past)).toBe(false);
    });

    it('returns false for current instant', () => {
      const now = Temporal.Now.instant();

      expect(isFuture(now)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('handles dates far in the future', () => {
      const farFuture = Temporal.ZonedDateTime.from(
        '2100-01-01T00:00:00Z[UTC]'
      );

      expect(isFuture(farFuture)).toBe(true);
    });

    it('handles dates far in the past', () => {
      const farPast = Temporal.ZonedDateTime.from('1970-01-01T00:00:00Z[UTC]');

      expect(isFuture(farPast)).toBe(false);
    });

    it('handles DST transitions', () => {
      const now = Temporal.Now.zonedDateTimeISO('America/New_York');
      // March 9, 2025: DST begins in New York
      const afterDst = Temporal.ZonedDateTime.from(
        '2025-03-09T03:30:00-04:00[America/New_York]'
      );

      // Only check if the date is in the future relative to now
      if (now.epochMilliseconds < afterDst.epochMilliseconds) {
        expect(isFuture(afterDst)).toBe(true);
      } else {
        expect(isFuture(afterDst)).toBe(false);
      }
    });

    it('compares by instant, not calendar datetime', () => {
      // Create a date that appears to be "now" in Tokyo timezone
      // but is actually in the past
      const nowUtc = Temporal.Now.instant();
      const pastInstant = nowUtc.subtract({ hours: 1 });
      const pastInTokyo = pastInstant.toZonedDateTimeISO('Asia/Tokyo');

      expect(isFuture(pastInTokyo)).toBe(false);
    });
  });
});
