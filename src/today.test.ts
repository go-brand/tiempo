import { describe, it, expect } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { today } from './today';

describe('today', () => {
  it('returns today in local timezone when no timezone is provided', () => {
    const result = today();
    const expected = Temporal.Now.plainDateISO();

    expect(result.year).toBe(expected.year);
    expect(result.month).toBe(expected.month);
    expect(result.day).toBe(expected.day);
  });

  it('returns today in specified timezone', () => {
    const result = today('Europe/Madrid');
    const expected = Temporal.Now.zonedDateTimeISO('Europe/Madrid').toPlainDate();

    expect(result.year).toBe(expected.year);
    expect(result.month).toBe(expected.month);
    expect(result.day).toBe(expected.day);
  });

  it('returns today in UTC', () => {
    const result = today('UTC');
    const expected = Temporal.Now.zonedDateTimeISO('UTC').toPlainDate();

    expect(result.year).toBe(expected.year);
    expect(result.month).toBe(expected.month);
    expect(result.day).toBe(expected.day);
  });

  it('returns a Temporal.PlainDate instance', () => {
    const result = today();
    expect(result).toBeInstanceOf(Temporal.PlainDate);
  });

  it('handles different timezones correctly', () => {
    const tokyo = today('Asia/Tokyo');
    const newYork = today('America/New_York');

    // These might be different dates depending on when the test runs
    // but both should be valid PlainDate instances
    expect(tokyo).toBeInstanceOf(Temporal.PlainDate);
    expect(newYork).toBeInstanceOf(Temporal.PlainDate);
  });
});
