import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { isPlainDateAfter } from './isPlainDateAfter';

describe('isPlainDateAfter', () => {
  it('returns true when date1 is after date2', () => {
    const jan20 = Temporal.PlainDate.from('2025-01-20');
    const jan25 = Temporal.PlainDate.from('2025-01-25');

    expect(isPlainDateAfter(jan25, jan20)).toBe(true);
  });

  it('returns false when date1 is before date2', () => {
    const jan20 = Temporal.PlainDate.from('2025-01-20');
    const jan25 = Temporal.PlainDate.from('2025-01-25');

    expect(isPlainDateAfter(jan20, jan25)).toBe(false);
  });

  it('returns false when dates are equal', () => {
    const jan20a = Temporal.PlainDate.from('2025-01-20');
    const jan20b = Temporal.PlainDate.from('2025-01-20');

    expect(isPlainDateAfter(jan20a, jan20b)).toBe(false);
  });

  it('compares across months', () => {
    const jan = Temporal.PlainDate.from('2025-01-31');
    const feb = Temporal.PlainDate.from('2025-02-01');

    expect(isPlainDateAfter(feb, jan)).toBe(true);
    expect(isPlainDateAfter(jan, feb)).toBe(false);
  });

  it('compares across years', () => {
    const dec = Temporal.PlainDate.from('2024-12-31');
    const jan = Temporal.PlainDate.from('2025-01-01');

    expect(isPlainDateAfter(jan, dec)).toBe(true);
    expect(isPlainDateAfter(dec, jan)).toBe(false);
  });

  it('handles dates far in the past', () => {
    const past = Temporal.PlainDate.from('1970-01-01');
    const present = Temporal.PlainDate.from('2025-01-20');

    expect(isPlainDateAfter(present, past)).toBe(true);
  });

  it('handles dates far in the future', () => {
    const present = Temporal.PlainDate.from('2025-01-20');
    const future = Temporal.PlainDate.from('2100-01-01');

    expect(isPlainDateAfter(future, present)).toBe(true);
  });
});
