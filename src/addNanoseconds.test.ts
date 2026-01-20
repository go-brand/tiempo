import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { addNanoseconds } from './addNanoseconds';

describe('addNanoseconds', () => {
  describe('from Temporal.Instant', () => {
    it('adds positive nanoseconds to instant', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00.000000000Z');
      const result = addNanoseconds(instant, 500);

      expect(result).toBeInstanceOf(Temporal.ZonedDateTime);
      expect(result.year).toBe(2025);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
      expect(result.hour).toBe(12);
      expect(result.minute).toBe(0);
      expect(result.second).toBe(0);
      expect(result.millisecond).toBe(0);
      expect(result.microsecond).toBe(0);
      expect(result.nanosecond).toBe(500);
      expect(result.timeZoneId).toBe('UTC');
    });

    it('adds negative nanoseconds (subtracts) to instant', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00.000000800Z');
      const result = addNanoseconds(instant, -300);

      expect(result.nanosecond).toBe(500);
      expect(result.microsecond).toBe(0);
    });

    it('adds zero nanoseconds (no change)', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00.000000500Z');
      const result = addNanoseconds(instant, 0);

      expect(result.nanosecond).toBe(500);
    });

    it('preserves other time components', () => {
      const instant = Temporal.Instant.from('2025-01-20T14:30:45.123456789Z');
      const result = addNanoseconds(instant, 100);

      expect(result.hour).toBe(14);
      expect(result.minute).toBe(30);
      expect(result.second).toBe(45);
      expect(result.millisecond).toBe(123);
      expect(result.microsecond).toBe(456);
      expect(result.nanosecond).toBe(889);
    });

    it('handles rollover to microseconds (1000ns = 1µs)', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00.000000800Z');
      const result = addNanoseconds(instant, 500);

      expect(result.microsecond).toBe(1);
      expect(result.nanosecond).toBe(300);
    });

    it('handles rollover across multiple microseconds', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00.000000000Z');
      const result = addNanoseconds(instant, 2500);

      expect(result.microsecond).toBe(2);
      expect(result.nanosecond).toBe(500);
    });

    it('handles negative rollover from microseconds', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00.000001200Z');
      const result = addNanoseconds(instant, -500);

      expect(result.microsecond).toBe(0);
      expect(result.nanosecond).toBe(700);
    });

    it('handles adding nanoseconds across millisecond boundaries', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00.000999800Z');
      const result = addNanoseconds(instant, 300);

      expect(result.millisecond).toBe(1);
      expect(result.microsecond).toBe(0);
      expect(result.nanosecond).toBe(100);
    });

    it('handles large nanosecond values crossing seconds', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00.000000000Z');
      const result = addNanoseconds(instant, 1500000000); // 1.5 seconds

      expect(result.second).toBe(1);
      expect(result.millisecond).toBe(500);
      expect(result.microsecond).toBe(0);
      expect(result.nanosecond).toBe(0);
    });
  });

  describe('from Temporal.ZonedDateTime', () => {
    it('adds nanoseconds and preserves timezone', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-01-20T15:30:00.000000000-05:00[America/New_York]'
      );
      const result = addNanoseconds(zoned, 750);

      expect(result.nanosecond).toBe(750);
      expect(result.timeZoneId).toBe('America/New_York');
    });

    it('handles nanoseconds through DST transition', () => {
      const zoned = Temporal.ZonedDateTime.from(
        '2025-03-09T01:59:59.999999500-05:00[America/New_York]'
      );
      const result = addNanoseconds(zoned, 600);

      expect(result.hour).toBe(3);
      expect(result.second).toBe(0);
      expect(result.millisecond).toBe(0);
      expect(result.microsecond).toBe(0);
      expect(result.nanosecond).toBe(100);
      expect(result.offset).toBe('-04:00');
    });
  });

  describe('real-world scenarios', () => {
    it('tracks system-level timing', () => {
      const sysStart = Temporal.Instant.from('2025-01-20T12:00:00.000000000Z');
      const interrupt1 = addNanoseconds(sysStart, 123);
      const interrupt2 = addNanoseconds(sysStart, 456);
      const interrupt3 = addNanoseconds(sysStart, 789);

      expect(interrupt1.nanosecond).toBe(123);
      expect(interrupt2.nanosecond).toBe(456);
      expect(interrupt3.nanosecond).toBe(789);
    });

    it('measures CPU clock cycles (assuming 1GHz = 1ns per cycle)', () => {
      const cycleStart = Temporal.Instant.from('2025-01-20T12:00:00.000000000Z');
      const after100cycles = addNanoseconds(cycleStart, 100);
      const after1000cycles = addNanoseconds(cycleStart, 1000);

      expect(after100cycles.nanosecond).toBe(100);
      expect(after1000cycles.microsecond).toBe(1);
      expect(after1000cycles.nanosecond).toBe(0);
    });

    it('tracks scientific measurements', () => {
      const measurementStart = Temporal.Instant.from('2025-01-20T12:00:00.000000000Z');
      const photonDetection = addNanoseconds(measurementStart, 3); // Light travels ~1 foot in 1ns
      const laserPulse = addNanoseconds(measurementStart, 50);

      expect(photonDetection.nanosecond).toBe(3);
      expect(laserPulse.nanosecond).toBe(50);
    });
  });

  describe('edge cases', () => {
    it('handles exactly 1000 nanoseconds', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00.000000000Z');
      const result = addNanoseconds(instant, 1000);

      expect(result.microsecond).toBe(1);
      expect(result.nanosecond).toBe(0);
    });

    it('handles very large nanosecond values (billions)', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00.000000000Z');
      const result = addNanoseconds(instant, 1000000000); // 1 second

      expect(result.second).toBe(1);
      expect(result.millisecond).toBe(0);
      expect(result.microsecond).toBe(0);
      expect(result.nanosecond).toBe(0);
    });

    it('handles maximum nanosecond precision (999)', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00.000000000Z');
      const result = addNanoseconds(instant, 999);

      expect(result.microsecond).toBe(0);
      expect(result.nanosecond).toBe(999);
    });

    it('handles nanosecond rollover at 999', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00.000000999Z');
      const result = addNanoseconds(instant, 1);

      expect(result.microsecond).toBe(1);
      expect(result.nanosecond).toBe(0);
    });

    it('handles negative nanoseconds from zero', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00.000000000Z');
      const result = addNanoseconds(instant, -1);

      expect(result.second).toBe(59);
      expect(result.minute).toBe(59);
      expect(result.hour).toBe(11);
      expect(result.millisecond).toBe(999);
      expect(result.microsecond).toBe(999);
      expect(result.nanosecond).toBe(999);
    });

    it('handles precise nanosecond addition without loss', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00.123456789Z');
      const result = addNanoseconds(instant, 210);

      expect(result.millisecond).toBe(123);
      expect(result.microsecond).toBe(456);
      expect(result.nanosecond).toBe(999);
    });

    it('handles boundary at 1000000000 nanoseconds (1 second)', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:59.000000000Z');
      const result = addNanoseconds(instant, 1000000000);

      expect(result.minute).toBe(1);
      expect(result.second).toBe(0);
      expect(result.millisecond).toBe(0);
      expect(result.microsecond).toBe(0);
      expect(result.nanosecond).toBe(0);
    });

    it('handles full precision across all units', () => {
      const instant = Temporal.Instant.from('2025-01-20T12:00:00.999999999Z');
      const result = addNanoseconds(instant, 1);

      expect(result.second).toBe(1);
      expect(result.millisecond).toBe(0);
      expect(result.microsecond).toBe(0);
      expect(result.nanosecond).toBe(0);
    });
  });
});
