import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { subHours } from './subHours';

describe('subHours', () => {
  it('subtracts positive hours from instant', () => {
    const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
    const result = subHours(instant, 6);

    expect(result).toBeInstanceOf(Temporal.ZonedDateTime);
    expect(result.year).toBe(2025);
    expect(result.month).toBe(1);
    expect(result.day).toBe(20);
    expect(result.hour).toBe(6);
    expect(result.timeZoneId).toBe('UTC');
  });

  it('handles zero hours', () => {
    const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
    const result = subHours(instant, 0);

    expect(result.hour).toBe(12);
  });

  it('preserves timezone when subtracting hours', () => {
    const zoned = Temporal.ZonedDateTime.from(
      '2025-01-20T15:30:00-05:00[America/New_York]'
    );
    const result = subHours(zoned, 8);

    expect(result.hour).toBe(7);
    expect(result.minute).toBe(30);
    expect(result.timeZoneId).toBe('America/New_York');
  });

  it('handles subtracting hours across day boundaries', () => {
    const instant = Temporal.Instant.from('2025-01-20T02:00:00Z');
    const result = subHours(instant, 5);

    expect(result.year).toBe(2025);
    expect(result.month).toBe(1);
    expect(result.day).toBe(19);
    expect(result.hour).toBe(21);
  });

  it('handles subtracting 24+ hours', () => {
    const instant = Temporal.Instant.from('2025-01-22T12:00:00Z');
    const result = subHours(instant, 48);

    expect(result.day).toBe(20);
    expect(result.hour).toBe(12);
  });

  it('handles DST transition when subtracting hours', () => {
    // After fall DST transition
    const zoned = Temporal.ZonedDateTime.from(
      '2025-11-03T01:00:00-05:00[America/New_York]'
    );
    const result = subHours(zoned, 2);

    expect(result.day).toBe(2);
    expect(result.hour).toBe(23);
    expect(result.offset).toBe('-05:00');
  });

  it('preserves time precision when subtracting hours', () => {
    const instant = Temporal.Instant.from('2025-01-20T14:30:45.123456789Z');
    const result = subHours(instant, 3);

    expect(result.hour).toBe(11);
    expect(result.minute).toBe(30);
    expect(result.second).toBe(45);
    expect(result.millisecond).toBe(123);
    expect(result.microsecond).toBe(456);
    expect(result.nanosecond).toBe(789);
  });
});
