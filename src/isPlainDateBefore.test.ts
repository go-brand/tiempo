import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { isPlainDateBefore } from './isPlainDateBefore';

describe('isPlainDateBefore', () => {
  it('returns true when date1 is before date2', () => {
    const jan20 = Temporal.PlainDate.from('2025-01-20');
    const jan25 = Temporal.PlainDate.from('2025-01-25');

    expect(isPlainDateBefore(jan20, jan25)).toBe(true);
  });

  it('returns false when date1 is after date2', () => {
    const jan20 = Temporal.PlainDate.from('2025-01-20');
    const jan25 = Temporal.PlainDate.from('2025-01-25');

    expect(isPlainDateBefore(jan25, jan20)).toBe(false);
  });

  it('returns false when dates are equal', () => {
    const jan20a = Temporal.PlainDate.from('2025-01-20');
    const jan20b = Temporal.PlainDate.from('2025-01-20');

    expect(isPlainDateBefore(jan20a, jan20b)).toBe(false);
  });

  it('compares across months', () => {
    const jan = Temporal.PlainDate.from('2025-01-31');
    const feb = Temporal.PlainDate.from('2025-02-01');

    expect(isPlainDateBefore(jan, feb)).toBe(true);
    expect(isPlainDateBefore(feb, jan)).toBe(false);
  });

  it('compares across years', () => {
    const dec = Temporal.PlainDate.from('2024-12-31');
    const jan = Temporal.PlainDate.from('2025-01-01');

    expect(isPlainDateBefore(dec, jan)).toBe(true);
    expect(isPlainDateBefore(jan, dec)).toBe(false);
  });

  it('handles dates far in the past', () => {
    const past = Temporal.PlainDate.from('1970-01-01');
    const present = Temporal.PlainDate.from('2025-01-20');

    expect(isPlainDateBefore(past, present)).toBe(true);
  });

  it('handles dates far in the future', () => {
    const present = Temporal.PlainDate.from('2025-01-20');
    const future = Temporal.PlainDate.from('2100-01-01');

    expect(isPlainDateBefore(present, future)).toBe(true);
  });
});
