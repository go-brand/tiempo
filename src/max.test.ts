import { describe, expect, expectTypeOf, it } from 'vitest';
import { Temporal } from './shared/temporal';
import { max } from './max';

describe('max', () => {
  it('returns the latest timeline value as given', () => {
    const instant = Temporal.Instant.from('2025-01-20T15:00:00Z');
    const ny = Temporal.ZonedDateTime.from('2025-01-20T11:00:00-05:00[America/New_York]'); // 16:00Z

    expect(max([instant, ny])).toBe(ny);
  });

  it('returns the first of equal values', () => {
    const utc = Temporal.ZonedDateTime.from('2025-01-20T15:00:00+00:00[UTC]');
    const ny = Temporal.ZonedDateTime.from('2025-01-20T10:00:00-05:00[America/New_York]');

    expect(max([utc, ny])).toBe(utc);
  });

  it('handles PlainDate and PlainTime arrays', () => {
    const dates = ['2025-03-01', '2024-12-31', '2025-01-15'].map((d) => Temporal.PlainDate.from(d));
    const times = ['17:00', '09:00', '23:59:59.999999999'].map((t) => Temporal.PlainTime.from(t));

    expectTypeOf(max(dates)).toEqualTypeOf<Temporal.PlainDate>();
    expect(max(dates).toString()).toBe('2025-03-01');
    expect(max(times).toString()).toBe('23:59:59.999999999');
  });

  it('throws on an empty array', () => {
    expect(() => max([])).toThrow(new RangeError('max requires at least one value'));
  });
});
