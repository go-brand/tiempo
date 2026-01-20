import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { addMicroseconds } from './addMicroseconds';

describe('addMicroseconds', () => {
  describe('from Temporal.Instant', () => {
    it('adds positive microseconds to instant', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00.000000Z');
      const result = addMicroseconds(instant, 500);

      expect(result).toBeInstanceOf(Temporal.ZonedDateTime);
      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
      expect(result.hour).toBe(12);
      expect(result.minute).toBe(0);
      expect(result.second).toBe(0);
      expect(result.millisecond).toBe(0);
      expect(result.microsecond).toBe(500);
      expect(result.timeZoneId).toBe('UTC');
    });

    it('adds negative microseconds (subtracts) to instant', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00.000800Z');
      const result = addMicroseconds(instant, -300);

      expect(result.microsecond).toBe(500);
      expect(result.millisecond).toBe(0);
    });

    it('adds zero microseconds (no change)', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00.000500Z');
      const result = addMicroseconds(instant, 0);

      expect(result.microsecond).toBe(500);
    });

    it('preserves nanosecond precision', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00.123456789Z');
      const result = addMicroseconds(instant, 100);

      expect(result.millisecond).toBe(123);
      expect(result.microsecond).toBe(556);
      expect(result.nanosecond).toBe(789);
    });

    it('handles rollover to milliseconds (1000µs = 1ms)', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00.000800Z');
      const result = addMicroseconds(instant, 500);

      expect(result.millisecond).toBe(1);
      expect(result.microsecond).toBe(300);
    });

    it('handles rollover across multiple milliseconds', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00.000000Z');
      const result = addMicroseconds(instant, 2500);

      expect(result.millisecond).toBe(2);
      expect(result.microsecond).toBe(500);
    });

    it('handles negative rollover from milliseconds', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00.001200Z');
      const result = addMicroseconds(instant, -500);

      expect(result.millisecond).toBe(0);
      expect(result.microsecond).toBe(700);
    });

    it('handles adding microseconds across second boundaries', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00.999800Z');
      const result = addMicroseconds(instant, 300);

      expect(result.second).toBe(1);
      expect(result.millisecond).toBe(0);
      expect(result.microsecond).toBe(100);
    });

    it('handles large microsecond values crossing seconds', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00.000000Z');
      const result = addMicroseconds(instant, 1500000); // 1.5 seconds

      expect(result.second).toBe(1);
      expect(result.millisecond).toBe(500);
      expect(result.microsecond).toBe(0);
    });
  });

  describe('from Temporal.ZonedDateTime', () => {
    it('adds microseconds and preserves timezone', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T15:30:00.000000-05:00[America/New_York]'
      );
      const result = addMicroseconds(zoned, 750);

      expect(result.microsecond).toBe(750);
      expect(result.timeZoneId).toBe('America/New_York');
    });

    it('handles microseconds through DST transition', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-03-09T01:59:59.999500-05:00[America/New_York]'
      );
      const result = addMicroseconds(zoned, 600);

      expect(result.hour).toBe(3);
      expect(result.second).toBe(0);
      expect(result.millisecond).toBe(0);
      expect(result.microsecond).toBe(100);
      expect(result.offset).toBe('-04:00');
    });
  });

  describe('real-world scenarios', () => {
    it('tracks high-precision profiling', () => {
      const profStart = Temporal.Instant.from('2025-01-20T12:00:00.000000Z');
      const dbQuery = addMicroseconds(profStart, 1234);
      const apiCall = addMicroseconds(profStart, 5678);
      const cacheHit = addMicroseconds(profStart, 89);

      expect(dbQuery.millisecond).toBe(1);
      expect(dbQuery.microsecond).toBe(234);
      expect(apiCall.millisecond).toBe(5);
      expect(apiCall.microsecond).toBe(678);
      expect(cacheHit.microsecond).toBe(89);
    });

    it('measures database query latency', () => {
      const queryStart = Temporal.Instant.from('2025-01-20T12:00:00.000000Z');
      const queryEnd = addMicroseconds(queryStart, 4567);

      expect(queryEnd.millisecond).toBe(4);
      expect(queryEnd.microsecond).toBe(567);
    });

    it('tracks microservice request timing', () => {
      const requestStart = Temporal.Instant.from('2025-01-20T12:00:00.000000Z');
      const authCheck = addMicroseconds(requestStart, 123);
      const dataFetch = addMicroseconds(requestStart, 2345);
      const responseReady = addMicroseconds(requestStart, 6789);

      expect(authCheck.microsecond).toBe(123);
      expect(dataFetch.millisecond).toBe(2);
      expect(dataFetch.microsecond).toBe(345);
      expect(responseReady.millisecond).toBe(6);
      expect(responseReady.microsecond).toBe(789);
    });
  });

  describe('edge cases', () => {
    it('handles exactly 1000 microseconds', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00.000000Z');
      const result = addMicroseconds(instant, 1000);

      expect(result.millisecond).toBe(1);
      expect(result.microsecond).toBe(0);
    });

    it('handles very large microsecond values (millions)', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00.000000Z');
      const result = addMicroseconds(instant, 1000000); // 1 second

      expect(result.second).toBe(1);
      expect(result.millisecond).toBe(0);
      expect(result.microsecond).toBe(0);
    });

    it('handles microseconds with existing nanosecond values', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00.000000999Z');
      const result = addMicroseconds(instant, 1);

      expect(result.microsecond).toBe(1);
      expect(result.nanosecond).toBe(999);
    });

    it('handles microsecond rollover with nanoseconds', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00.000999999Z');
      const result = addMicroseconds(instant, 1);

      expect(result.millisecond).toBe(1);
      expect(result.microsecond).toBe(0);
      expect(result.nanosecond).toBe(999);
    });

    it('handles negative microseconds from zero', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00.000000Z');
      const result = addMicroseconds(instant, -1);

      expect(result.second).toBe(59);
      expect(result.minute).toBe(59);
      expect(result.hour).toBe(11);
      expect(result.millisecond).toBe(999);
      expect(result.microsecond).toBe(999);
    });

    it('handles precise microsecond addition without loss', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00.123456Z');
      const result = addMicroseconds(instant, 789);

      expect(result.millisecond).toBe(124);
      expect(result.microsecond).toBe(245);
    });

    it('handles boundary at 1000000 microseconds (1 second)', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:59.000000Z');
      const result = addMicroseconds(instant, 1000000);

      expect(result.minute).toBe(1);
      expect(result.second).toBe(0);
      expect(result.millisecond).toBe(0);
      expect(result.microsecond).toBe(0);
    });
  });
});
