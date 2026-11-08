import { Temporal as Polyfill } from '@js-temporal/polyfill';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { Temporal } from './shared/temporal';
import {
  addDays, subDays, addWeeks, subWeeks, addMonths, subMonths,
  addQuarters, subQuarters, addYears, subYears,
} from './index';

const cases = [
  ['addDays', addDays, '2024-02-01', '2024-01-30'],
  ['subDays', subDays, '2024-01-30', '2024-02-01'],
  ['addWeeks', addWeeks, '2024-02-07', '2024-01-24'],
  ['subWeeks', subWeeks, '2024-01-24', '2024-02-07'],
  ['addMonths', addMonths, '2024-02-29', '2023-12-31'],
  ['subMonths', subMonths, '2023-12-31', '2024-02-29'],
  ['addQuarters', addQuarters, '2024-04-30', '2023-10-31'],
  ['subQuarters', subQuarters, '2023-10-31', '2024-04-30'],
  ['addYears', addYears, '2025-01-31', '2023-01-31'],
  ['subYears', subYears, '2023-01-31', '2025-01-31'],
] as const;

for (const [name, operation, positive, negative] of cases) {
  describe(`${name} calendar arithmetic contract`, () => {
    it('accepts a PlainDate and infers a PlainDate result without a timezone', () => {
      const date = Temporal.PlainDate.from('2024-01-31');
      const result = operation(date, 1);
      expectTypeOf(result).toEqualTypeOf<Temporal.PlainDate>();
      expect(result).toBeInstanceOf(Temporal.PlainDate);
      expect(result.toString()).toBe(positive);
      expect(operation(date, -1).toString()).toBe(negative);
      expect(operation(date, 0).toString()).toBe('2024-01-31');
      expect(date.toString()).toBe('2024-01-31');
    });

    it('retains the ZonedDateTime result type for existing timeline callers', () => {
      const instant = Temporal.Instant.from('2024-01-31T12:00Z');
      const zoned = instant.toZonedDateTimeISO('America/New_York');
      const fromInstant = operation(instant, 1);
      const fromZoned = operation(zoned, 1);
      expectTypeOf(fromInstant).toEqualTypeOf<Temporal.ZonedDateTime>();
      expectTypeOf(fromZoned).toEqualTypeOf<Temporal.ZonedDateTime>();
      expect(fromInstant.timeZoneId).toBe('UTC');
      expect(fromZoned.timeZoneId).toBe('America/New_York');
      expect(fromZoned.hour).toBe(7);
    });

    it('preserves a non-ISO calendar, including polyfill caller objects', () => {
      const date = Polyfill.PlainDate.from('2024-02-10[u-ca=hebrew]');
      const result = operation(date, 1);
      expect(result.calendarId).toBe('hebrew');
      expect(result.toString()).toContain('[u-ca=hebrew]');
      expect(date.toString()).toBe('2024-02-10[u-ca=hebrew]');
    });

    it('inherits Temporal rejection of fractional calendar counts', () => {
      expect(() => operation(Temporal.PlainDate.from('2024-01-31'), 1.5)).toThrow(RangeError);
    });
  });
}

it('constrains a leap day when adding and subtracting years', () => {
  const date = Temporal.PlainDate.from('2024-02-29');
  expect(addYears(date, 1).toString()).toBe('2025-02-28');
  expect(subYears(date, 1).toString()).toBe('2023-02-28');
});

it('uses Hebrew months rather than interpreting calendar fields as ISO', () => {
  const date = Temporal.PlainDate.from('2024-02-10[u-ca=hebrew]');
  expect(addMonths(date, 1).toString()).toBe('2024-03-11[u-ca=hebrew]');
  expect(subMonths(addMonths(date, 1), 1).toString()).toBe(date.toString());
});

// Check unsupported domains without executing deliberately invalid calls.
function rejectedInputs() {
  const time = Temporal.PlainTime.from('12:00');
  for (const [, operation] of cases) {
    // @ts-expect-error Calendar arithmetic does not accept clock-only values.
    operation(time, 1);
    // @ts-expect-error Parsing strings is an explicit conversion step.
    operation('2024-01-31', 1);
  }
}
void rejectedInputs;


const Native = (globalThis as unknown as { Temporal?: typeof Polyfill }).Temporal;
it.skipIf(!Native)('accepts native PlainDate callers with either library runtime selection', () => {
  const date = Native!.PlainDate.from('2024-01-31');
  for (const [, operation, positive] of cases) {
    expect(operation(date, 1).toString()).toBe(positive);
  }
});

it('preserves existing timeline signatures when callers use Parameters and ReturnType', () => {
  for (const operation of [addDays, subDays, addWeeks, subWeeks, addMonths, subMonths, addYears, subYears]) {
    expectTypeOf<Parameters<typeof operation>[0]>().toEqualTypeOf<Temporal.Instant | Temporal.ZonedDateTime>();
    expectTypeOf<ReturnType<typeof operation>>().toEqualTypeOf<Temporal.ZonedDateTime>();
  }
});
