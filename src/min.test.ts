import { describe, expect, expectTypeOf, it } from 'vitest';
import { Temporal } from './shared/temporal';
import { min } from './min';

describe('min', () => {
  it('returns the earliest timeline value as given', () => {
    const tokyo = Temporal.ZonedDateTime.from('2025-01-21T00:00:00+09:00[Asia/Tokyo]'); // 15:00Z on the 20th
    const instant = Temporal.Instant.from('2025-01-20T16:00:00Z');

    const result = min([instant, tokyo]);

    expect(result).toBe(tokyo);
    expectTypeOf(result).toEqualTypeOf<Temporal.Instant | Temporal.ZonedDateTime>();
  });

  it('preserves the element type of homogeneous arrays', () => {
    const instants = [
      Temporal.Instant.from('2025-01-02T00:00:00Z'),
      Temporal.Instant.from('2025-01-01T00:00:00Z')
    ];

    expectTypeOf(min(instants)).toEqualTypeOf<Temporal.Instant>();
    expect(min(instants)).toBe(instants[1]);
  });

  it('returns the first of equal values', () => {
    const utc = Temporal.ZonedDateTime.from('2025-01-20T15:00:00+00:00[UTC]');
    const ny = Temporal.ZonedDateTime.from('2025-01-20T10:00:00-05:00[America/New_York]');

    expect(min([utc, ny])).toBe(utc);
    expect(min([ny, utc])).toBe(ny);
  });

  it('handles PlainDate and PlainTime arrays', () => {
    const dates = ['2025-03-01', '2024-12-31', '2025-01-15'].map((d) => Temporal.PlainDate.from(d));
    const times = ['17:00', '09:00', '12:30'].map((t) => Temporal.PlainTime.from(t));

    expect(min(dates).toString()).toBe('2024-12-31');
    expect(min(times).toString()).toBe('09:00:00');
  });

  it('throws on an empty array', () => {
    expect(() => min([])).toThrow(new RangeError('min requires at least one value'));
  });

  it('rejects mixed domains', () => {
    const date = Temporal.PlainDate.from('2025-01-20');
    const instant = Temporal.Instant.from('2025-01-20T00:00:00Z');

    // @ts-expect-error PlainDate and Instant are different domains
    const mixed = () => min([date, instant]);
    expect(mixed).toThrow(TypeError);
  });
});
