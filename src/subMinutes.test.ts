import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { subMinutes } from './subMinutes';

describe('subMinutes', () => {
  it('subtracts positive minutes from instant', () => {
    const instant = Temporal.Instant.from('2025-01-20T12:30:00Z');
    const result = subMinutes(instant, 15);

    expect(result).toBeInstanceOf(Temporal.ZonedDateTime);
    expect(result.hour).toBe(12);
    expect(result.minute).toBe(15);
    expect(result.timeZoneId).toBe('UTC');
  });

  it('handles zero minutes', () => {
    const instant = Temporal.Instant.from('2025-01-20T12:30:00Z');
    const result = subMinutes(instant, 0);

    expect(result.minute).toBe(30);
  });

  it('preserves timezone when subtracting minutes', () => {
    const zoned = Temporal.ZonedDateTime.from(
      '2025-01-20T15:30:00-05:00[America/New_York]'
    );
    const result = subMinutes(zoned, 45);

    expect(result.hour).toBe(14);
    expect(result.minute).toBe(45);
    expect(result.timeZoneId).toBe('America/New_York');
  });

  it('handles subtracting minutes across hour boundaries', () => {
    const instant = Temporal.Instant.from('2025-01-20T12:10:00Z');
    const result = subMinutes(instant, 20);

    expect(result.hour).toBe(11);
    expect(result.minute).toBe(50);
  });

  it('handles subtracting 60+ minutes', () => {
    const instant = Temporal.Instant.from('2025-01-20T14:00:00Z');
    const result = subMinutes(instant, 125);

    expect(result.hour).toBe(11);
    expect(result.minute).toBe(55);
  });

  it('handles DST transition when subtracting minutes', () => {
    const zoned = Temporal.ZonedDateTime.from(
      '2025-03-09T03:05:00-04:00[America/New_York]'
    );
    const result = subMinutes(zoned, 10);

    expect(result.hour).toBe(1);
    expect(result.minute).toBe(55);
    expect(result.offset).toBe('-05:00');
  });

  it('preserves time precision when subtracting minutes', () => {
    const instant = Temporal.Instant.from('2025-01-20T14:30:45.123456789Z');
    const result = subMinutes(instant, 20);

    expect(result.minute).toBe(10);
    expect(result.second).toBe(45);
    expect(result.millisecond).toBe(123);
    expect(result.microsecond).toBe(456);
    expect(result.nanosecond).toBe(789);
  });
});
