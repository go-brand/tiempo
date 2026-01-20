import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { subDays } from './subDays';

describe('subDays', () => {
  it('subtracts positive days from instant', () => {
    const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
    const result = subDays(instant, 5);

    expect(result).toBeInstanceOf(Temporal.ZonedDateTime);
    expect(result.year).toBe(2025);
    expect(result.month).toBe(1);
    expect(result.day).toBe(15);
    expect(result.hour).toBe(12);
    expect(result.timeZoneId).toBe('UTC');
  });

  it('handles zero days', () => {
    const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
    const result = subDays(instant, 0);

    expect(result.day).toBe(20);
  });

  it('preserves timezone when subtracting days', () => {
    const zoned = Temporal.ZonedDateTime.from(
      '2025-01-20T15:30:00-05:00[America/New_York]'
    );
    const result = subDays(zoned, 7);

    expect(result.year).toBe(2025);
    expect(result.month).toBe(1);
    expect(result.day).toBe(13);
    expect(result.hour).toBe(15);
    expect(result.minute).toBe(30);
    expect(result.timeZoneId).toBe('America/New_York');
  });

  it('handles subtracting days across month boundaries', () => {
    const instant = Temporal.Instant.from('2025-02-05T12:00:00Z');
    const result = subDays(instant, 10);

    expect(result.year).toBe(2025);
    expect(result.month).toBe(1);
    expect(result.day).toBe(26);
  });

  it('handles subtracting days across year boundaries', () => {
    const instant = Temporal.Instant.from('2025-01-05T12:00:00Z');
    const result = subDays(instant, 10);

    expect(result.year).toBe(2024);
    expect(result.month).toBe(12);
    expect(result.day).toBe(26);
  });

  it('handles DST transition when subtracting days', () => {
    // After DST transition
    const zoned = Temporal.ZonedDateTime.from(
      '2025-03-11T14:00:00-04:00[America/New_York]'
    );
    const result = subDays(zoned, 5);

    // Before DST transition
    expect(result.month).toBe(3);
    expect(result.day).toBe(6);
    expect(result.hour).toBe(14);
    expect(result.offset).toBe('-05:00');
    expect(result.timeZoneId).toBe('America/New_York');
  });

  it('preserves time precision when subtracting days', () => {
    const instant = Temporal.Instant.from('2025-01-20T14:30:45.123456789Z');
    const result = subDays(instant, 3);

    expect(result.day).toBe(17);
    expect(result.hour).toBe(14);
    expect(result.minute).toBe(30);
    expect(result.second).toBe(45);
    expect(result.millisecond).toBe(123);
    expect(result.microsecond).toBe(456);
    expect(result.nanosecond).toBe(789);
  });
});
