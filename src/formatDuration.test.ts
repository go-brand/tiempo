import { describe, expect, it } from 'vitest';
import { Temporal } from './shared/temporal';
import { formatDuration } from './formatDuration';
import { intervalToDuration } from './intervalToDuration';

describe('formatDuration', () => {
  it('formats a Temporal.Duration with default long en-US style', () => {
    const duration = Temporal.Duration.from({ years: 1, months: 2, days: 3, hours: 4, minutes: 5 });
    expect(formatDuration(duration)).toBe('1 year, 2 months, 3 days, 4 hours, 5 minutes');
  });

  it('formats a plain DurationLike object', () => {
    expect(formatDuration({ hours: 2, minutes: 30 })).toBe('2 hours, 30 minutes');
    expect(formatDuration({ days: 1 })).toBe('1 day');
  });

  it('supports short, narrow, and digital styles', () => {
    expect(formatDuration({ hours: 2, minutes: 30 }, { style: 'short' })).toBe('2 hr, 30 min');
    expect(formatDuration({ hours: 2, minutes: 30 }, { style: 'narrow' })).toBe('2h 30m');
    expect(formatDuration({ hours: 1, minutes: 5, seconds: 9 }, { style: 'digital' })).toBe(
      '1:05:09'
    );
  });

  it('localizes output using Intl.DurationFormat', () => {
    expect(formatDuration({ hours: 2, minutes: 30 }, { locale: 'es-ES' })).toBe(
      '2 horas y 30 minutos'
    );
    expect(formatDuration({ hours: 2, minutes: 30 }, { locale: 'de-DE' })).toBe(
      '2 Stunden, 30 Minuten'
    );
  });

  it('filters units with the format option', () => {
    const duration = Temporal.Duration.from({ years: 1, months: 2, days: 5, hours: 3 });
    expect(formatDuration(duration, { format: ['years', 'months'] })).toBe('1 year, 2 months');
    expect(formatDuration(duration, { format: ['days', 'hours'] })).toBe('5 days, 3 hours');
  });

  it('omits zero units by default and includes them when zero is true', () => {
    expect(formatDuration({ hours: 0, minutes: 30 })).toBe('30 minutes');
    expect(formatDuration({ hours: 0, minutes: 30 }, { zero: true })).toBe('0 hours, 30 minutes');
    expect(
      formatDuration(Temporal.Duration.from({ minutes: 30 }), {
        format: ['hours', 'minutes'],
        zero: true
      })
    ).toBe('0 hours, 30 minutes');
  });

  it('returns an empty string for an all-zero duration unless zero is true', () => {
    expect(formatDuration(Temporal.Duration.from({ seconds: 0 }))).toBe('');
    expect(formatDuration({ seconds: 0 })).toBe('');
    expect(formatDuration({ seconds: 0 }, { zero: true })).toBe('0 seconds');
  });

  it('formats negative durations', () => {
    const duration = Temporal.Duration.from({ hours: -2, minutes: -30 });
    expect(formatDuration(duration)).toBe('-2 hours, 30 minutes');
  });

  it('composes with intervalToDuration', () => {
    const duration = intervalToDuration({
      start: Temporal.ZonedDateTime.from('2025-03-08T09:00:00-05:00[America/New_York]'),
      end: Temporal.ZonedDateTime.from('2025-03-10T10:30:00-04:00[America/New_York]')
    });
    expect(formatDuration(duration)).toBe('2 days, 1 hour, 30 minutes');
  });

  it('rejects non-duration inputs at typecheck', () => {
    // @ts-expect-error formatDuration expects a Duration or DurationLike, not a PlainDate.
    () => formatDuration(Temporal.PlainDate.from('2025-01-01'));
    // @ts-expect-error formatDuration expects a Duration or DurationLike, not an Instant.
    () => formatDuration(Temporal.Instant.from('2025-01-01T00:00:00Z'));
  });
});
