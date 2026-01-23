import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { simpleFormat } from './simpleFormat';

describe('simpleFormat', () => {
  const currentYear = Temporal.Now.plainDateISO().year;

  describe('with ZonedDateTime', () => {
    const currentYearZoned = Temporal.ZonedDateTime.from(
      `${currentYear}-12-23T15:30:00-05:00[America/New_York]`
    );
    const pastYearZoned = Temporal.ZonedDateTime.from(
      '2020-12-23T15:30:00-05:00[America/New_York]'
    );

    it('hides year for current year', () => {
      expect(simpleFormat(currentYearZoned)).toBe('Dec 23');
    });

    it('shows year for past year', () => {
      expect(simpleFormat(pastYearZoned)).toBe('Dec 23, 2020');
    });

    it('shows time in 12h format', () => {
      expect(simpleFormat(currentYearZoned, { time: '12h' })).toBe('Dec 23, 3:30 PM');
    });

    it('shows time in 24h format', () => {
      expect(simpleFormat(currentYearZoned, { time: '24h' })).toBe('Dec 23, 15:30');
    });

    it('shows year and time together', () => {
      expect(simpleFormat(pastYearZoned, { time: '12h' })).toBe('Dec 23, 2020, 3:30 PM');
    });

    it('converts to different timezone', () => {
      // 15:30 in New York = 20:30 UTC
      const result = simpleFormat(currentYearZoned, { timeZone: 'UTC', time: '24h' });
      expect(result).toBe('Dec 23, 20:30');
    });

    it('respects locale', () => {
      expect(simpleFormat(pastYearZoned, { locale: 'es-ES' })).toBe('23 dic 2020');
    });
  });

  describe('with Instant', () => {
    const currentYearInstant = Temporal.Instant.from(`${currentYear}-12-23T20:30:00Z`);
    const pastYearInstant = Temporal.Instant.from('2020-12-23T20:30:00Z');

    it('requires timeZone and hides year for current year', () => {
      expect(simpleFormat(currentYearInstant, { timeZone: 'America/New_York' })).toBe('Dec 23');
    });

    it('shows year for past year', () => {
      expect(simpleFormat(pastYearInstant, { timeZone: 'America/New_York' })).toBe('Dec 23, 2020');
    });

    it('shows time in 12h format', () => {
      // 20:30 UTC = 15:30 New York
      expect(simpleFormat(currentYearInstant, { timeZone: 'America/New_York', time: '12h' }))
        .toBe('Dec 23, 3:30 PM');
    });

    it('shows time in 24h format', () => {
      expect(simpleFormat(currentYearInstant, { timeZone: 'America/New_York', time: '24h' }))
        .toBe('Dec 23, 15:30');
    });

    it('shows time in UTC', () => {
      expect(simpleFormat(currentYearInstant, { timeZone: 'UTC', time: '24h' }))
        .toBe('Dec 23, 20:30');
    });
  });

  describe('with PlainDate', () => {
    const currentYearPlain = Temporal.PlainDate.from(`${currentYear}-12-23`);
    const pastYearPlain = Temporal.PlainDate.from('2020-12-23');

    it('hides year for current year', () => {
      expect(simpleFormat(currentYearPlain)).toBe('Dec 23');
    });

    it('shows year for past year', () => {
      expect(simpleFormat(pastYearPlain)).toBe('Dec 23, 2020');
    });

    it('respects locale', () => {
      expect(simpleFormat(pastYearPlain, { locale: 'de-DE' })).toBe('23. Dez. 2020');
    });
  });

  describe('year option', () => {
    const currentYearZoned = Temporal.ZonedDateTime.from(
      `${currentYear}-12-23T15:30:00-05:00[America/New_York]`
    );
    const pastYearZoned = Temporal.ZonedDateTime.from(
      '2020-12-23T15:30:00-05:00[America/New_York]'
    );

    it('shows year for current year when year: always', () => {
      expect(simpleFormat(currentYearZoned, { year: 'always' })).toBe(`Dec 23, ${currentYear}`);
    });

    it('hides year for past year when year: never', () => {
      expect(simpleFormat(pastYearZoned, { year: 'never' })).toBe('Dec 23');
    });

    it('uses auto behavior when year: auto', () => {
      expect(simpleFormat(currentYearZoned, { year: 'auto' })).toBe('Dec 23');
      expect(simpleFormat(pastYearZoned, { year: 'auto' })).toBe('Dec 23, 2020');
    });

    it('works with time option', () => {
      expect(simpleFormat(currentYearZoned, { year: 'always', time: '12h' }))
        .toBe(`Dec 23, ${currentYear}, 3:30 PM`);
    });

    it('works with PlainDate', () => {
      const currentYearPlain = Temporal.PlainDate.from(`${currentYear}-12-23`);
      expect(simpleFormat(currentYearPlain, { year: 'always' })).toBe(`Dec 23, ${currentYear}`);
    });

    it('works with Instant', () => {
      const currentYearInstant = Temporal.Instant.from(`${currentYear}-12-23T20:30:00Z`);
      expect(simpleFormat(currentYearInstant, { timeZone: 'UTC', year: 'always' }))
        .toBe(`Dec 23, ${currentYear}`);
    });
  });
});
