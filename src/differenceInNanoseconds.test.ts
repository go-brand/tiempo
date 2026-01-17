import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { differenceInNanoseconds } from './differenceInNanoseconds';

describe('differenceInNanoseconds', () => {
  describe('with Instant', () => {
    it('returns the number of nanoseconds between two instants', () => {
      const later = Temporal.Instant.from('2025-01-20T15:00:00.000000500Z');
      const earlier = Temporal.Instant.from('2025-01-20T15:00:00.000000000Z');

      expect(differenceInNanoseconds(later, earlier)).toBe(500n);
    });

    it('returns negative value when laterDate is before earlierDate', () => {
      const later = Temporal.Instant.from('2025-01-20T15:00:00.000000000Z');
      const earlier = Temporal.Instant.from('2025-01-20T15:00:00.000000500Z');

      expect(differenceInNanoseconds(later, earlier)).toBe(-500n);
    });

    it('returns 0n when both instants are equal', () => {
      const instant = Temporal.Instant.from('2025-01-20T15:00:00Z');

      expect(differenceInNanoseconds(instant, instant)).toBe(0n);
    });

    it('handles large time differences', () => {
      const later = Temporal.Instant.from('2025-01-20T15:00:01Z');
      const earlier = Temporal.Instant.from('2025-01-20T15:00:00Z');

      // 1 second = 1,000,000,000 nanoseconds
      expect(differenceInNanoseconds(later, earlier)).toBe(1000000000n);
    });

    it('handles full nanosecond precision', () => {
      const later = Temporal.Instant.from('2025-01-20T15:00:00.123456789Z');
      const earlier = Temporal.Instant.from('2025-01-20T15:00:00.000000000Z');

      // 123.456789 milliseconds = 123,456,789 nanoseconds
      expect(differenceInNanoseconds(later, earlier)).toBe(123456789n);
    });
  });

  describe('with ZonedDateTime', () => {
    it('returns the number of nanoseconds between two zoned datetimes', () => {
      const later = Temporal.ZonedDateTime.from(
        '2025-01-20T15:00:00.000000001-05:00[America/New_York]'
      );
      const earlier = Temporal.ZonedDateTime.from(
        '2025-01-20T15:00:00.000000000-05:00[America/New_York]'
      );

      expect(differenceInNanoseconds(later, earlier)).toBe(1n);
    });

    it('compares by instant, not calendar datetime', () => {
      const tokyo = Temporal.ZonedDateTime.from(
        '2025-01-21T00:00:00+09:00[Asia/Tokyo]'
      );
      const ny = Temporal.ZonedDateTime.from(
        '2025-01-20T10:00:00-05:00[America/New_York]'
      );

      // Both represent the same instant
      expect(differenceInNanoseconds(tokyo, ny)).toBe(0n);
    });
  });

  describe('with mixed types', () => {
    it('compares Instant with ZonedDateTime', () => {
      const instant = Temporal.Instant.from('2025-01-20T15:00:00.000000100Z');
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T15:00:00.000000000Z[UTC]'
      );

      expect(differenceInNanoseconds(instant, zoned)).toBe(100n);
    });
  });
});
