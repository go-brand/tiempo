import { describe, expect, expectTypeOf, it } from 'vitest';
import { Temporal } from './shared/temporal';
import { clamp } from './clamp';

describe('clamp', () => {
  const start = Temporal.PlainDate.from('2025-01-01');
  const end = Temporal.PlainDate.from('2025-01-31');

  it('returns the value itself when inside the interval', () => {
    const value = Temporal.PlainDate.from('2025-01-10');

    expect(clamp(value, { start, end })).toBe(value);
  });

  it('returns the nearer endpoint when outside', () => {
    expect(clamp(Temporal.PlainDate.from('2024-12-25'), { start, end })).toBe(start);
    expect(clamp(Temporal.PlainDate.from('2025-02-14'), { start, end })).toBe(end);
  });

  it('includes both endpoints', () => {
    const onStart = Temporal.PlainDate.from('2025-01-01');

    expect(clamp(onStart, { start, end })).toBe(onStart);
  });

  it('compares timeline values by instant and keeps the returned value intact', () => {
    const open = Temporal.ZonedDateTime.from('2025-01-20T09:00:00-05:00[America/New_York]');
    const close = Temporal.ZonedDateTime.from('2025-01-20T17:00:00-05:00[America/New_York]');
    const early = Temporal.Instant.from('2025-01-20T12:00:00Z'); // 07:00 in New York

    const result = clamp(early, { start: open, end: close });

    expect(result).toBe(open);
    expectTypeOf(result).toEqualTypeOf<Temporal.Instant | Temporal.ZonedDateTime>();
    expectTypeOf(clamp(open, { start: open, end: close })).toEqualTypeOf<Temporal.ZonedDateTime>();
  });

  it('clamps PlainTime values within a day', () => {
    const opening = {
      start: Temporal.PlainTime.from('09:00'),
      end: Temporal.PlainTime.from('17:00')
    };

    expect(clamp(Temporal.PlainTime.from('20:15'), opening).toString()).toBe('17:00:00');
  });

  it('throws when the interval is reversed', () => {
    expect(() => clamp(start, { start: end, end: start })).toThrow(
      new RangeError('clamp requires interval.start to be before or equal to interval.end')
    );
  });

  it('rejects mixed domains', () => {
    const instant = Temporal.Instant.from('2025-01-10T00:00:00Z');

    // @ts-expect-error Instant cannot be clamped to a PlainDate interval
    expect(() => clamp(instant, { start, end })).toThrow(TypeError);
  });
});
