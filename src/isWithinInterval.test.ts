import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { isWithinInterval } from './isWithinInterval';

describe('isWithinInterval', () => {
  describe('with ZonedDateTime', () => {
    it('returns true when date is within the interval', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-01T00:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-01-07T00:00:00Z[UTC]');
      const date = Temporal.ZonedDateTime.from('2025-01-03T00:00:00Z[UTC]');

      expect(isWithinInterval(date, { start, end })).toBe(true);
    });

    it('returns false when date is before the interval', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-01T00:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-01-07T00:00:00Z[UTC]');
      const date = Temporal.ZonedDateTime.from('2024-12-25T00:00:00Z[UTC]');

      expect(isWithinInterval(date, { start, end })).toBe(false);
    });

    it('returns false when date is after the interval', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-01T00:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-01-07T00:00:00Z[UTC]');
      const date = Temporal.ZonedDateTime.from('2025-01-10T00:00:00Z[UTC]');

      expect(isWithinInterval(date, { start, end })).toBe(false);
    });

    it('returns true when date equals interval start (inclusive)', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-01T00:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-01-07T00:00:00Z[UTC]');

      expect(isWithinInterval(start, { start, end })).toBe(true);
    });

    it('returns true when date equals interval end (inclusive)', () => {
      const start = Temporal.ZonedDateTime.from('2025-01-01T00:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2025-01-07T00:00:00Z[UTC]');

      expect(isWithinInterval(end, { start, end })).toBe(true);
    });

    it('compares by instant, not calendar datetime', () => {
      // Same calendar time, different timezones = different instants
      const start = Temporal.ZonedDateTime.from(
        '2025-01-01T10:00:00-05:00[America/New_York]'
      );
      const end = Temporal.ZonedDateTime.from(
        '2025-01-01T20:00:00-05:00[America/New_York]'
      );
      // This is 10:00 Tokyo time, which is 01:00 UTC
      // NY start is 15:00 UTC, NY end is 01:00 UTC next day
      const tokyoDate = Temporal.ZonedDateTime.from(
        '2025-01-01T18:00:00+09:00[Asia/Tokyo]'
      );

      // Tokyo 18:00 is 09:00 UTC, which is before NY start (15:00 UTC)
      expect(isWithinInterval(tokyoDate, { start, end })).toBe(false);

      // A date that is actually within the interval
      const withinDate = Temporal.ZonedDateTime.from(
        '2025-01-02T01:00:00+09:00[Asia/Tokyo]'
      );
      // Tokyo 01:00 Jan 2 is 16:00 UTC Jan 1, which is within [15:00 UTC, 01:00 UTC next day]
      expect(isWithinInterval(withinDate, { start, end })).toBe(true);
    });

    it('handles nanosecond precision', () => {
      const start = Temporal.ZonedDateTime.from(
        '2025-01-01T00:00:00.000000000Z[UTC]'
      );
      const end = Temporal.ZonedDateTime.from(
        '2025-01-01T00:00:00.000000002Z[UTC]'
      );

      const within = Temporal.ZonedDateTime.from(
        '2025-01-01T00:00:00.000000001Z[UTC]'
      );
      const outside = Temporal.ZonedDateTime.from(
        '2025-01-01T00:00:00.000000003Z[UTC]'
      );

      expect(isWithinInterval(within, { start, end })).toBe(true);
      expect(isWithinInterval(outside, { start, end })).toBe(false);
    });
  });

  describe('with Instant', () => {
    it('returns true when instant is within the interval', () => {
      const start = Temporal.Instant.from('2025-01-01T00:00:00Z');
      const end = Temporal.Instant.from('2025-01-07T00:00:00Z');
      const date = Temporal.Instant.from('2025-01-03T00:00:00Z');

      expect(isWithinInterval(date, { start, end })).toBe(true);
    });

    it('returns false when instant is outside the interval', () => {
      const start = Temporal.Instant.from('2025-01-01T00:00:00Z');
      const end = Temporal.Instant.from('2025-01-07T00:00:00Z');
      const date = Temporal.Instant.from('2025-01-10T00:00:00Z');

      expect(isWithinInterval(date, { start, end })).toBe(false);
    });

    it('returns true when instant equals start', () => {
      const start = Temporal.Instant.from('2025-01-01T00:00:00Z');
      const end = Temporal.Instant.from('2025-01-07T00:00:00Z');

      expect(isWithinInterval(start, { start, end })).toBe(true);
    });

    it('returns true when instant equals end', () => {
      const start = Temporal.Instant.from('2025-01-01T00:00:00Z');
      const end = Temporal.Instant.from('2025-01-07T00:00:00Z');

      expect(isWithinInterval(end, { start, end })).toBe(true);
    });

    it('handles nanosecond precision', () => {
      const start = Temporal.Instant.from('2025-01-01T00:00:00.000000000Z');
      const end = Temporal.Instant.from('2025-01-01T00:00:00.000000002Z');

      const within = Temporal.Instant.from('2025-01-01T00:00:00.000000001Z');
      const outside = Temporal.Instant.from('2025-01-01T00:00:00.000000003Z');

      expect(isWithinInterval(within, { start, end })).toBe(true);
      expect(isWithinInterval(outside, { start, end })).toBe(false);
    });
  });

  describe('with mixed types', () => {
    it('compares Instant date with ZonedDateTime interval', () => {
      const start = Temporal.ZonedDateTime.from(
        '2025-01-01T00:00:00Z[UTC]'
      );
      const end = Temporal.ZonedDateTime.from(
        '2025-01-07T00:00:00Z[UTC]'
      );
      const date = Temporal.Instant.from('2025-01-03T00:00:00Z');

      expect(isWithinInterval(date, { start, end })).toBe(true);
    });

    it('compares ZonedDateTime date with Instant interval', () => {
      const start = Temporal.Instant.from('2025-01-01T00:00:00Z');
      const end = Temporal.Instant.from('2025-01-07T00:00:00Z');
      const date = Temporal.ZonedDateTime.from(
        '2025-01-03T00:00:00Z[UTC]'
      );

      expect(isWithinInterval(date, { start, end })).toBe(true);
    });

    it('handles mixed interval bounds', () => {
      const start = Temporal.Instant.from('2025-01-01T00:00:00Z');
      const end = Temporal.ZonedDateTime.from(
        '2025-01-07T00:00:00-05:00[America/New_York]'
      );
      const date = Temporal.ZonedDateTime.from(
        '2025-01-03T00:00:00Z[UTC]'
      );

      expect(isWithinInterval(date, { start, end })).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('handles single-point interval (start equals end)', () => {
      const point = Temporal.ZonedDateTime.from('2025-01-01T00:00:00Z[UTC]');

      expect(isWithinInterval(point, { start: point, end: point })).toBe(true);

      const other = Temporal.ZonedDateTime.from('2025-01-02T00:00:00Z[UTC]');
      expect(isWithinInterval(other, { start: point, end: point })).toBe(false);
    });

    it('handles dates far in the past', () => {
      const start = Temporal.ZonedDateTime.from('1970-01-01T00:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2000-01-01T00:00:00Z[UTC]');
      const date = Temporal.ZonedDateTime.from('1985-01-01T00:00:00Z[UTC]');

      expect(isWithinInterval(date, { start, end })).toBe(true);
    });

    it('handles dates far in the future', () => {
      const start = Temporal.ZonedDateTime.from('2100-01-01T00:00:00Z[UTC]');
      const end = Temporal.ZonedDateTime.from('2200-01-01T00:00:00Z[UTC]');
      const date = Temporal.ZonedDateTime.from('2150-01-01T00:00:00Z[UTC]');

      expect(isWithinInterval(date, { start, end })).toBe(true);
    });

    it('handles DST transitions', () => {
      // March 9, 2025: DST begins in New York (2 AM -> 3 AM)
      const start = Temporal.ZonedDateTime.from(
        '2025-03-09T01:00:00-05:00[America/New_York]'
      );
      const end = Temporal.ZonedDateTime.from(
        '2025-03-09T04:00:00-04:00[America/New_York]'
      );
      const duringDst = Temporal.ZonedDateTime.from(
        '2025-03-09T03:30:00-04:00[America/New_York]'
      );

      expect(isWithinInterval(duringDst, { start, end })).toBe(true);
    });

    it('handles DST fall back with ambiguous times', () => {
      // November 2, 2025: DST ends in New York (2 AM -> 1 AM)
      // There are two 1:30 AMs on this day
      const start = Temporal.ZonedDateTime.from(
        '2025-11-02T00:00:00-04:00[America/New_York]'
      );
      const end = Temporal.ZonedDateTime.from(
        '2025-11-02T03:00:00-05:00[America/New_York]'
      );

      // First occurrence of 1:30 AM (still in DST)
      const firstOccurrence = Temporal.ZonedDateTime.from(
        '2025-11-02T01:30:00-04:00[America/New_York]'
      );
      // Second occurrence of 1:30 AM (after DST ends)
      const secondOccurrence = Temporal.ZonedDateTime.from(
        '2025-11-02T01:30:00-05:00[America/New_York]'
      );

      expect(isWithinInterval(firstOccurrence, { start, end })).toBe(true);
      expect(isWithinInterval(secondOccurrence, { start, end })).toBe(true);
    });

    it('returns false when date is one nanosecond before start', () => {
      const start = Temporal.Instant.from('2025-01-01T00:00:00.000000001Z');
      const end = Temporal.Instant.from('2025-01-07T00:00:00Z');
      const date = Temporal.Instant.from('2025-01-01T00:00:00.000000000Z');

      expect(isWithinInterval(date, { start, end })).toBe(false);
    });

    it('returns false when date is one nanosecond after end', () => {
      const start = Temporal.Instant.from('2025-01-01T00:00:00Z');
      const end = Temporal.Instant.from('2025-01-07T00:00:00.000000000Z');
      const date = Temporal.Instant.from('2025-01-07T00:00:00.000000001Z');

      expect(isWithinInterval(date, { start, end })).toBe(false);
    });
  });
});
