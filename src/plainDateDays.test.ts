import { Temporal as Polyfill } from '@js-temporal/polyfill';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { Temporal } from './shared/temporal';
import { differenceInDays, eachDayOfInterval } from './index';

const Native = (globalThis as unknown as { Temporal?: typeof Polyfill }).Temporal;
for (const [name, Left, Right] of [
  ['polyfill/polyfill', Polyfill, Polyfill], ['native/native', Native, Native],
  ['polyfill/native', Polyfill, Native], ['native/polyfill', Native, Polyfill],
] as const) {
  describe.skipIf(!Left || !Right)(`PlainDate days: ${name}`, () => {
    it('counts signed whole days across a leap day, including with fractional options', () => {
      const start = Left!.PlainDate.from('2024-02-28');
      const end = Right!.PlainDate.from('2024-03-01');
      expectTypeOf(differenceInDays(end, start)).toEqualTypeOf<number>();
      expect(differenceInDays(end, start)).toBe(2);
      expect(differenceInDays(start, end)).toBe(-2);
      expect(differenceInDays(end, start, { fractional: true })).toBe(2);
      expect(Object.is(differenceInDays(start, Right!.PlainDate.from('2024-02-28')), 0)).toBe(true);
      expect(start.toString()).toBe('2024-02-28');
      expect(end.toString()).toBe('2024-03-01');
    });

    it('returns dates including both endpoints and the leap day', () => {
      const start = Left!.PlainDate.from('2024-02-28');
      const end = Right!.PlainDate.from('2024-03-01');
      const days = eachDayOfInterval({ start, end });
      expectTypeOf(days).toEqualTypeOf<Temporal.PlainDate[]>();
      expect(days.map(day => day.toString())).toEqual(['2024-02-28', '2024-02-29', '2024-03-01']);
      expect(days.every(day => !('timeZoneId' in day) && !('hour' in day))).toBe(true);
      expect(start.toString()).toBe('2024-02-28');
      expect(end.toString()).toBe('2024-03-01');
    });

    it('returns one date for equal bounds and no dates for reversed bounds', () => {
      const start = Left!.PlainDate.from('2025-01-01');
      const end = Right!.PlainDate.from('2025-01-01');
      expect(eachDayOfInterval({ start, end }).map(day => day.toString())).toEqual(['2025-01-01']);
      expect(eachDayOfInterval({ start: start.add({ days: 1 }), end })).toEqual([]);
    });

    it('does not skip dates that a timezone once skipped', () => {
      const start = Left!.PlainDate.from('2011-12-29');
      const end = Right!.PlainDate.from('2011-12-31');
      expect(differenceInDays(end, start)).toBe(2);
      expect(eachDayOfInterval({ start, end }).map(day => day.toString())).toEqual(['2011-12-29', '2011-12-30', '2011-12-31']);
    });

    it('preserves a Hebrew leap-month boundary', () => {
      const start = Left!.PlainDate.from('2024-02-09[u-ca=hebrew]');
      const end = Right!.PlainDate.from('2024-02-11[u-ca=hebrew]');
      expect(differenceInDays(end, start)).toBe(2);
      expect(eachDayOfInterval({ start, end }).map(day => day.toString())).toEqual(['2024-02-09[u-ca=hebrew]', '2024-02-10[u-ca=hebrew]', '2024-02-11[u-ca=hebrew]']);
    });

    it('uses the start calendar for intervals while differences retain Temporal calendar checks', () => {
      const start = Left!.PlainDate.from('2024-02-09[u-ca=hebrew]');
      const end = Right!.PlainDate.from('2024-02-11');
      expect(eachDayOfInterval({ start, end }).map(day => day.toString())).toEqual(['2024-02-09[u-ca=hebrew]', '2024-02-10[u-ca=hebrew]', '2024-02-11[u-ca=hebrew]']);
      expect(() => differenceInDays(end, start)).toThrow(RangeError);
    });

    it('includes the maximum date without stepping outside the supported range', () => {
      const end = Right!.PlainDate.from('+275760-09-13');
      const start = Left!.PlainDate.from('+275760-09-12');
      expect(differenceInDays(end, start)).toBe(1);
      expect(eachDayOfInterval({ start, end }).map(day => day.toString())).toEqual(['+275760-09-12', '+275760-09-13']);
    });
  });
}

it('rejects mixing PlainDate and timeline values in either position', () => {
  const date = Temporal.PlainDate.from('2025-01-01');
  for (const timeline of [Temporal.Instant.from('2025-01-02T00:00Z'), Temporal.ZonedDateTime.from('2025-01-02T00:00[UTC]')]) {
    // @ts-expect-error PlainDate and timeline values require an explicit conversion.
    expect(() => differenceInDays(date, timeline)).toThrow(TypeError);
    // @ts-expect-error PlainDate and timeline values require an explicit conversion.
    expect(() => differenceInDays(timeline, date)).toThrow(TypeError);
    // @ts-expect-error Both interval bounds must be in the same Temporal domain.
    expect(() => eachDayOfInterval({ start: date, end: timeline })).toThrow(TypeError);
    // @ts-expect-error Both interval bounds must be in the same Temporal domain.
    expect(() => eachDayOfInterval({ start: timeline, end: date })).toThrow(TypeError);
  }
});

it('keeps existing timeline inference, UTC defaults and DST behavior', () => {
  expectTypeOf<Parameters<typeof differenceInDays>[0]>().toEqualTypeOf<Temporal.Instant | Temporal.ZonedDateTime>();
  expectTypeOf<ReturnType<typeof eachDayOfInterval>>().toEqualTypeOf<Temporal.ZonedDateTime[]>();
  const start = Temporal.Instant.from('2025-01-01T00:00Z');
  const end = start.add({ hours: 36 });
  const days = eachDayOfInterval({ start, end });
  expectTypeOf(days).toEqualTypeOf<Temporal.ZonedDateTime[]>();
  expect(days.map(day => day.timeZoneId)).toEqual(['UTC', 'UTC']);
  expect(differenceInDays(end, start, { fractional: true })).toBe(1.5);
  const beforeDst = Temporal.ZonedDateTime.from('2025-03-08T12:00[America/New_York]');
  const afterDst = Temporal.ZonedDateTime.from('2025-03-10T12:00[America/New_York]');
  expect(differenceInDays(afterDst, beforeDst)).toBe(2);
});

function rejectedDomains() {
  const date = Temporal.PlainDate.from('2025-01-01');
  const time = Temporal.PlainTime.from('12:00');
  // @ts-expect-error Parsing is an explicit conversion step.
  differenceInDays('2025-01-02', '2025-01-01');
  // @ts-expect-error Clock-only values have no calendar days.
  differenceInDays(time, time);
  // @ts-expect-error Strings must be parsed first.
  eachDayOfInterval({ start: '2025-01-01', end: '2025-01-02' });
  // @ts-expect-error PlainTime endpoints do not define dates.
  eachDayOfInterval({ start: time, end: time });
  // @ts-expect-error Date-only intervals must not synthesize a timezone.
  eachDayOfInterval({ start: date, end: date }, 'UTC');
}
void rejectedDomains;
