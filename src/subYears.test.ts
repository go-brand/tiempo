import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { subYears } from './subYears';

describe('subYears', () => {
  it('subtracts positive years from instant', () => {
    const instant = Temporal.Instant.from('2030-01-20T12:00:00Z');
    const result = subYears(instant, 5);

    expect(result).toBeInstanceOf(Temporal.ZonedDateTime);
    expect(result.year).toBe(2025);
    expect(result.month).toBe(1);
    expect(result.day).toBe(20);
    expect(result.hour).toBe(12);
    expect(result.timeZoneId).toBe('UTC');
  });

  it('handles zero years', () => {
    const instant = Temporal.Instant.from('2025-01-20T12:00:00Z');
    const result = subYears(instant, 0);

    expect(result.year).toBe(2025);
  });

  it('preserves timezone when subtracting years', () => {
    const zoned = Temporal.ZonedDateTime.from(
      '2028-01-20T15:30:00-05:00[America/New_York]'
    );
    const result = subYears(zoned, 3);

    expect(result.year).toBe(2025);
    expect(result.month).toBe(1);
    expect(result.day).toBe(20);
    expect(result.hour).toBe(15);
    expect(result.minute).toBe(30);
    expect(result.timeZoneId).toBe('America/New_York');
  });

  it('handles subtracting years across decades', () => {
    const instant = Temporal.Instant.from('2075-01-01T00:00:00Z');
    const result = subYears(instant, 50);

    expect(result.year).toBe(2025);
    expect(result.month).toBe(1);
    expect(result.day).toBe(1);
  });

  it('handles leap year edge case (Feb 29 - 1 year = Feb 28)', () => {
    const leapDay = Temporal.Instant.from('2024-02-29T12:00:00Z');
    const result = subYears(leapDay, 1);

    expect(result.year).toBe(2023);
    expect(result.month).toBe(2);
    expect(result.day).toBe(28); // 2023 is not a leap year
  });

  it('handles leap year edge case (Feb 29 - 4 years = Feb 29)', () => {
    const leapDay = Temporal.Instant.from('2024-02-29T12:00:00Z');
    const result = subYears(leapDay, 4);

    expect(result.year).toBe(2020);
    expect(result.month).toBe(2);
    expect(result.day).toBe(29); // 2020 is also a leap year
  });

  it('handles DST offset differences when subtracting years', () => {
    // July (EDT)
    const zoned = Temporal.ZonedDateTime.from(
      '2025-07-15T14:00:00-04:00[America/New_York]'
    );
    const result = subYears(zoned, 3);

    // July 2022 (still EDT)
    expect(result.year).toBe(2022);
    expect(result.month).toBe(7);
    expect(result.day).toBe(15);
    expect(result.hour).toBe(14);
    expect(result.offset).toBe('-04:00');
  });

  it('preserves time precision when subtracting years', () => {
    const instant = Temporal.Instant.from('2028-01-20T14:30:45.123456789Z');
    const result = subYears(instant, 3);

    expect(result.year).toBe(2025);
    expect(result.hour).toBe(14);
    expect(result.minute).toBe(30);
    expect(result.second).toBe(45);
    expect(result.millisecond).toBe(123);
    expect(result.microsecond).toBe(456);
    expect(result.nanosecond).toBe(789);
  });
});
