import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { isPlainDateEqual } from './isPlainDateEqual';

describe('isPlainDateEqual', () => {
  it('returns true when dates are equal', () => {
    const jan20a = Temporal.PlainDate.from('2025-01-20');
    const jan20b = Temporal.PlainDate.from('2025-01-20');

    expect(isPlainDateEqual(jan20a, jan20b)).toBe(true);
  });

  it('returns false when date1 is before date2', () => {
    const jan20 = Temporal.PlainDate.from('2025-01-20');
    const jan25 = Temporal.PlainDate.from('2025-01-25');

    expect(isPlainDateEqual(jan20, jan25)).toBe(false);
  });

  it('returns false when date1 is after date2', () => {
    const jan20 = Temporal.PlainDate.from('2025-01-20');
    const jan25 = Temporal.PlainDate.from('2025-01-25');

    expect(isPlainDateEqual(jan25, jan20)).toBe(false);
  });

  it('returns true for same date created differently', () => {
    const fromString = Temporal.PlainDate.from('2025-01-20');
    const fromObject = Temporal.PlainDate.from({ year: 2025, month: 1, day: 20 });

    expect(isPlainDateEqual(fromString, fromObject)).toBe(true);
  });

  it('returns false for dates one day apart', () => {
    const jan20 = Temporal.PlainDate.from('2025-01-20');
    const jan21 = Temporal.PlainDate.from('2025-01-21');

    expect(isPlainDateEqual(jan20, jan21)).toBe(false);
  });

  it('handles leap year dates', () => {
    const feb29 = Temporal.PlainDate.from('2024-02-29');
    const feb29Same = Temporal.PlainDate.from('2024-02-29');

    expect(isPlainDateEqual(feb29, feb29Same)).toBe(true);
  });
});
