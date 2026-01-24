import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { isPlainTimeAfter } from './isPlainTimeAfter';

describe('isPlainTimeAfter', () => {
  it('returns true when time1 is after time2', () => {
    const morning = Temporal.PlainTime.from('09:00');
    const evening = Temporal.PlainTime.from('17:00');

    expect(isPlainTimeAfter(evening, morning)).toBe(true);
  });

  it('returns false when time1 is before time2', () => {
    const morning = Temporal.PlainTime.from('09:00');
    const evening = Temporal.PlainTime.from('17:00');

    expect(isPlainTimeAfter(morning, evening)).toBe(false);
  });

  it('returns false when times are equal', () => {
    const nineAM_a = Temporal.PlainTime.from('09:00');
    const nineAM_b = Temporal.PlainTime.from('09:00');

    expect(isPlainTimeAfter(nineAM_a, nineAM_b)).toBe(false);
  });

  it('compares across hours', () => {
    const endOfHour = Temporal.PlainTime.from('09:59');
    const startOfNextHour = Temporal.PlainTime.from('10:00');

    expect(isPlainTimeAfter(startOfNextHour, endOfHour)).toBe(true);
    expect(isPlainTimeAfter(endOfHour, startOfNextHour)).toBe(false);
  });

  it('compares minutes within same hour', () => {
    const early = Temporal.PlainTime.from('09:15');
    const late = Temporal.PlainTime.from('09:45');

    expect(isPlainTimeAfter(late, early)).toBe(true);
    expect(isPlainTimeAfter(early, late)).toBe(false);
  });

  it('compares seconds within same minute', () => {
    const early = Temporal.PlainTime.from('09:00:15');
    const late = Temporal.PlainTime.from('09:00:45');

    expect(isPlainTimeAfter(late, early)).toBe(true);
    expect(isPlainTimeAfter(early, late)).toBe(false);
  });

  it('handles midnight', () => {
    const midnight = Temporal.PlainTime.from('00:00');
    const morning = Temporal.PlainTime.from('09:00');

    expect(isPlainTimeAfter(morning, midnight)).toBe(true);
  });

  it('handles end of day', () => {
    const evening = Temporal.PlainTime.from('17:00');
    const endOfDay = Temporal.PlainTime.from('23:59:59');

    expect(isPlainTimeAfter(endOfDay, evening)).toBe(true);
  });

  it('compares sub-second precision (milliseconds and nanoseconds)', () => {
    const early = Temporal.PlainTime.from('09:00:00.001');
    const late = Temporal.PlainTime.from('09:00:00.999');

    expect(isPlainTimeAfter(late, early)).toBe(true);
    expect(isPlainTimeAfter(early, late)).toBe(false);
  });

  it('distinguishes nanosecond differences', () => {
    const time1 = Temporal.PlainTime.from('09:00:00.000000001');
    const time2 = Temporal.PlainTime.from('09:00:00.000000002');

    expect(isPlainTimeAfter(time2, time1)).toBe(true);
    expect(isPlainTimeAfter(time1, time2)).toBe(false);
  });
});
