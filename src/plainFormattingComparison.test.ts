import { describe, expect, expectTypeOf, it } from 'vitest';
import { Temporal as Polyfill } from '@js-temporal/polyfill';
import { Temporal } from './shared/temporal';
import {
  format, formatPlainDate, isBefore, isAfter,
  isPlainDateBefore, isPlainDateAfter, isPlainDateEqual,
  isPlainTimeBefore, isPlainTimeAfter, type FormatOptions,
} from './index';

describe('formatting a PlainDate through format', () => {
  it.each(['en-US', 'es-ES', 'ja-JP'])('matches date-only formatting with locale %s', locale => {
    const date = Temporal.PlainDate.from('2024-01-31');
    expect(format(date, 'yyyy-MM-dd')).toBe('2024-01-31');
    expect(format(date, 'HH:mm')).toBe('HH:mm');
    for (const pattern of ['MMMM d, yyyy', 'EEEE, Mo do G', "yyyy 'birthday'", "HH:mm 'at' yyyy"]) {
      expect(format(date, pattern, { locale })).toBe(formatPlainDate(date, pattern, { locale }));
    }
    expectTypeOf(format(date, 'yyyy')).toEqualTypeOf<string>();
  });

  it('preserves a non-ISO calendar when formatting localized parts', () => {
    const date = Temporal.PlainDate.from('2024-02-10[u-ca=hebrew]');
    expect(format(date, 'yyyy-MM-dd')).toBe('5784-06-01');
    expect(format(date, 'MMMM G')).toBe(formatPlainDate(date, 'MMMM G'));
  });

  it('rejects timezone options for a date without a time', () => {
    const date = Temporal.PlainDate.from('2024-01-31');
    // @ts-expect-error A timezone override requires a timeline value.
    expect(() => format(date, 'yyyy', { timeZone: 'UTC' })).toThrow(TypeError);
    const options: FormatOptions = { timeZone: 'UTC' };
    // @ts-expect-error A predeclared timezone options object is also invalid.
    expect(() => format(date, 'yyyy', options)).toThrow(TypeError);
  });
});

for (const [name, compare, dateCompare, timeCompare] of [
  ['isBefore', isBefore, isPlainDateBefore, isPlainTimeBefore],
  ['isAfter', isAfter, isPlainDateAfter, isPlainTimeAfter],
] as const) {
  describe(`${name} domain-specific overloads`, () => {
    it('orders dates without inventing a timezone', () => {
      const early = Temporal.PlainDate.from('2024-02-10');
      const late = Temporal.PlainDate.from('2024-02-11');
      expect(compare(early, late)).toBe(name === 'isBefore');
      expect(compare(late, early)).toBe(name === 'isAfter');
      expect(compare(early, early)).toBe(false);
      expect(compare(early, late)).toBe(dateCompare(early, late));
      expectTypeOf(compare(early, late)).toEqualTypeOf<boolean>();
    });

    it('orders wall-clock times at nanosecond precision, without midnight wrapping', () => {
      const early = Temporal.PlainTime.from('00:00');
      const late = Temporal.PlainTime.from('23:59:59.999999999');
      expect(compare(early, late)).toBe(name === 'isBefore');
      expect(compare(late, early)).toBe(name === 'isAfter');
      expect(compare(early, early)).toBe(false);
      expect(compare(early, late)).toBe(timeCompare(early, late));
      expect(compare(late.subtract({ nanoseconds: 1 }), late)).toBe(name === 'isBefore');
    });

    it('retains timeline ordering for Instant/ZonedDateTime pairs', () => {
      const instant = Temporal.Instant.from('2024-01-01T00:00Z');
      const same = instant.toZonedDateTimeISO('Asia/Tokyo');
      expect(compare(instant, same)).toBe(false);
      expect(compare(instant, same.add({ nanoseconds: 1 }))).toBe(name === 'isBefore');
      expectTypeOf<Parameters<typeof compare>[0]>().toEqualTypeOf<Temporal.Instant | Temporal.ZonedDateTime>();
    });

    it('rejects mixed plain and timeline domains rather than comparing undefined fields', () => {
      const date = Temporal.PlainDate.from('2024-01-01');
      const time = Temporal.PlainTime.from('00:00');
      const instant = Temporal.Instant.from('2024-01-01T00:00Z');
      // @ts-expect-error Calendar date and instant are different domains.
      expect(() => compare(date, instant)).toThrow(TypeError);
      // @ts-expect-error Domain rejection is symmetric.
      expect(() => compare(instant, date)).toThrow(TypeError);
      // @ts-expect-error Date and clock time are different domains.
      expect(() => compare(date, time)).toThrow(TypeError);
      // @ts-expect-error Clock time and instant are different domains.
      expect(() => compare(time, instant)).toThrow(TypeError);
      // @ts-expect-error Domain rejection is symmetric.
      expect(() => compare(instant, time)).toThrow(TypeError);
    });
  });
}

const Native = (globalThis as unknown as { Temporal?: typeof Polyfill }).Temporal;
it.skipIf(!Native)('compares native/polyfill dates across calendars without reinterpreting their fields', () => {
  const hebrew = Native!.PlainDate.from('2024-02-10[u-ca=hebrew]');
  const same = Polyfill.PlainDate.from('2024-02-10');
  const later = Polyfill.PlainDate.from('2024-02-11');
  expect(isBefore(hebrew, later)).toBe(true);
  expect(isAfter(later, hebrew)).toBe(true);
  expect(isBefore(hebrew, same)).toBe(false);
  expect(isAfter(hebrew, same)).toBe(false);
  expect(isPlainDateBefore(hebrew, later)).toBe(true);
  expect(isPlainDateAfter(later, hebrew)).toBe(true);
  expect(isPlainDateEqual(hebrew, same)).toBe(true);
  expect(isPlainDateEqual(same, hebrew)).toBe(true);
  expect(format(hebrew, 'yyyy-MM-dd')).toBe('5784-06-01');
});

it.skipIf(!Native)('compares native/polyfill PlainTimes in both directions', () => {
  const early = Native!.PlainTime.from('09:00:00.000000001');
  const late = Polyfill.PlainTime.from('09:00:00.000000002');
  expect(isBefore(early, late)).toBe(true);
  expect(isAfter(late, early)).toBe(true);
  expect(isBefore(late, early)).toBe(false);
  expect(isAfter(early, late)).toBe(false);
});

it.skipIf(!Native)('keeps specialized date comparisons interoperable across calendars', () => {
  const native = Native!.PlainDate.from('2024-02-10[u-ca=hebrew]');
  const same = Polyfill.PlainDate.from('2024-02-10');
  const later = Polyfill.PlainDate.from('2024-02-11');
  expect(isPlainDateBefore(native, later)).toBe(true);
  expect(isPlainDateAfter(later, native)).toBe(true);
  expect(isPlainDateEqual(native, same)).toBe(true);
});
