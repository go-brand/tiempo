import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { subNanoseconds } from './subNanoseconds';

describe('subNanoseconds', () => {
  it('subtracts positive nanoseconds from instant', () => {
    const instant = Temporal.Instant.from('2025-01-20T12:00:00.000000800Z');
    const result = subNanoseconds(instant, 300);

    expect(result).toBeInstanceOf(Temporal.ZonedDateTime);
    expect(result.nanosecond).toBe(500);
    expect(result.timeZoneId).toBe('UTC');
  });

  it('handles zero nanoseconds', () => {
    const instant = Temporal.Instant.from('2025-01-20T12:00:00.000000500Z');
    const result = subNanoseconds(instant, 0);

    expect(result.nanosecond).toBe(500);
  });

  it('preserves timezone when subtracting nanoseconds', () => {
    const zoned = Temporal.ZonedDateTime.from(
      '2025-01-20T15:30:00.000000750-05:00[America/New_York]'
    );
    const result = subNanoseconds(zoned, 250);

    expect(result.nanosecond).toBe(500);
    expect(result.timeZoneId).toBe('America/New_York');
  });

  it('handles rollover from microseconds', () => {
    const instant = Temporal.Instant.from('2025-01-20T12:00:00.000001200Z');
    const result = subNanoseconds(instant, 500);

    expect(result.microsecond).toBe(0);
    expect(result.nanosecond).toBe(700);
  });

  it('handles subtracting 1000+ nanoseconds', () => {
    const instant = Temporal.Instant.from('2025-01-20T12:00:00.000002500Z');
    const result = subNanoseconds(instant, 1500);

    expect(result.microsecond).toBe(1);
    expect(result.nanosecond).toBe(0);
  });

  it('handles maximum precision', () => {
    const instant = Temporal.Instant.from('2025-01-20T12:00:00.123456999Z');
    const result = subNanoseconds(instant, 210);

    expect(result.millisecond).toBe(123);
    expect(result.microsecond).toBe(456);
    expect(result.nanosecond).toBe(789);
  });
});
