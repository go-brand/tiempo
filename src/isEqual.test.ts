import { describe, expect, it } from 'vitest';
import { Temporal } from './shared/temporal';
import { isEqual } from './isEqual';
import { isSameNanosecond } from './isSameNanosecond';

describe('isEqual', () => {
  it('treats the same instant in different timezones as equal', () => {
    const ny = Temporal.ZonedDateTime.from('2025-01-20T10:00:00-05:00[America/New_York]');
    const tokyo = Temporal.ZonedDateTime.from('2025-01-21T00:00:00+09:00[Asia/Tokyo]');
    const instant = Temporal.Instant.from('2025-01-20T15:00:00Z');

    expect(isEqual(ny, tokyo)).toBe(true);
    expect(isEqual(ny, instant)).toBe(true);
    expect(isEqual(instant, instant.add({ nanoseconds: 1 }))).toBe(false);
  });

  it('distinguishes repeated wall-clock times that isSameNanosecond treats as equal', () => {
    const firstOneThirty = Temporal.ZonedDateTime.from(
      '2025-11-02T01:30:00-04:00[America/New_York]'
    );
    const secondOneThirty = Temporal.ZonedDateTime.from(
      '2025-11-02T01:30:00-05:00[America/New_York]'
    );

    expect(isEqual(firstOneThirty, secondOneThirty)).toBe(false);
    expect(isSameNanosecond(firstOneThirty, secondOneThirty)).toBe(true);
  });

  it('compares PlainDate pairs by date, across calendars', () => {
    const date = Temporal.PlainDate.from('2025-01-20');

    expect(isEqual(date, Temporal.PlainDate.from('2025-01-20'))).toBe(true);
    expect(isEqual(date, date.withCalendar('hebrew'))).toBe(true);
    expect(isEqual(date, Temporal.PlainDate.from('2025-01-21'))).toBe(false);
  });

  it('compares PlainTime pairs by wall-clock time', () => {
    expect(isEqual(Temporal.PlainTime.from('09:00'), Temporal.PlainTime.from('09:00:00.000'))).toBe(
      true
    );
    expect(
      isEqual(Temporal.PlainTime.from('09:00'), Temporal.PlainTime.from('09:00:00.000000001'))
    ).toBe(false);
  });

  it('rejects mixed domains', () => {
    const date = Temporal.PlainDate.from('2025-01-20');
    const instant = Temporal.Instant.from('2025-01-20T00:00:00Z');
    const time = Temporal.PlainTime.from('09:00');

    // @ts-expect-error PlainDate and Instant are different domains
    expect(() => isEqual(date, instant)).toThrow(
      new TypeError('PlainDate comparisons require two PlainDate values')
    );
    // @ts-expect-error PlainTime and Instant are different domains
    expect(() => isEqual(instant, time)).toThrow(
      new TypeError('PlainTime comparisons require two PlainTime values')
    );
  });
});
