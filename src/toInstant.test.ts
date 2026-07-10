import { describe, expect, expectTypeOf, it } from 'vitest';
import { Temporal } from './shared/temporal';
import { toInstant } from './toInstant';
import { toIso } from './toIso';
import { toZonedTime } from './toZonedTime';

describe('toInstant', () => {
  it('returns an Instant from every supported representation', () => {
    const iso = '2025-01-20T20:00:00Z';
    const epochMilliseconds = 1737403200000;
    const date = new Date(iso);
    const zoned = Temporal.ZonedDateTime.from(
      '2025-01-20T15:00:00-05:00[America/New_York]'
    );

    expect(toInstant(iso).toString()).toBe(iso);
    expect(toInstant(epochMilliseconds).toString()).toBe(iso);
    expect(toInstant(date).toString()).toBe(iso);
    expect(toInstant(zoned).toString()).toBe(iso);
  });

  it('preserves precision for ISO strings, timestamps, and Date values', () => {
    expect(toInstant('2025-01-20T20:00:00.123456789Z').toString()).toBe(
      '2025-01-20T20:00:00.123456789Z'
    );
    expect(toInstant(1737403200123).toString()).toBe(
      '2025-01-20T20:00:00.123Z'
    );
    expect(toInstant(new Date('2025-01-20T20:00:00.123Z')).toString()).toBe(
      '2025-01-20T20:00:00.123Z'
    );
  });

  it('preserves an Instant input as the same value', () => {
    const instant = Temporal.Instant.from('2025-01-20T20:00:00Z');
    const result = toInstant(instant);

    expect(result).toBe(instant);
    expectTypeOf(result).toEqualTypeOf<Temporal.Instant>();
  });

  it('preserves the exact moment across timezone conversions', () => {
    const original = '2025-06-15T14:30:00Z';
    const timezones = [
      'America/New_York',
      'Asia/Tokyo',
      'Europe/London',
    ] as const;

    for (const timezone of timezones) {
      expect(toInstant(toZonedTime(original, timezone)).toString()).toBe(
        original
      );
    }
  });

  it('round-trips through ZonedDateTime without losing the instant', () => {
    const original = toInstant('2025-03-15T18:45:12.5Z');
    const zoned = toZonedTime(original, 'America/Denver');
    const roundTrip = toInstant(zoned);

    expect(roundTrip.epochNanoseconds).toBe(original.epochNanoseconds);
    expect(toIso(roundTrip)).toBe('2025-03-15T18:45:12.5Z');
  });
});
