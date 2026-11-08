import { describe, expect, expectTypeOf, it } from 'vitest';
import { Temporal } from './shared/temporal';
import { compareAsc } from './compareAsc';

describe('compareAsc', () => {
  it('returns -1, 0, or 1 by exact instant', () => {
    const earlier = Temporal.Instant.from('2025-01-20T15:00:00Z');
    const sameInstant = Temporal.ZonedDateTime.from('2025-01-20T10:00:00-05:00[America/New_York]');
    const later = Temporal.Instant.from('2025-01-20T15:00:00.000000001Z');

    expect(compareAsc(earlier, later)).toBe(-1);
    expect(compareAsc(later, earlier)).toBe(1);
    expect(compareAsc(earlier, sameInstant)).toBe(0);
  });

  it('sorts mixed Instant and ZonedDateTime values chronologically', () => {
    const march = Temporal.Instant.from('2025-03-01T00:00:00Z');
    const january = Temporal.ZonedDateTime.from('2025-01-01T00:00:00+09:00[Asia/Tokyo]');
    const february = Temporal.Instant.from('2025-02-01T00:00:00Z');
    const values = [march, january, february];

    values.sort(compareAsc);

    expect(values).toEqual([january, february, march]);
    expectTypeOf(values).toEqualTypeOf<(Temporal.Instant | Temporal.ZonedDateTime)[]>();
  });

  it('sorts PlainDate and PlainTime arrays', () => {
    const dates = ['2025-03-01', '2024-12-31', '2025-01-15'].map((d) => Temporal.PlainDate.from(d));
    const times = ['17:00', '09:00', '12:30'].map((t) => Temporal.PlainTime.from(t));

    expect(dates.sort(compareAsc).map(String)).toEqual(['2024-12-31', '2025-01-15', '2025-03-01']);
    expect(times.sort(compareAsc).map(String)).toEqual(['09:00:00', '12:30:00', '17:00:00']);
  });

  it('rejects mixed domains', () => {
    const date = Temporal.PlainDate.from('2025-01-20');
    const time = Temporal.PlainTime.from('09:00');

    // @ts-expect-error PlainDate and PlainTime are different domains
    const mixed = () => compareAsc(date, time);
    expect(mixed).toThrow(TypeError);
  });
});
