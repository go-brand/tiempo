import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { subSeconds } from './subSeconds';

describe('subSeconds', () => {
  it('subtracts positive seconds from instant', () => {
    const instant = Temporal.Instant.from('2025-01-20T12:00:45Z');
    const result = subSeconds(instant, 30);

    expect(result).toBeInstanceOf(Temporal.ZonedDateTime);
    expect(result.hour).toBe(12);
    expect(result.minute).toBe(0);
    expect(result.second).toBe(15);
    expect(result.timeZoneId).toBe('UTC');
  });

  it('handles zero seconds', () => {
    const instant = Temporal.Instant.from('2025-01-20T12:00:30Z');
    const result = subSeconds(instant, 0);

    expect(result.second).toBe(30);
  });

  it('preserves timezone when subtracting seconds', () => {
    const zoned = Temporal.ZonedDateTime.from(
      '2025-01-20T15:30:45-05:00[America/New_York]'
    );
    const result = subSeconds(zoned, 30);

    expect(result.minute).toBe(30);
    expect(result.second).toBe(15);
    expect(result.timeZoneId).toBe('America/New_York');
  });

  it('handles subtracting seconds across minute boundaries', () => {
    const instant = Temporal.Instant.from('2025-01-20T12:00:10Z');
    const result = subSeconds(instant, 20);

    expect(result.hour).toBe(11);
    expect(result.minute).toBe(59);
    expect(result.second).toBe(50);
  });

  it('handles subtracting 60+ seconds', () => {
    const instant = Temporal.Instant.from('2025-01-20T12:02:05Z');
    const result = subSeconds(instant, 125);

    expect(result.minute).toBe(0);
    expect(result.second).toBe(0);
  });

  it('handles DST transition when subtracting seconds', () => {
    const zoned = Temporal.ZonedDateTime.from(
      '2025-03-09T03:00:05-04:00[America/New_York]'
    );
    const result = subSeconds(zoned, 10);

    expect(result.hour).toBe(1);
    expect(result.minute).toBe(59);
    expect(result.second).toBe(55);
    expect(result.offset).toBe('-05:00');
  });

  it('preserves time precision when subtracting seconds', () => {
    const instant = Temporal.Instant.from('2025-01-20T14:30:45.123456789Z');
    const result = subSeconds(instant, 10);

    expect(result.second).toBe(35);
    expect(result.millisecond).toBe(123);
    expect(result.microsecond).toBe(456);
    expect(result.nanosecond).toBe(789);
  });
});
