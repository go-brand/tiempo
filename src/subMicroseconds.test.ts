import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { subMicroseconds } from './subMicroseconds';

describe('subMicroseconds', () => {
  it('subtracts positive microseconds from instant', () => {
    const instant = Temporal.Instant.from('2025-01-20T12:00:00.000800Z');
    const result = subMicroseconds(instant, 300);

    expect(result).toBeInstanceOf(Temporal.ZonedDateTime);
    expect(result.microsecond).toBe(500);
    expect(result.timeZoneId).toBe('UTC');
  });

  it('handles zero microseconds', () => {
    const instant = Temporal.Instant.from('2025-01-20T12:00:00.000500Z');
    const result = subMicroseconds(instant, 0);

    expect(result.microsecond).toBe(500);
  });

  it('preserves timezone when subtracting microseconds', () => {
    const zoned = Temporal.ZonedDateTime.from(
      '2025-01-20T15:30:00.000750-05:00[America/New_York]'
    );
    const result = subMicroseconds(zoned, 250);

    expect(result.microsecond).toBe(500);
    expect(result.timeZoneId).toBe('America/New_York');
  });

  it('handles rollover from milliseconds', () => {
    const instant = Temporal.Instant.from('2025-01-20T12:00:00.001200Z');
    const result = subMicroseconds(instant, 500);

    expect(result.millisecond).toBe(0);
    expect(result.microsecond).toBe(700);
  });

  it('handles subtracting 1000+ microseconds', () => {
    const instant = Temporal.Instant.from('2025-01-20T12:00:00.002500Z');
    const result = subMicroseconds(instant, 1500);

    expect(result.millisecond).toBe(1);
    expect(result.microsecond).toBe(0);
  });

  it('preserves nanosecond precision', () => {
    const instant = Temporal.Instant.from('2025-01-20T12:00:00.000500789Z');
    const result = subMicroseconds(instant, 100);

    expect(result.microsecond).toBe(400);
    expect(result.nanosecond).toBe(789);
  });
});
