import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { subWeeks } from './subWeeks';

describe('subWeeks', () => {
  it('subtracts positive weeks from instant', () => {
    const instant = Temporal.Instant.from('2025-02-03T12:00:00Z');
    const result = subWeeks(instant, 2);

    expect(result).toBeInstanceOf(Temporal.ZonedDateTime);
    expect(result.year).toBe(2025);
    expect(result.month).toBe(1);
    expect(result.day).toBe(20);
    expect(result.hour).toBe(12);
    expect(result.timeZoneId).toBe('UTC');
  });

  it('handles zero weeks', () => {
    const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
    const result = subWeeks(instant, 0);

    expect(result.day).toBe(20);
  });

  it('preserves timezone when subtracting weeks', () => {
    const zoned = Temporal.ZonedDateTime.from(
      '2025-02-03T15:30:00-05:00[America/New_York]'
    );
    const result = subWeeks(zoned, 2);

    expect(result.year).toBe(2025);
    expect(result.month).toBe(1);
    expect(result.day).toBe(20);
    expect(result.hour).toBe(15);
    expect(result.minute).toBe(30);
    expect(result.timeZoneId).toBe('America/New_York');
  });

  it('handles subtracting weeks across month boundaries', () => {
    const instant = Temporal.Instant.from('2025-02-15T12:00:00Z');
    const result = subWeeks(instant, 4);

    expect(result.year).toBe(2025);
    expect(result.month).toBe(1);
    expect(result.day).toBe(18);
  });

  it('handles subtracting weeks across year boundaries', () => {
    const instant = Temporal.Instant.from('2025-01-08T12:00:00Z');
    const result = subWeeks(instant, 2);

    expect(result.year).toBe(2024);
    expect(result.month).toBe(12);
    expect(result.day).toBe(25);
  });

  it('handles DST transition when subtracting weeks', () => {
    // After DST transition
    const zoned = Temporal.ZonedDateTime.from(
      '2025-03-10T14:00:00-04:00[America/New_York]'
    );
    const result = subWeeks(zoned, 1);

    // Before DST transition
    expect(result.month).toBe(3);
    expect(result.day).toBe(3);
    expect(result.hour).toBe(14);
    expect(result.offset).toBe('-05:00');
    expect(result.timeZoneId).toBe('America/New_York');
  });

  it('preserves time precision when subtracting weeks', () => {
    const instant = Temporal.Instant.from('2025-02-10T14:30:45.123456789Z');
    const result = subWeeks(instant, 3);

    expect(result.day).toBe(20);
    expect(result.month).toBe(1);
    expect(result.hour).toBe(14);
    expect(result.minute).toBe(30);
    expect(result.second).toBe(45);
    expect(result.millisecond).toBe(123);
    expect(result.microsecond).toBe(456);
    expect(result.nanosecond).toBe(789);
  });
});
