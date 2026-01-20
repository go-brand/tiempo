import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { subMilliseconds } from './subMilliseconds';

describe('subMilliseconds', () => {
  it('subtracts positive milliseconds from instant', () => {
    const instant = Temporal.Instant.from('2025-01-20T12:00:00.800Z');
    const result = subMilliseconds(instant, 300);

    expect(result).toBeInstanceOf(Temporal.ZonedDateTime);
    expect(result.millisecond).toBe(500);
    expect(result.timeZoneId).toBe('UTC');
  });

  it('handles zero milliseconds', () => {
    const instant = Temporal.Instant.from('2025-01-20T12:00:00.500Z');
    const result = subMilliseconds(instant, 0);

    expect(result.millisecond).toBe(500);
  });

  it('preserves timezone when subtracting milliseconds', () => {
    const zoned = Temporal.ZonedDateTime.from(
      '2025-01-20T15:30:00.750-05:00[America/New_York]'
    );
    const result = subMilliseconds(zoned, 250);

    expect(result.millisecond).toBe(500);
    expect(result.timeZoneId).toBe('America/New_York');
  });

  it('handles rollover from seconds', () => {
    const instant = Temporal.Instant.from('2025-01-20T12:00:01.200Z');
    const result = subMilliseconds(instant, 500);

    expect(result.second).toBe(0);
    expect(result.millisecond).toBe(700);
  });

  it('handles subtracting 1000+ milliseconds', () => {
    const instant = Temporal.Instant.from('2025-01-20T12:00:02.500Z');
    const result = subMilliseconds(instant, 1500);

    expect(result.second).toBe(1);
    expect(result.millisecond).toBe(0);
  });

  it('preserves microsecond and nanosecond precision', () => {
    const instant = Temporal.Instant.from('2025-01-20T12:00:00.500456789Z');
    const result = subMilliseconds(instant, 100);

    expect(result.millisecond).toBe(400);
    expect(result.microsecond).toBe(456);
    expect(result.nanosecond).toBe(789);
  });
});
