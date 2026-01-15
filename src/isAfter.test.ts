import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { isAfter } from './isAfter';

describe('isAfter', () => {
  describe('with ZonedDateTime', () => {
    it('returns true when date1 is after date2', () => {
      const earlier = Temporal.ZonedDateTime.from(
        '2025-01-20T10:00:00-05:00[America/New_York]'
      );
      const later = Temporal.ZonedDateTime.from(
        '2025-01-20T16:00:00-05:00[America/New_York]'
      );

      expect(isAfter(later, earlier)).toBe(true);
    });

    it('returns false when date1 is before date2', () => {
      const earlier = Temporal.ZonedDateTime.from(
        '2025-01-20T10:00:00-05:00[America/New_York]'
      );
      const later = Temporal.ZonedDateTime.from(
        '2025-01-20T16:00:00-05:00[America/New_York]'
      );

      expect(isAfter(earlier, later)).toBe(false);
    });

    it('returns false when dates are equal', () => {
      const date1 = Temporal.ZonedDateTime.from(
        '2025-01-20T10:00:00-05:00[America/New_York]'
      );
      const date2 = Temporal.ZonedDateTime.from(
        '2025-01-20T10:00:00-05:00[America/New_York]'
      );

      expect(isAfter(date1, date2)).toBe(false);
    });

    it('compares by instant, not calendar datetime', () => {
      // Same calendar time, different timezones = different instants
      const ny = Temporal.ZonedDateTime.from(
        '2025-01-20T10:00:00-05:00[America/New_York]'
      );
      const tokyo = Temporal.ZonedDateTime.from(
        '2025-01-20T10:00:00+09:00[Asia/Tokyo]'
      );

      // NY 10:00 is 15:00 UTC
      // Tokyo 10:00 is 01:00 UTC
      // So NY time is after Tokyo time
      expect(isAfter(ny, tokyo)).toBe(true);
      expect(isAfter(tokyo, ny)).toBe(false);
    });

    it('handles dates in different timezones', () => {
      const ny = Temporal.ZonedDateTime.from(
        '2025-01-20T10:00:00-05:00[America/New_York]'
      );
      const tokyo = Temporal.ZonedDateTime.from(
        '2025-01-21T00:00:00+09:00[Asia/Tokyo]'
      );

      // NY 10:00 is 15:00 UTC on Jan 20
      // Tokyo 00:00 is 15:00 UTC on Jan 20
      // They are the same instant
      expect(isAfter(ny, tokyo)).toBe(false);
      expect(isAfter(tokyo, ny)).toBe(false);
    });

    it('handles nanosecond precision', () => {
      const date1 = Temporal.ZonedDateTime.from(
        '2025-01-20T10:00:00.000000000-05:00[America/New_York]'
      );
      const date2 = Temporal.ZonedDateTime.from(
        '2025-01-20T10:00:00.000000001-05:00[America/New_York]'
      );

      expect(isAfter(date2, date1)).toBe(true);
      expect(isAfter(date1, date2)).toBe(false);
    });
  });

  describe('with Instant', () => {
    it('returns true when instant1 is after instant2', () => {
      const instant1 = Temporal.Instant.from('2025-01-20T15:00:00Z');
      const instant2 = Temporal.Instant.from('2025-01-20T16:00:00Z');

      expect(isAfter(instant2, instant1)).toBe(true);
    });

    it('returns false when instant1 is before instant2', () => {
      const instant1 = Temporal.Instant.from('2025-01-20T15:00:00Z');
      const instant2 = Temporal.Instant.from('2025-01-20T16:00:00Z');

      expect(isAfter(instant1, instant2)).toBe(false);
    });

    it('returns false when instants are equal', () => {
      const instant1 = Temporal.Instant.from('2025-01-20T15:00:00Z');
      const instant2 = Temporal.Instant.from('2025-01-20T15:00:00Z');

      expect(isAfter(instant1, instant2)).toBe(false);
    });

    it('handles nanosecond precision', () => {
      const instant1 = Temporal.Instant.from('2025-01-20T15:00:00.000000000Z');
      const instant2 = Temporal.Instant.from('2025-01-20T15:00:00.000000001Z');

      expect(isAfter(instant2, instant1)).toBe(true);
      expect(isAfter(instant1, instant2)).toBe(false);
    });
  });

  describe('with mixed types', () => {
    it('compares Instant with ZonedDateTime', () => {
      const instant = Temporal.Instant.from('2025-01-20T15:00:00Z');
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T10:00:00-05:00[America/New_York]'
      );

      // NY 10:00 is 15:00 UTC - same instant
      expect(isAfter(instant, zoned)).toBe(false);
      expect(isAfter(zoned, instant)).toBe(false);
    });

    it('compares ZonedDateTime with Instant', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T10:00:00-05:00[America/New_York]'
      );
      const instant = Temporal.Instant.from('2025-01-20T16:00:00Z');

      // NY 10:00 is 15:00 UTC, instant is 16:00 UTC
      expect(isAfter(instant, zoned)).toBe(true);
      expect(isAfter(zoned, instant)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('handles dates far in the past', () => {
      const past = Temporal.ZonedDateTime.from(
        '1970-01-01T00:00:00Z[UTC]'
      );
      const present = Temporal.ZonedDateTime.from(
        '2025-01-20T10:00:00Z[UTC]'
      );

      expect(isAfter(present, past)).toBe(true);
    });

    it('handles dates far in the future', () => {
      const present = Temporal.ZonedDateTime.from(
        '2025-01-20T10:00:00Z[UTC]'
      );
      const future = Temporal.ZonedDateTime.from(
        '2100-01-01T00:00:00Z[UTC]'
      );

      expect(isAfter(future, present)).toBe(true);
    });

    it('handles DST transitions', () => {
      // March 9, 2025: DST begins in New York (2 AM -> 3 AM)
      const beforeDst = Temporal.ZonedDateTime.from(
        '2025-03-09T01:30:00-05:00[America/New_York]'
      );
      const afterDst = Temporal.ZonedDateTime.from(
        '2025-03-09T03:30:00-04:00[America/New_York]'
      );

      // Only 1 hour of wall-clock time passed, but they are still sequential instants
      expect(isAfter(afterDst, beforeDst)).toBe(true);
    });

    it('handles same instant with different offsets during DST', () => {
      // November 2, 2025: DST ends in New York (2 AM -> 1 AM)
      // There are two 1:30 AMs on this day
      const firstOccurrence = Temporal.ZonedDateTime.from(
        '2025-11-02T01:30:00-04:00[America/New_York]'
      );
      const secondOccurrence = Temporal.ZonedDateTime.from(
        '2025-11-02T01:30:00-05:00[America/New_York]'
      );

      // Second occurrence is after first occurrence
      expect(isAfter(secondOccurrence, firstOccurrence)).toBe(true);
    });
  });
});
