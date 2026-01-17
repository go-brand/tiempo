import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { differenceInWeeks } from './differenceInWeeks';

describe('differenceInWeeks', () => {
  describe('with Instant', () => {
    it('returns the number of weeks between two instants', () => {
      const later = Temporal.Instant.from('2025-02-10T12:00:00Z');
      const earlier = Temporal.Instant.from('2025-01-20T12:00:00Z');

      // 21 days = 3 weeks
      expect(differenceInWeeks(later, earlier)).toBe(3);
    });

    it('returns negative value when laterDate is before earlierDate', () => {
      const later = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const earlier = Temporal.Instant.from('2025-02-10T12:00:00Z');

      expect(differenceInWeeks(later, earlier)).toBe(-3);
    });

    it('returns 0 when both instants are equal', () => {
      const instant = Temporal.Instant.from('2025-01-20T15:00:00Z');

      expect(differenceInWeeks(instant, instant)).toBe(0);
    });

    it('returns fractional weeks for partial week differences', () => {
      const later = Temporal.Instant.from('2025-01-27T12:00:00Z');
      const earlier = Temporal.Instant.from('2025-01-20T12:00:00Z');

      // 7 days = 1 week
      expect(differenceInWeeks(later, earlier)).toBe(1);
    });

    it('handles partial weeks', () => {
      const later = Temporal.Instant.from('2025-01-30T12:00:00Z');
      const earlier = Temporal.Instant.from('2025-01-20T12:00:00Z');

      // 10 days = 1.428... weeks
      expect(differenceInWeeks(later, earlier)).toBeCloseTo(1.428, 2);
    });
  });

  describe('with ZonedDateTime', () => {
    it('returns the number of weeks between two zoned datetimes', () => {
      const later = Temporal.ZonedDateTime.from(
        '2025-02-10T15:00:00-05:00[America/New_York]'
      );
      const earlier = Temporal.ZonedDateTime.from(
        '2025-01-20T15:00:00-05:00[America/New_York]'
      );

      expect(differenceInWeeks(later, earlier)).toBe(3);
    });

    it('returns negative value when laterDate is before earlierDate', () => {
      const later = Temporal.ZonedDateTime.from(
        '2025-01-20T15:00:00-05:00[America/New_York]'
      );
      const earlier = Temporal.ZonedDateTime.from(
        '2025-02-10T15:00:00-05:00[America/New_York]'
      );

      expect(differenceInWeeks(later, earlier)).toBe(-3);
    });

    it('compares by instant in the timezone', () => {
      const tokyo = Temporal.ZonedDateTime.from(
        '2025-01-21T00:00:00+09:00[Asia/Tokyo]'
      );
      const ny = Temporal.ZonedDateTime.from(
        '2025-01-20T10:00:00-05:00[America/New_York]'
      );

      // Both represent the same instant
      expect(differenceInWeeks(tokyo, ny)).toBe(0);
    });

    it('handles DST transitions', () => {
      // Across DST spring forward
      const afterDst = Temporal.ZonedDateTime.from(
        '2025-03-16T12:00:00-04:00[America/New_York]'
      );
      const beforeDst = Temporal.ZonedDateTime.from(
        '2025-03-02T12:00:00-05:00[America/New_York]'
      );

      // 2 weeks (14 calendar days)
      expect(differenceInWeeks(afterDst, beforeDst)).toBe(2);
    });
  });

  describe('with mixed types', () => {
    it('compares Instant with ZonedDateTime', () => {
      const instant = Temporal.Instant.from('2025-02-10T15:00:00Z');
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T10:00:00-05:00[America/New_York]'
      );

      // NY 10:00 is 15:00 UTC
      expect(differenceInWeeks(instant, zoned)).toBe(3);
    });
  });

  describe('real-world scenarios', () => {
    it('calculates sprint duration', () => {
      const sprintEnd = Temporal.ZonedDateTime.from(
        '2025-02-03T17:00:00-05:00[America/New_York]'
      );
      const sprintStart = Temporal.ZonedDateTime.from(
        '2025-01-20T09:00:00-05:00[America/New_York]'
      );

      // 2-week sprint
      expect(differenceInWeeks(sprintEnd, sprintStart)).toBeCloseTo(2, 1);
    });

    it('calculates pregnancy weeks', () => {
      const now = Temporal.ZonedDateTime.from(
        '2025-06-15T12:00:00Z[UTC]'
      );
      const conception = Temporal.ZonedDateTime.from(
        '2025-01-01T12:00:00Z[UTC]'
      );

      // Approximately 23-24 weeks
      const weeks = differenceInWeeks(now, conception);
      expect(weeks).toBeGreaterThan(23);
      expect(weeks).toBeLessThan(25);
    });
  });

  describe('edge cases', () => {
    it('handles dates across year boundaries', () => {
      const later = Temporal.Instant.from('2025-01-12T00:00:00Z');
      const earlier = Temporal.Instant.from('2024-12-29T00:00:00Z');

      // 2 weeks
      expect(differenceInWeeks(later, earlier)).toBe(2);
    });

    it('handles very small differences', () => {
      const later = Temporal.Instant.from('2025-01-20T12:00:00Z');
      const earlier = Temporal.Instant.from('2025-01-20T00:00:00Z');

      // Less than a day
      expect(differenceInWeeks(later, earlier)).toBeLessThan(0.1);
    });
  });
});
