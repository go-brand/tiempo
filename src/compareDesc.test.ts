import { describe, expect, it } from 'vitest';
import { Temporal } from './shared/temporal';
import { compareDesc } from './compareDesc';

describe('compareDesc', () => {
  it('returns 1 when the first value is earlier and -1 when it is later', () => {
    const earlier = Temporal.Instant.from('2025-01-20T15:00:00Z');
    const later = Temporal.Instant.from('2025-01-20T16:00:00Z');

    expect(compareDesc(earlier, later)).toBe(1);
    expect(compareDesc(later, earlier)).toBe(-1);
    expect(Object.is(compareDesc(earlier, earlier), 0)).toBe(true);
  });

  it('sorts newest first', () => {
    const dates = ['2025-01-01', '2025-03-01', '2025-02-01'].map((d) => Temporal.PlainDate.from(d));

    expect(dates.sort(compareDesc).map(String)).toEqual(['2025-03-01', '2025-02-01', '2025-01-01']);
  });

  it('rejects mixed domains', () => {
    const time = Temporal.PlainTime.from('09:00');
    const zoned = Temporal.Now.zonedDateTimeISO('UTC');

    // @ts-expect-error PlainTime and ZonedDateTime are different domains
    const mixed = () => compareDesc(time, zoned);
    expect(mixed).toThrow(TypeError);
  });
});
