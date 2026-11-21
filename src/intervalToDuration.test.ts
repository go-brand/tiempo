import { describe, expect, it } from 'vitest';
import { Temporal } from './shared/temporal';
import { intervalToDuration } from './intervalToDuration';

describe('intervalToDuration', () => {
  it('breaks down a ZonedDateTime interval into years, months, days, and time', () => {
    const start = Temporal.ZonedDateTime.from('2025-01-15T09:00:00+00:00[UTC]');
    const end = Temporal.ZonedDateTime.from('2026-03-20T11:30:45+00:00[UTC]');

    const duration = intervalToDuration({ start, end });
    expect(duration.years).toBe(1);
    expect(duration.months).toBe(2);
    expect(duration.days).toBe(5);
    expect(duration.hours).toBe(2);
    expect(duration.minutes).toBe(30);
    expect(duration.seconds).toBe(45);
    expect(duration.toString()).toBe('P1Y2M5DT2H30M45S');
  });

  it('handles DST transitions using calendar days in the start timezone', () => {
    // US spring-forward on 2025-03-09 (23-hour day)
    const start = Temporal.ZonedDateTime.from('2025-03-08T09:00:00-05:00[America/New_York]');
    const end = Temporal.ZonedDateTime.from('2025-03-10T10:30:00-04:00[America/New_York]');

    const duration = intervalToDuration({ start, end });
    expect(duration.days).toBe(2);
    expect(duration.hours).toBe(1);
    expect(duration.minutes).toBe(30);
    expect(duration.toString()).toBe('P2DT1H30M');
  });

  it('normalizes Instant inputs in UTC', () => {
    const start = Temporal.Instant.from('2025-01-01T00:00:00Z');
    const end = Temporal.Instant.from('2025-01-03T04:15:00Z');

    expect(intervalToDuration({ start, end }).toString()).toBe('P2DT4H15M');
  });

  it('projects an end ZonedDateTime or Instant into the start timezone', () => {
    const start = Temporal.ZonedDateTime.from('2025-03-08T09:00:00-05:00[America/New_York]');
    const endUtc = Temporal.Instant.from('2025-03-10T14:30:00Z'); // 10:30 EDT in New York

    expect(intervalToDuration({ start, end: endUtc }).toString()).toBe('P2DT1H30M');
  });

  it('returns a zero duration for equal endpoints', () => {
    const moment = Temporal.Instant.from('2025-06-01T12:00:00Z');
    const duration = intervalToDuration({ start: moment, end: moment });
    expect(duration.blank).toBe(true);
    expect(duration.toString()).toBe('PT0S');
  });

  it('returns a negative duration when end is before start', () => {
    const start = Temporal.PlainDate.from('2025-04-20');
    const end = Temporal.PlainDate.from('2025-01-15');

    const duration = intervalToDuration({ start, end });
    expect(duration.sign).toBe(-1);
    expect(duration.toString()).toBe('-P3M5D');
  });

  it('works with PlainDate intervals', () => {
    const start = Temporal.PlainDate.from('2024-02-29');
    const end = Temporal.PlainDate.from('2025-03-01');

    const duration = intervalToDuration({ start, end });
    expect(duration.years).toBe(1);
    expect(duration.months).toBe(0);
    expect(duration.days).toBe(1);
    expect(duration.toString()).toBe('P1Y1D');
  });

  it('works with PlainTime intervals', () => {
    const start = Temporal.PlainTime.from('09:15:00');
    const end = Temporal.PlainTime.from('17:45:30');

    const duration = intervalToDuration({ start, end });
    expect(duration.hours).toBe(8);
    expect(duration.minutes).toBe(30);
    expect(duration.seconds).toBe(30);
    expect(duration.toString()).toBe('PT8H30M30S');
  });

  it('rejects mixed domains at typecheck and runtime', () => {
    const date = Temporal.PlainDate.from('2025-01-01');
    const time = Temporal.PlainTime.from('09:00');
    const instant = Temporal.Instant.from('2025-01-01T00:00:00Z');

    expect(() =>
      // @ts-expect-error PlainDate and Instant belong to different domains.
      intervalToDuration({ start: date, end: instant })
    ).toThrow(TypeError);

    expect(() =>
      // @ts-expect-error PlainTime and PlainDate belong to different domains.
      intervalToDuration({ start: time, end: date })
    ).toThrow(TypeError);

    expect(() =>
      // @ts-expect-error Instant and PlainTime belong to different domains.
      intervalToDuration({ start: instant, end: time })
    ).toThrow(TypeError);
  });
});
