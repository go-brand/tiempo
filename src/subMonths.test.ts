import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { subMonths } from './subMonths';

describe('subMonths', () => {
  it('subtracts positive months from instant', () => {
    const instant = Temporal.Instant.from('2025-04-20T12:00:00Z');
    const result = subMonths(instant, 3);

    expect(result).toBeInstanceOf(Temporal.ZonedDateTime);
    expect(result.year).toBe(2025);
    expect(result.month).toBe(1);
    expect(result.day).toBe(20);
    expect(result.hour).toBe(12);
    expect(result.timeZoneId).toBe('UTC');
  });

  it('handles zero months', () => {
    const instant = Temporal.Instant.from('2025-04-20T12:00:00Z');
    const result = subMonths(instant, 0);

    expect(result.month).toBe(4);
    expect(result.day).toBe(20);
  });

  it('preserves timezone when subtracting months', () => {
    const zoned = Temporal.ZonedDateTime.from(
      '2025-06-15T15:30:00-04:00[America/New_York]'
    );
    const result = subMonths(zoned, 4);

    expect(result.year).toBe(2025);
    expect(result.month).toBe(2);
    expect(result.day).toBe(15);
    expect(result.hour).toBe(15);
    expect(result.minute).toBe(30);
    expect(result.timeZoneId).toBe('America/New_York');
  });

  it('handles subtracting months across year boundaries', () => {
    const instant = Temporal.Instant.from('2025-02-15T12:00:00Z');
    const result = subMonths(instant, 4);

    expect(result.year).toBe(2024);
    expect(result.month).toBe(10);
    expect(result.day).toBe(15);
  });

  it('handles month-end edge case (Mar 31 - 1 month = Feb 28)', () => {
    const instant = Temporal.Instant.from('2025-03-31T12:00:00Z');
    const result = subMonths(instant, 1);

    expect(result.year).toBe(2025);
    expect(result.month).toBe(2);
    expect(result.day).toBe(28); // Constrained to Feb 28
  });

  it('handles month-end edge case with leap year (Mar 31 - 1 month = Feb 29)', () => {
    const instant = Temporal.Instant.from('2024-03-31T12:00:00Z');
    const result = subMonths(instant, 1);

    expect(result.year).toBe(2024);
    expect(result.month).toBe(2);
    expect(result.day).toBe(29); // Leap year
  });

  it('handles DST transition when subtracting months', () => {
    // December (EST)
    const zoned = Temporal.ZonedDateTime.from(
      '2025-12-15T14:00:00-05:00[America/New_York]'
    );
    const result = subMonths(zoned, 3);

    // September (EDT)
    expect(result.month).toBe(9);
    expect(result.day).toBe(15);
    expect(result.hour).toBe(14);
    expect(result.offset).toBe('-04:00');
  });

  it('preserves time precision when subtracting months', () => {
    const instant = Temporal.Instant.from('2025-06-20T14:30:45.123456789Z');
    const result = subMonths(instant, 2);

    expect(result.month).toBe(4);
    expect(result.hour).toBe(14);
    expect(result.minute).toBe(30);
    expect(result.second).toBe(45);
    expect(result.millisecond).toBe(123);
    expect(result.microsecond).toBe(456);
    expect(result.nanosecond).toBe(789);
  });
});
