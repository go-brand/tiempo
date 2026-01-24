import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { isPlainTimeEqual } from './isPlainTimeEqual';

describe('isPlainTimeEqual', () => {
  it('returns true when times are equal', () => {
    const nineAM_a = Temporal.PlainTime.from('09:00');
    const nineAM_b = Temporal.PlainTime.from('09:00');

    expect(isPlainTimeEqual(nineAM_a, nineAM_b)).toBe(true);
  });

  it('returns false when times are different', () => {
    const morning = Temporal.PlainTime.from('09:00');
    const evening = Temporal.PlainTime.from('17:00');

    expect(isPlainTimeEqual(morning, evening)).toBe(false);
  });

  it('returns false when only hours differ', () => {
    const nine = Temporal.PlainTime.from('09:30');
    const ten = Temporal.PlainTime.from('10:30');

    expect(isPlainTimeEqual(nine, ten)).toBe(false);
  });

  it('returns false when only minutes differ', () => {
    const early = Temporal.PlainTime.from('09:15');
    const late = Temporal.PlainTime.from('09:45');

    expect(isPlainTimeEqual(early, late)).toBe(false);
  });

  it('returns false when only seconds differ', () => {
    const early = Temporal.PlainTime.from('09:00:15');
    const late = Temporal.PlainTime.from('09:00:45');

    expect(isPlainTimeEqual(early, late)).toBe(false);
  });

  it('considers times with same components as equal', () => {
    const time1 = Temporal.PlainTime.from({ hour: 9, minute: 30, second: 15 });
    const time2 = Temporal.PlainTime.from('09:30:15');

    expect(isPlainTimeEqual(time1, time2)).toBe(true);
  });

  it('handles midnight', () => {
    const midnight1 = Temporal.PlainTime.from('00:00');
    const midnight2 = Temporal.PlainTime.from('00:00:00');

    expect(isPlainTimeEqual(midnight1, midnight2)).toBe(true);
  });

  it('returns false when only sub-second precision differs', () => {
    const time1 = Temporal.PlainTime.from('09:00:00.001');
    const time2 = Temporal.PlainTime.from('09:00:00.002');

    expect(isPlainTimeEqual(time1, time2)).toBe(false);
  });

  it('returns true when sub-second precision is the same', () => {
    const time1 = Temporal.PlainTime.from('09:00:00.123456789');
    const time2 = Temporal.PlainTime.from('09:00:00.123456789');

    expect(isPlainTimeEqual(time1, time2)).toBe(true);
  });

  it('returns false when nanoseconds differ', () => {
    const time1 = Temporal.PlainTime.from('09:00:00.000000001');
    const time2 = Temporal.PlainTime.from('09:00:00.000000002');

    expect(isPlainTimeEqual(time1, time2)).toBe(false);
  });
});
