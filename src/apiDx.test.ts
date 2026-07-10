import { describe, expect, expectTypeOf, it } from 'vitest';
import type { Temporal } from '@js-temporal/polyfill';
import {
  addHours,
  format,
  startOfMonth,
  toInstant,
  toIso,
  toPlainDate,
  toPlainTime,
  toZonedTime,
} from './index';

describe('public API developer experience', () => {
  it('supports a type-directed conversion pipeline from the package root', () => {
    const instant = toInstant('2025-01-20T20:00:00Z');
    const zoned = toZonedTime(instant, 'America/New_York');
    const date = toPlainDate(instant, 'America/New_York');
    const time = toPlainTime(instant, 'America/New_York');

    expectTypeOf(instant).toEqualTypeOf<Temporal.Instant>();
    expectTypeOf(zoned).toEqualTypeOf<Temporal.ZonedDateTime>();
    expectTypeOf(date).toEqualTypeOf<Temporal.PlainDate>();
    expectTypeOf(time).toEqualTypeOf<Temporal.PlainTime>();
    expect(toIso(instant)).toBe('2025-01-20T20:00:00Z');
  });

  it('keeps date boundaries as dates until a timezone is explicit', () => {
    const date = toPlainDate('2025-01-20');
    const calendarBoundary = startOfMonth(date);
    const timelineBoundary = startOfMonth(date, 'UTC');

    expectTypeOf(calendarBoundary).toEqualTypeOf<Temporal.PlainDate>();
    expectTypeOf(timelineBoundary).toEqualTypeOf<Temporal.ZonedDateTime>();
    expect(calendarBoundary.toString()).toBe('2025-01-01');
    expect(timelineBoundary.toString()).toContain('[UTC]');
  });

  it('keeps the current Instant normalization visible in the return type', () => {
    const instant = toInstant('2025-01-20T20:00:00Z');
    const shifted = addHours(instant, 1);

    expectTypeOf(shifted).toEqualTypeOf<Temporal.ZonedDateTime>();
    expect(shifted.timeZoneId).toBe('UTC');
    expect(format(shifted, 'yyyy-MM-dd HH:mm', { timeZone: 'UTC' })).toBe(
      '2025-01-20 21:00'
    );
  });
});
