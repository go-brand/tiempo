import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { differenceInMicroseconds } from './differenceInMicroseconds';

describe('differenceInMicroseconds', () => {
  describe('with Instant', () => {
    it('returns the number of microseconds between two instants', () => {
      const later = Temporal.Instant.from('2025-01-20T15:00:00.001000Z');
      const earlier = Temporal.Instant.from('2025-01-20T15:00:00.000000Z');

      expect(differenceInMicroseconds(later, earlier)).toBe(1000);
    });

    it('returns negative value when laterDate is before earlierDate', () => {
      const later = Temporal.Instant.from('2025-01-20T15:00:00.000000Z');
      const earlier = Temporal.Instant.from('2025-01-20T15:00:00.001000Z');

      expect(differenceInMicroseconds(later, earlier)).toBe(-1000);
    });

    it('returns 0 when both instants are equal', () => {
      const instant = Temporal.Instant.from('2025-01-20T15:00:00Z');

      expect(differenceInMicroseconds(instant, instant)).toBe(0);
    });

    it('handles large time differences', () => {
      const later = Temporal.Instant.from('2025-01-20T15:00:01Z');
      const earlier = Temporal.Instant.from('2025-01-20T15:00:00Z');

      // 1 second = 1,000,000 microseconds
      expect(differenceInMicroseconds(later, earlier)).toBe(1000000);
    });

    it('handles microsecond precision', () => {
      const later = Temporal.Instant.from('2025-01-20T15:00:00.000500Z');
      const earlier = Temporal.Instant.from('2025-01-20T15:00:00.000000Z');

      expect(differenceInMicroseconds(later, earlier)).toBe(500);
    });

    it('truncates sub-microsecond precision', () => {
      const later = Temporal.Instant.from('2025-01-20T15:00:00.000001999Z');
      const earlier = Temporal.Instant.from('2025-01-20T15:00:00.000000001Z');

      // Only microsecond precision is returned
      expect(differenceInMicroseconds(later, earlier)).toBe(1);
    });
  });

  describe('with ZonedDateTime', () => {
    it('returns the number of microseconds between two zoned datetimes', () => {
      const later = Temporal.ZonedDateTime.from(
        '2025-01-20T15:00:00.001000-05:00[America/New_York]'
      );
      const earlier = Temporal.ZonedDateTime.from(
        '2025-01-20T15:00:00.000000-05:00[America/New_York]'
      );

      expect(differenceInMicroseconds(later, earlier)).toBe(1000);
    });

    it('compares by instant, not calendar datetime', () => {
      const tokyo = Temporal.ZonedDateTime.from(
        '2025-01-21T00:00:00+09:00[Asia/Tokyo]'
      );
      const ny = Temporal.ZonedDateTime.from(
        '2025-01-20T10:00:00-05:00[America/New_York]'
      );

      // Both represent the same instant
      expect(differenceInMicroseconds(tokyo, ny)).toBe(0);
    });
  });

  describe('with mixed types', () => {
    it('compares Instant with ZonedDateTime', () => {
      const instant = Temporal.Instant.from('2025-01-20T15:00:00.001000Z');
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T15:00:00.000000Z[UTC]'
      );

      expect(differenceInMicroseconds(instant, zoned)).toBe(1000);
    });
  });
});
