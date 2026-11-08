import { describe, expect, expectTypeOf, it } from 'vitest';
import { Temporal } from './shared/temporal';
import { closestTo } from './closestTo';

describe('closestTo', () => {
  it('returns the nearest timeline candidate, before or after the target', () => {
    const target = Temporal.Instant.from('2025-01-20T12:00:00Z');
    const before = Temporal.Instant.from('2025-01-20T09:00:00Z');
    const after = Temporal.ZonedDateTime.from('2025-01-20T08:30:00-05:00[America/New_York]'); // 13:30Z

    const result = closestTo(target, [before, after]);

    expect(result).toBe(after);
    expectTypeOf(result).toEqualTypeOf<Temporal.Instant | Temporal.ZonedDateTime | undefined>();
  });

  it('returns undefined for no candidates', () => {
    expect(closestTo(Temporal.Instant.from('2025-01-20T12:00:00Z'), [])).toBeUndefined();
  });

  it('returns the first candidate on a tie', () => {
    const target = Temporal.Instant.from('2025-01-20T12:00:00Z');
    const hourBefore = Temporal.Instant.from('2025-01-20T11:00:00Z');
    const hourAfter = Temporal.Instant.from('2025-01-20T13:00:00Z');

    expect(closestTo(target, [hourAfter, hourBefore])).toBe(hourAfter);
  });

  it('measures exact elapsed time, including sub-millisecond differences', () => {
    const target = Temporal.Instant.from('2025-01-20T12:00:00Z');
    const near = target.add({ nanoseconds: 1 });
    const far = target.subtract({ nanoseconds: 2 });

    expect(closestTo(target, [far, near])).toBe(near);
  });

  it('measures PlainDate distance in days, across calendars', () => {
    const target = Temporal.PlainDate.from('2025-01-20');
    const weekBefore = Temporal.PlainDate.from('2025-01-13');
    const threeDaysAfter = Temporal.PlainDate.from('2025-01-23').withCalendar('hebrew');

    expect(closestTo(target, [weekBefore, threeDaysAfter])).toBe(threeDaysAfter);
  });

  it('measures PlainTime distance within one day without wrapping', () => {
    const target = Temporal.PlainTime.from('23:30');
    const earlyMorning = Temporal.PlainTime.from('00:15');
    const evening = Temporal.PlainTime.from('20:00');

    expect(closestTo(target, [earlyMorning, evening])).toBe(evening);
  });

  it('rejects mixed domains', () => {
    const instant = Temporal.Instant.from('2025-01-20T00:00:00Z');
    const date = Temporal.PlainDate.from('2025-01-20');

    // @ts-expect-error PlainDate candidates cannot be compared to an Instant target
    const mixed = () => closestTo(instant, [date]);
    expect(mixed).toThrow(TypeError);
  });
});
